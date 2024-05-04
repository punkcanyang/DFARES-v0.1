import type { Abstract } from './utility';

export type LogoType = Abstract<number, 'LogoType'>;

/**
 * Enumeration of logo types.
 */
export const LogoType = {
  Unknown: 0 as LogoType,
  Zeroxparc: 1 as LogoType,
  DarkForest: 2 as LogoType,
  Lattice: 3 as LogoType,
  Redstone: 4 as LogoType,
  Mud: 5 as LogoType,
  Biomes: 6 as LogoType,
  ThisCursedMachine: 7 as LogoType,
  SkyStrife: 8 as LogoType,
  SmallBrainGames: 9 as LogoType,
  DownStream: 10 as LogoType,
  Dear: 11 as LogoType,
  DFARES: 12 as LogoType,
  DFArchon: 13 as LogoType,
  GGQuest: 14 as LogoType,
  YeomenAI: 15 as LogoType,
  Redswap: 16 as LogoType,
  RedstoneMarket: 17 as LogoType,
  PixeLAW: 18 as LogoType,
  Mask: 19 as LogoType,
  AGLDDAO: 20 as LogoType,
  AWHouse: 21 as LogoType,
  OrdenGG: 22 as LogoType,
  DFDAO: 23 as LogoType,
  FunBlocks: 24 as LogoType,
  WASD: 25 as LogoType,
  FunCraft: 26 as LogoType,
  WorldExplorers: 27 as LogoType,
  AWResearch: 28 as LogoType,
  ComposableLabs: 29 as LogoType,
  MetaCat: 30 as LogoType,
  // Don't forget to update MIN_LOGO_TYPE and/or MAX_LOGO_TYPE in the `constants` package
};

/**
 * Mapping from LogoType to pretty-printed names.
 */
export const LogoTypeNames = {
  [LogoType.Unknown]: 'Unknown',
  [LogoType.Zeroxparc]: '0xPARC',
  [LogoType.DarkForest]: 'Dark Forest',
  [LogoType.Lattice]: 'Lattice',
  [LogoType.Redstone]: 'Redstone',
  [LogoType.Mud]: 'MUD',
  [LogoType.Biomes]: 'Biomes',
  [LogoType.ThisCursedMachine]: 'This Cursed Machine',
  [LogoType.SkyStrife]: 'Sky Strife',
  [LogoType.SmallBrainGames]: 'Small Brain Games',
  [LogoType.DownStream]: 'DownStream',
  [LogoType.Dear]: 'Dear',
  [LogoType.DFARES]: 'DFAres',
  [LogoType.DFArchon]: 'DFArchon',
  [LogoType.GGQuest]: 'GGQuest',
  [LogoType.YeomenAI]: 'Yeomen AI',
  [LogoType.Redswap]: 'Redswap',
  [LogoType.RedstoneMarket]: 'RedstoneMarket',
  [LogoType.PixeLAW]: 'PixeLAW',
  [LogoType.Mask]: 'Mask Network',
  [LogoType.AGLDDAO]: 'AGLD DAO',
  [LogoType.AWHouse]: 'AW House',
  [LogoType.OrdenGG]: 'Orden GG',
  [LogoType.DFDAO]: 'DFDAO',
  [LogoType.FunBlocks]: 'FunBlocks',
  [LogoType.WASD]: 'WASD',
  [LogoType.FunCraft]: 'FunCraft',
  [LogoType.WorldExplorers]: 'World Explorers',
  [LogoType.AWResearch]: 'AWResearch',
  [LogoType.ComposableLabs]: 'Composablelabs',
  [LogoType.MetaCat]: 'MetaCat',
} as const;
