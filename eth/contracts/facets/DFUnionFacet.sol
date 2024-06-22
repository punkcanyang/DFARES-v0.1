// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

// Library imports
import {LibDiamond} from "../vendor/libraries/LibDiamond.sol";

// Storage imports
import {WithStorage} from "../libraries/LibStorage.sol";

//Type imports
import {Player, Union, UnionMemberData} from "../DFTypes.sol";
import {DFWhitelistFacet} from "./DFWhitelistFacet.sol";

contract DFUnionFacet is WithStorage {
    // Round 4 Todo: maybe move to LibStorage.sol/GameConstants
    //
    // uint256 public constant BASE_MAX_MEMBERS = 3;
    // uint256 public constant MEMBERS_PER_LEVEL = 2;
    // uint256 public constant MAX_LEVEL = 3;

    event UnionCreated(uint256 indexed unionId);
    event UnionJoined(uint256 indexed unionId, address indexed member);
    event UnionLeft(uint256 indexed unionId, address indexed member);
    event AdminTransferred(uint256 indexed unionId, address indexed newAdmin);
    event UnionDisbanded(uint256 indexed unionId);
    event UnionLeveledUp(uint256 indexed unionId, uint256 newLevel);
    event InviteSent(uint256 indexed unionId, address indexed invitee);
    event InviteAccepted(uint256 indexed unionId, address indexed member);

    // Round 4 Todo: ?
    event PlayerSetUnion(address indexed player, uint256 indexed unionId);

    modifier validUnion(uint256 _unionId) {
        require(gs().unions[_unionId].unionId != 0, "valid union");
        _;
    }

    modifier onlyAdmin(uint256 _unionId) {
        require(gs().unions[_unionId].admin == msg.sender, "Only admin can call this function");
        _;
    }

    modifier onlyMember(uint256 _unionId) {
        require(isMember(_unionId, msg.sender), "Only members can call this function");
        _;
    }

    modifier onlyWhitelisted() {
        require(
            DFWhitelistFacet(address(this)).isWhitelisted(msg.sender) ||
                msg.sender == LibDiamond.contractOwner(),
            "Player is not whitelisted"
        );
        _;
    }

    modifier notPaused() {
        require(!gs().paused, "Game is paused");
        _;
    }

    function createUnion(string memory name) external onlyWhitelisted {
        require(gs().userToUnion[msg.sender] == 0, "Already part of a union");
        //NOTE: start from 0
        gs().unionIdx++;
        gs().unionIds.push(gs().unionIdx);

        address[1] memory singleAddress = [msg.sender];
        address[] memory dynamicAddresses = new address[](1);
        dynamicAddresses[0] = singleAddress[0];

        gs().unions[gs().unionIdx] = Union(gs().unionIdx, name, msg.sender, dynamicAddresses, 0);
        gs().userToUnion[msg.sender] = gs().unionIdx;
        emit UnionCreated(gs().unionIdx);
    }

    function inviteToUnion(uint256 _unionId, address _invitee)
        external
        validUnion(_unionId)
        onlyAdmin(_unionId)
        onlyWhitelisted
    {
        require(gs().userToUnion[_invitee] == 0, "Invitee already part of a union");
        require(_invitee != address(0), "Invalid invitee address");

        Union storage union = gs().unions[gs().userToUnion[msg.sender]];
        gs().invites[union.unionId][_invitee] = true;

        emit InviteSent(gs().userToUnion[msg.sender], _invitee);
    }

    function acceptInvite(uint256 _unionId) external validUnion(_unionId) onlyWhitelisted {
        require(gs().userToUnion[msg.sender] == 0, "Already part of a union");

        require(gs().invites[_unionId][msg.sender], "not inivited");

        Union storage union = gs().unions[_unionId];
        require(union.members.length < getMaxMembers(union.level), "Union is full");

        union.members.push(msg.sender);
        gs().invites[_unionId][msg.sender] = false; // Clear the invitation
        gs().userToUnion[msg.sender] = _unionId;

        emit InviteAccepted(_unionId, msg.sender);
    }


    function leaveUnion(uint256 _unionId) external validUnion(_unionId) onlyMember(_unionId) onlyWhitelisted {
        Union storage union = gs().unions[_unionId];
        require(msg.sender != union.admin, "Not admin");

        // Find the index of msg.sender in union.members
        uint256 indexToRemove;
        for (uint256 i = 0; i < union.members.length; i++) {
            if (union.members[i] == msg.sender) {
                indexToRemove = i;
                break;
            }
        }

        require(indexToRemove < union.members.length, "Member not found");

        // Swap with the last member and then pop the last member
        union.members[indexToRemove] = union.members[union.members.length - 1];
        union.members.pop();

        // Clear user's union reference
         gs().userToUnion[msg.sender] = 0;

        emit UnionLeft(_unionId, msg.sender);
    }

    function kickMember(uint256 _unionId, address _member)
        external
        validUnion(_unionId)
        onlyAdmin(_unionId)
        onlyWhitelisted
    {
        require(_member != msg.sender, "Admin cannot kick themselves");
        require(gs().userToUnion[msg.sender] == _unionId, "Member is not part of your union");

        Union storage union = gs().unions[_unionId];

        uint256 indexToRemove;
        for (uint256 i = 0; i < union.members.length; i++) {
            if (union.members[i] == msg.sender) {
                indexToRemove = i;
                break;
            }
        }

        require(indexToRemove < union.members.length, "Member not found");

        // Swap with the last member and then pop the last member
        union.members[indexToRemove] = union.members[union.members.length - 1];
        union.members.pop();

        gs().userToUnion[_member] = 0;

        emit UnionLeft(_unionId, _member);
    }

    function transferAdminRole(uint256 _unionId, address _newAdmin)
        external
        validUnion(_unionId)
        onlyAdmin(_unionId)
        onlyWhitelisted
    {
        require(isMember(_unionId, _newAdmin), "New admin must be a member");
        Union storage union = gs().unions[_unionId];
        union.admin = _newAdmin;

        emit AdminTransferred(_unionId, _newAdmin);
    }

    function disbandUnion(uint256 _unionId)
        external
        validUnion(_unionId)
        onlyAdmin(_unionId)
        onlyWhitelisted
    {
        Union storage union = gs().unions[_unionId];

        // Clear all members
        for (uint256 i = 0; i < union.members.length; i++) {
            gs().userToUnion[union.members[i]] = 0;
        }

        delete gs().unions[_unionId];

        emit UnionDisbanded(_unionId);
    }

    function levelUpUnion(uint256 _unionId)
        external
        validUnion(_unionId)
        onlyAdmin(_unionId)
        onlyWhitelisted
    {
        Union storage union = gs().unions[_unionId];

        uint256 MAX_LEVEL = 3;

        require(union.level < MAX_LEVEL, "Union has reached the maximum level");

        //Round 4 Todo: add more requirements

        union.level += 1;

        emit UnionLeveledUp(_unionId, union.level);
    }

    function getMaxMembers(uint256 _level) public pure returns (uint256) {
        uint256 MEMBERS_PER_LEVEL = 2;
        uint256 BASE_MAX_MEMBERS = 3;

        return BASE_MAX_MEMBERS + _level * MEMBERS_PER_LEVEL;
    }

    function isMember(uint256 _unionId, address _user) public view returns (bool) {
        Union storage union = gs().unions[_unionId];
        for (uint256 i = 0; i < union.members.length; i++) {
            if (union.members[i] == _user) {
                return true;
            }
        }
        return false;
    }

    function getAllUnions() public view returns (uint256[] memory) {
        return gs().unionIds;
    }

    function getUnionPerMember(uint256 _unionId, address _user)
        external
        view
        returns (UnionMemberData memory)
    {
        Union storage union = gs().unions[_unionId];

        UnionMemberData memory unionDetails = UnionMemberData(
            union.unionId,
            union.name,
            union.admin,
            union.members,
            union.level,
            gs().invites[_unionId][_user]
        );

        return unionDetails;
    }

    function unions(uint256 key) public view returns (Union memory) {
        return gs().unions[key];
    }

    // Round 4 Todo: why setUnion ?
    //
    // setUnionMembers
    function setUnion(uint256 unionId) public notPaused {
        require(
            gs().players[msg.sender].isInitialized,
            "Only initialized player can perform that operation with union."
        );
        // require( _Member1, "Set Union member 1.");
        // require( _Member2 , "Set Union member 2.");
        // require( _Member3 , "Set Union member 3.");
        // gs().players[msg.sender].union = _Member1;
        // emit PlayerSetUnion(msg.sender, _Member1);
        emit PlayerSetUnion(msg.sender, unionId);
    }
}
