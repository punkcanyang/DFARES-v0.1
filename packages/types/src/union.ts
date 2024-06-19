import type { EthAddress } from './identifier';

/**
 * Represents a player; corresponds fairly closely with the analogous contract
 * struct
 */
export type Union = {
  admin: EthAddress;
  members: EthAddress[];
  level: number;
  invites: boolean[];
};

export type UnionMember = {
  admin: EthAddress;
  members: EthAddress[];
  level: number;
  invites: boolean;
};
