import type { Abstract } from './utility';

export type AvatarType = Abstract<number, 'AvatarType'>;

/**
 * Enumeration of avatar types.
 */
export const AvatarType = {
  Unknown: 0 as AvatarType,
  Jasonlool: 1 as AvatarType,
  Santagnel: 2 as AvatarType,
  OriginTiger: 3 as AvatarType,
  Zeroxviviyorg: 4 as AvatarType,
  Ikun: 5 as AvatarType,
  BaliGee: 6 as AvatarType,
  DDY: 7 as AvatarType,
  Blue: 8 as AvatarType,
  DeFi3: 9 as AvatarType,
  // Don't forget to update MIN_AVATAR_TYPE and/or MAX_AVATAR_TYPE in the `constants` package
};

/**
 * Mapping from AvatarType to pretty-printed names.
 */
export const AvatarTypeNames = {
  [AvatarType.Unknown]: 'Unknown',
  [AvatarType.Jasonlool]: 'Jasonlool',
  [AvatarType.Santagnel]: 'Santagnel',
  [AvatarType.OriginTiger]: 'Orgin Tiger',
  [AvatarType.Zeroxviviyorg]: '0xviviyorg',
  [AvatarType.Ikun]: 'ikun',
  [AvatarType.BaliGee]: 'Bali Gee',
  [AvatarType.DDY]: 'ddy',
  [AvatarType.Blue]: 'blue',
  [AvatarType.DeFi3]: 'defi3',
} as const;
