import type { EthAddress, LocationId } from './identifier';

/**
 * Represents a player; corresponds fairly closely with the analogous contract
 * struct
 */
export type Union = {
  admin: EthAddress;
  members: EthAddress[];
  level: int ;
  invites: boolean;;
};
