// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

// Library imports
import {LibDiamond} from "../vendor/libraries/LibDiamond.sol";

// Storage imports
import {WithStorage} from "../libraries/LibStorage.sol";

//Type imports
import {Player, Union} from "../DFTypes.sol";
import {DFWhitelistFacet} from "./DFWhitelistFacet.sol";

contract DFUnionFacet is WithStorage {
    // todo: maybe move to LibStorage.sol/GameConstants
    //
    // uint256 public constant BASE_MAX_MEMBERS = 3;
    // uint256 public constant MEMBERS_PER_LEVEL = 2;
    // uint256 public constant MAX_LEVEL = 3;

    event UnionCreated(address indexed admin);
    event UnionJoined(address indexed union, address indexed member);
    event UnionLeft(address indexed union, address indexed member);
    event AdminTransferred(address indexed union, address indexed newAdmin);
    event UnionDisbanded(address indexed union);
    event UnionLeveledUp(address indexed union, uint256 newLevel);
    event InviteSent(address indexed union, address indexed invitee);
    event InviteAccepted(address indexed union, address indexed member);

    modifier onlyAdmin(address _union) {
        require(us().unions[_union].admin == msg.sender, "Only admin can call this function");
        _;
    }

    modifier onlyMember(address _union) {
        require(isMember(_union, msg.sender), "Only members can call this function");
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

    function createUnion() external onlyWhitelisted {
        require(us().userToUnion[msg.sender] == address(0), "Already part of a union");

        Union storage newUnion = us().unions[msg.sender];
        newUnion.admin = msg.sender;
        newUnion.members.push(msg.sender);
        newUnion.level = 0;

        us().userToUnion[msg.sender] = msg.sender;

        emit UnionCreated(msg.sender);
    }

    function inviteToUnion(address _invitee)
        external
        onlyAdmin(us().userToUnion[msg.sender])
        onlyWhitelisted
    {
        require(us().userToUnion[_invitee] == address(0), "Invitee already part of a union");
        require(_invitee != address(0), "Invalid invitee address");

        Union storage union = us().unions[us().userToUnion[msg.sender]];
        union.invites[_invitee] = true;

        emit InviteSent(us().userToUnion[msg.sender], _invitee);
    }

    function acceptInvite() external onlyWhitelisted {
        require(us().userToUnion[msg.sender] == address(0), "Already part of a union");

        // Check for invitation
        address unionAddress;
        for (uint256 i = 0; i < getAllUnions().length; i++) {
            if (us().unions[getAllUnions()[i]].invites[msg.sender]) {
                unionAddress = getAllUnions()[i];
                break;
            }
        }
        require(unionAddress != address(0), "No valid invitation found");

        Union storage union = us().unions[unionAddress];
        require(union.members.length < getMaxMembers(union.level), "Union is full");

        union.members.push(msg.sender);
        union.invites[msg.sender] = false; // Clear the invitation
        us().userToUnion[msg.sender] = unionAddress;

        emit InviteAccepted(unionAddress, msg.sender);
    }

    function joinUnion(address _union) external onlyWhitelisted {
        require(us().userToUnion[msg.sender] == address(0), "Already part of a union");
        require(_union != address(0), "Invalid union address");

        Union storage union = us().unions[_union];
        require(union.members.length < getMaxMembers(union.level), "Union is full");

        union.members.push(msg.sender);
        us().userToUnion[msg.sender] = _union;

        emit UnionJoined(_union, msg.sender);
    }

    function leaveUnion() external onlyMember(us().userToUnion[msg.sender]) onlyWhitelisted {
        address unionAddress = us().userToUnion[msg.sender];
        Union storage union = us().unions[unionAddress];

        // Remove member from the union
        for (uint256 i = 0; i < union.members.length; i++) {
            if (union.members[i] == msg.sender) {
                union.members[i] = union.members[union.members.length - 1];
                union.members.pop();
                break;
            }
        }

        us().userToUnion[msg.sender] = address(0);

        emit UnionLeft(unionAddress, msg.sender);
    }

    function kickMember(address _member)
        external
        onlyAdmin(us().userToUnion[msg.sender])
        onlyWhitelisted
    {
        require(_member != msg.sender, "Admin cannot kick themselves");

        address unionAddress = us().userToUnion[_member];
        require(unionAddress == us().userToUnion[msg.sender], "Member is not part of your union");

        Union storage union = us().unions[unionAddress];

        // Remove member from the union
        for (uint256 i = 0; i < union.members.length; i++) {
            if (union.members[i] == _member) {
                union.members[i] = union.members[union.members.length - 1];
                union.members.pop();
                break;
            }
        }

        us().userToUnion[_member] = address(0);

        emit UnionLeft(unionAddress, _member);
    }

    function transferAdminRole(address _newAdmin)
        external
        onlyAdmin(us().userToUnion[msg.sender])
        onlyWhitelisted
    {
        require(isMember(us().userToUnion[msg.sender], _newAdmin), "New admin must be a member");

        address unionAddress = us().userToUnion[msg.sender];
        Union storage union = us().unions[unionAddress];

        union.admin = _newAdmin;

        emit AdminTransferred(unionAddress, _newAdmin);
    }

    function disbandUnion() external onlyAdmin(us().userToUnion[msg.sender]) onlyWhitelisted {
        address unionAddress = us().userToUnion[msg.sender];
        Union storage union = us().unions[unionAddress];

        // Clear all members
        for (uint256 i = 0; i < union.members.length; i++) {
            us().userToUnion[union.members[i]] = address(0);
        }

        delete us().unions[unionAddress];

        emit UnionDisbanded(unionAddress);
    }

    function levelUpUnion() external onlyAdmin(us().userToUnion[msg.sender]) onlyWhitelisted {
        address unionAddress = us().userToUnion[msg.sender];
        Union storage union = us().unions[unionAddress];

        uint256 MAX_LEVEL = 3;

        require(union.level < MAX_LEVEL, "Union has reached the maximum level");

        union.level += 1;

        emit UnionLeveledUp(unionAddress, union.level);
    }

    function getMaxMembers(uint256 _level) public pure returns (uint256) {
        uint256 MEMBERS_PER_LEVEL = 2;
        uint256 BASE_MAX_MEMBERS = 3;

        return BASE_MAX_MEMBERS + _level * MEMBERS_PER_LEVEL;
    }

    function isMember(address _union, address _user) public view returns (bool) {
        Union storage union = us().unions[_union];
        for (uint256 i = 0; i < union.members.length; i++) {
            if (union.members[i] == _user) {
                return true;
            }
        }
        return false;
    }

    function getAllUnions() public view returns (address[] memory) {
        uint256 totalUnions = 0;
        address[] memory unionAddresses = new address[](totalUnions);
        uint256 index = 0;
        for (uint256 i = 0; i < unionAddresses.length; i++) {
            if (us().unions[unionAddresses[i]].admin != address(0)) {
                unionAddresses[index] = unionAddresses[i];
                index++;
            }
        }
        return unionAddresses;
    }
}
