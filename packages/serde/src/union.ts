import type { DarkForest } from '@dfares/contracts/typechain';
import type { Invite, Union, UnionMemberData } from '@dfares/types';
import { address } from './address';

export type RawUnion = Awaited<ReturnType<DarkForest['unions']>>;

/**
 * Converts the raw typechain result of a call which fetches a
 * `UnionTypes.Union` struct, and converts it into an object
 * with type `Union` (see @dfares/types) that can be used by a client.
 *
 * @param rawUnion result of an ethers.js contract call which returns a raw
 * `UnionTypes.Union` struct, typed with typechain.
 */
export function decodeUnion(rawUnion: RawUnion): Union {
  return {
    unionId: rawUnion.unionId.toNumber(),
    name: rawUnion.name,
    admin: address(rawUnion.admin),
    members: rawUnion.members.map((x) => address(x)),
    level: rawUnion.level.toNumber(),
  };
}

export type RawUnionMemberData = Awaited<ReturnType<DarkForest['getUnionPerMember']>>;

export function decodeUnionMemberData(rawUnion: RawUnionMemberData): UnionMemberData {
  return {
    unionId: rawUnion.unionId.toNumber(),
    name: rawUnion.name,
    admin: address(rawUnion.admin),
    members: rawUnion.members.map((x) => address(x)),
    level: rawUnion.level.toNumber(),
    isInvited: rawUnion.isInvited,
  };
}

export type RawInviteData = Awaited<ReturnType<DarkForest['invites']>>;
// Function to decode the raw data into an Invite type
export function decodeInvite(rawInvite: RawInviteData): Invite {
  return {
    unionId: rawInvite.unionId.toNumber(),
    inviter: address(rawInvite.inviter),
    invitee: address(rawInvite.invitee),
    active: rawInvite.active,
  };
}
