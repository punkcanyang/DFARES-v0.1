import type { EthAddress } from './identifier';

/**
 * Represents a Union; corresponds fairly closely with the analogous contract
 * struct
 */
export type Union = {
  unionId: number;
  name: string;
  admin: EthAddress;
  members: EthAddress[];
  level: number;
};

export type UnionMemberData = {
  unionId: number;
  name: string;
  admin: EthAddress;
  members: EthAddress[];
  level: number;
  isInvited: boolean;
};


