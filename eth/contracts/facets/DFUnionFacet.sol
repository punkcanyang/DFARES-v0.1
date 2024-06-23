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
    // Round 4 Todo: move to LibStorage.sol/GameConstants
    //
    // uint256 public constant BASE_MAX_MEMBERS = 3;
    // uint256 public constant MEMBERS_PER_LEVEL = 2;
    // uint256 public constant MAX_LEVEL = 3;

    event UnionCreated(uint256 indexed unionId, address indexed creator);
    event InviteSent(uint256 indexed unionId, address indexed invitee);
    event InviteCanceled(uint256 indexed unionId, address indexed invitee);
    event InviteAccepted(uint256 indexed unionId, address indexed invitee);
    event MemberLeft(uint256 indexed unionId, address indexed member);
    event MemberKicked(uint256 indexed unionId, address indexed member);
    event UnionTransferred(
        uint256 indexed unionId,
        address indexed oldAdmin,
        address indexed newAdmin
    );
    event UnionDisbanded(uint256 indexed unionId, address[] members);
    event UnionLeveledUp(uint256 indexed unionId, uint256 newLevel);
    event MemberAddedByAdmin(uint256 indexed unionId, address member);

    modifier onlyAdmin() {
        LibDiamond.enforceIsContractOwner();
        _;
    }

    modifier validUnion(uint256 _unionId) {
        require(gs().unions[_unionId].unionId != 0, "valid union");
        _;
    }

    modifier onlyUnionLeader(uint256 _unionId) {
        require(gs().unions[_unionId].leader == msg.sender, "Only union admin");
        _;
    }

    modifier onlyUnionMember(uint256 _unionId) {
        require(isMember(_unionId, msg.sender), "Caller is not a member of the union");
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

    // utils & getter functions

    function _bulkGetStructs(
        uint256[] storage keys,
        mapping(uint256 => Union) storage data,
        uint256 startIdx,
        uint256 endIdx
    ) internal view returns (Union[] memory ret) {
        ret = new Union[](endIdx - startIdx);
        for (uint256 i = startIdx; i < endIdx; i++) {
            ret[i - startIdx] = data[keys[i]];
        }
    }

    function isMember(uint256 _unionId, address _user) public view returns (bool) {
        return gs().isMember[_unionId][_user];
    }

    function isInvitee(uint256 _unionId, address _user) public view returns (bool) {
        return gs().isInvitee[_unionId][_user];
    }

    function getMaxMembers(uint256 _level) public pure returns (uint256) {
        uint256 MEMBERS_PER_LEVEL = 2;
        uint256 BASE_MAX_MEMBERS = 3;
        return BASE_MAX_MEMBERS + _level * MEMBERS_PER_LEVEL;
    }

    function getAllUnions() public view returns (uint256[] memory) {
        return gs().unionIds;
    }

    function getNUnions() public view returns (uint256) {
        return gs().unionIds.length;
    }

    function unions(uint256 key) public view returns (Union memory) {
        return gs().unions[key];
    }

    function bulkGetUnionIds(uint256 startIdx, uint256 endIdx)
        public
        view
        returns (uint256[] memory ret)
    {
        ret = new uint256[](endIdx = startIdx);
        for (uint256 i = startIdx; i < endIdx; i++) {
            ret[i - startIdx] = gs().unionIds[i];
        }
    }

    function bulkGetUnions(uint256 startIdx, uint256 endIdx)
        public
        view
        returns (Union[] memory ret)
    {
        return _bulkGetStructs(gs().unionIds, gs().unions, startIdx, endIdx);
    }

    // game admin operations

    // Round 4 Todo: add more admin operations

    // Administrator adds a member directly without invitation
    function addMemberByAdmin(uint256 _unionId, address _member)
        public
        onlyAdmin
        validUnion(_unionId)
    {
        require(_member != address(0), "Invalid member address");
        require(gs().players[_member].isInitialized, "Only initialized player");
        require(!isMember(_unionId, _member), "Not in this union");

        Union storage union = gs().unions[_unionId];
        require(union.members.length < getMaxMembers(union.level), "Union is full");

        union.members.push(_member);
        gs().isMember[_unionId][_member] = true;
        gs().players[_member].unionId = _unionId;

        emit MemberAddedByAdmin(_unionId, _member);
    }

    // players operations

    function createUnion(string memory name) external onlyWhitelisted notPaused {
        require(gs().players[msg.sender].isInitialized, "Only initialized player");
        require(gs().players[msg.sender].unionId == 0, "Already part of a union");

        gs().unionCount++;
        gs().unionIds.push(gs().unionCount);

        address[] memory members = new address[](1);
        members[0] = msg.sender;
        address[] memory invitees = new address[](0);

        gs().unions[gs().unionCount] = Union(
            gs().unionCount,
            name,
            msg.sender,
            0,
            members,
            invitees
        );
        gs().players[msg.sender].unionId = gs().unionCount;

        emit UnionCreated(gs().unionCount, msg.sender);
    }

    function inviteMember(uint256 _unionId, address _invitee)
        public
        onlyWhitelisted
        notPaused
        validUnion(_unionId)
        onlyUnionLeader(_unionId)
    {
        require(_invitee != address(0), "Invalid invitee address");
        require(gs().players[_invitee].isInitialized, "Only initialized player");
        require(gs().players[_invitee].unionId == 0, "Invitee already part of a union");
        require(!isMember(_unionId, _invitee), "Invitee is already a member");
        require(!isInvitee(_unionId, _invitee), "Invitee is already in invitee list");

        Union storage union = gs().unions[_unionId];

        union.invitees.push(_invitee);
        gs().isInvitee[union.unionId][_invitee] = true;

        emit InviteSent(_unionId, _invitee);
    }

    function cancelInvite(uint256 _unionId, address _invitee)
        public
        onlyWhitelisted
        notPaused
        validUnion(_unionId)
        onlyUnionLeader(_unionId)
    {
        require(_invitee != address(0), "Invalid invitee address");
        require(gs().players[_invitee].isInitialized, "Only initialized player");
        require(isInvitee(_unionId, _invitee), "Invited before");
        require(!isMember(_unionId, _invitee), "Not member");

        Union storage union = gs().unions[_unionId];

        // Update invite records
        for (uint256 i = 0; i < union.invitees.length; i++) {
            if (union.invitees[i] == _invitee) {
                union.invitees[i] = union.invitees[union.invitees.length - 1];
                union.invitees.pop();
                break;
            }
        }
        gs().isInvitee[_unionId][_invitee] = false;

        emit InviteCanceled(_unionId, _invitee);
    }

    function acceptInvite(uint256 _unionId) public onlyWhitelisted notPaused validUnion(_unionId) {
        require(gs().players[msg.sender].unionId == 0, "Already part of a union");
        require(isInvitee(_unionId, msg.sender), "Not inivited");
        require(!isMember((_unionId), msg.sender), "Already in this union");

        Union storage union = gs().unions[_unionId];
        require(union.members.length < getMaxMembers(union.level), "Union is full");

        gs().players[msg.sender].unionId = _unionId;

        union.members.push(msg.sender);
        gs().isMember[_unionId][msg.sender] = true;

        // Update invite records
        for (uint256 i = 0; i < union.invitees.length; i++) {
            if (union.invitees[i] == msg.sender) {
                union.invitees[i] = union.invitees[union.invitees.length - 1];
                union.invitees.pop();
                break;
            }
        }
        gs().isInvitee[_unionId][msg.sender] = false; // Clear the invitation

        emit InviteAccepted(_unionId, msg.sender);
    }

    function leaveUnion(uint256 _unionId)
        public
        onlyWhitelisted
        notPaused
        validUnion(_unionId)
        onlyUnionMember(_unionId)
    {
        Union storage union = gs().unions[_unionId];
        require(msg.sender != union.leader, "Leader cannot leave the union");

        for (uint256 i = 0; i < union.members.length; i++) {
            if (union.members[i] == msg.sender) {
                union.members[i] = union.members[union.members.length - 1];
                union.members.pop();
                break;
            }
        }
        gs().isMember[_unionId][msg.sender] = false;

        for (uint256 i = 0; i < union.invitees.length; i++) {
            if (union.invitees[i] == msg.sender) {
                union.invitees[i] = union.invitees[union.invitees.length - 1];
                union.invitees.pop();
                break;
            }
        }
        gs().isInvitee[_unionId][msg.sender] = false;

        // Clear user's union reference
        gs().players[msg.sender].unionId = 0;

        emit MemberLeft(_unionId, msg.sender);
    }

    function kickMember(uint256 _unionId, address _member)
        public
        onlyWhitelisted
        notPaused
        validUnion(_unionId)
        onlyUnionLeader(_unionId)
    {
        require(_member != msg.sender, "Admin cannot kick themselves");
        require(isMember(_unionId, _member), "Member is not part of your union");

        Union storage union = gs().unions[_unionId];

        for (uint256 i = 0; i < union.members.length; i++) {
            if (union.members[i] == msg.sender) {
                union.members[i] = union.members[union.members.length - 1];
                union.members.pop();
                break;
            }
        }
        gs().isMember[_unionId][msg.sender] = false;

        for (uint256 i = 0; i < union.invitees.length; i++) {
            if (union.invitees[i] == msg.sender) {
                union.invitees[i] = union.invitees[union.invitees.length - 1];
                union.invitees.pop();
                break;
            }
        }
        gs().isInvitee[_unionId][msg.sender] = false;

        // Clear user's union reference
        gs().players[msg.sender].unionId = 0;

        emit MemberKicked(_unionId, _member);
    }

    function transferLeaderRole(uint256 _unionId, address _newLeader)
        public
        onlyWhitelisted
        notPaused
        validUnion(_unionId)
        onlyUnionLeader(_unionId)
    {
        require(_newLeader != address(0), "invalid address");
        require(gs().players[_newLeader].isInitialized, "only intialized player");
        require(isMember(_unionId, _newLeader), "New admin must be a member");
        require(_newLeader != msg.sender, "change leader");

        Union storage union = gs().unions[_unionId];
        union.leader = _newLeader;

        emit UnionTransferred(_unionId, msg.sender, _newLeader);
    }

    function disbandUnion(uint256 _unionId)
        public
        onlyWhitelisted
        notPaused
        validUnion(_unionId)
        onlyUnionLeader(_unionId)
    {
        Union storage union = gs().unions[_unionId];

        address[] memory members = union.members;
        // Clear all members
        for (uint256 i = 0; i < union.members.length; i++) {
            gs().players[union.members[i]].unionId = 0;
        }

        delete gs().unions[_unionId];

        emit UnionDisbanded(_unionId, members);
    }

    function getLevelUpUnionFee(uint256 level) public pure returns (uint256) {
        uint256 value = 0;
        if (level == 1) value = 0.01 ether;
        else if (level == 2) value = 0.05 ether;
        else if (level == 3) value = 0.1 ether;
        return value;
    }

    function levelUpUnion(uint256 _unionId)
        public
        payable
        onlyWhitelisted
        notPaused
        validUnion(_unionId)
        onlyUnionLeader(_unionId)
    {
        Union storage union = gs().unions[_unionId];

        uint256 MAX_LEVEL = 3;

        require(union.level < MAX_LEVEL, "Union has reached the maximum level");

        uint256 value = getLevelUpUnionFee(union.level + 1);
        require(msg.value == value, "Wrong value sent");

        union.level += 1;

        emit UnionLeveledUp(_unionId, union.level);
    }
}
