import { PICTURE_URL } from '@darkforest_eth/constants';
import { LogoType } from '@darkforest_eth/types';

export type Logo = {
  legacy: boolean;
  topLayer: Array<string>;
  bottomLayer: Array<string>;
  // image?: () => Promise<HTMLImageElement>;
};

const URL = PICTURE_URL;

const DF = {
  legacy: false,
  topLayer: [URL + '/img/logo/DF.png'],
  bottomLayer: [],
  // image: () =>
  //   new Promise<HTMLImageElement>((resolve) => {
  //     const img = new Image();
  //     img.src = 'https://cryptologos.cc/logos/dogecoin-doge-logo.svg?v=025';
  //     img.onload = () => resolve(img);
  //   }),
};

const DFARES = {
  legacy: false,
  topLayer: [URL + '/img/logo/DFARES.png'],
  bottomLayer: [],
};

const DFArchon = {
  legacy: false,
  topLayer: [URL + '/img/logo/DFArchon.png'],
  bottomLayer: [],
};

const AltLayer = {
  legacy: false,
  topLayer: [URL + '/img/logo/AltLayer.png'],
  bottomLayer: [],
};

const DeGame = {
  legacy: false,
  topLayer: [URL + '/img/logo/DeGame.png'],
  bottomLayer: [],
};

const FunBlocks = {
  legacy: false,
  topLayer: [URL + '/img/logo/FunBlocks.png'],
  bottomLayer: [],
};

const GamePhylum = {
  legacy: false,
  topLayer: [URL + '/img/logo/GamePhylum.png'],
  bottomLayer: [],
};

const MarrowDAO = {
  legacy: false,
  topLayer: [URL + '/img/logo/MarrowDAO.png'],
  bottomLayer: [],
};

const OrdenGG = {
  legacy: false,
  topLayer: [URL + '/img/logo/OrdenGG.png'],
  bottomLayer: [],
};

const DFDAO = {
  legacy: false,
  topLayer: [URL + '/img/logo/DFDAO.png'],
  bottomLayer: [],
};

const Two77DAO = {
  legacy: false,
  topLayer: [URL + '/img/logo/277DAO.png'],
  bottomLayer: [],
};

const Web3MQ = {
  legacy: false,
  topLayer: [URL + '/img/logo/Web3MQ.png'],
  bottomLayer: [],
};
const Mask = {
  legacy: false,
  topLayer: [URL + '/img/logo/Mask.svg'],
  bottomLayer: [],
};

const AGLDDAO = {
  legacy: false,
  topLayer: [URL + '/img/logo/AGLDDAO.png'],
  bottomLayer: [],
};

const Zero1a1 = {
  legacy: false,
  topLayer: [URL + '/img/logo/01a1.png'],
  bottomLayer: [],
};

const WeirdaoGhostGang = {
  legacy: false,
  topLayer: [URL + '/img/logo/WeirdoGhostGang.png'],
  bottomLayer: [],
};

const Briq = {
  legacy: false,
  topLayer: [URL + '/img/logo/Briq.png'],
  bottomLayer: [],
};

const BlockBeats = {
  legacy: false,
  topLayer: [URL + '/img/logo/BlockBeats.png'],
  bottomLayer: [],
};

const Cointime = {
  legacy: false,
  topLayer: [URL + '/img/logo/Cointime.png'],
  bottomLayer: [],
};

const ChainCatcher = {
  legacy: false,
  topLayer: [URL + '/img/logo/ChainCatcher.png'],
  bottomLayer: [],
};

const ForesightNews = {
  legacy: false,
  topLayer: [URL + '/img/logo/ForesightNews.png'],
  bottomLayer: [],
};

const SeeDAO = {
  legacy: false,
  topLayer: [URL + '/img/logo/SeeDAO.png'],
  bottomLayer: [],
};

const AWHouse = {
  legacy: false,
  topLayer: [URL + '/img/logo/AWHouse.png'],
  bottomLayer: [],
};

const PaladinsDAO = {
  legacy: false,
  topLayer: [URL + '/img/logo/PaladinsDAO.png'],
  bottomLayer: [],
};

const NetherScape = {
  legacy: false,
  topLayer: [URL + '/img/logo/NetherScape.png'],
  bottomLayer: [],
};

const UpchainDAO = {
  legacy: false,
  topLayer: [URL + '/img/logo/UpchainDAO.svg'],
  bottomLayer: [],
};

const LXDAO = {
  legacy: false,
  topLayer: [URL + '/img/logo/LXDAO.png'],
  bottomLayer: [],
};

const MatrixWorld = {
  legacy: false,
  topLayer: [URL + '/img/logo/MatrixWorld.png'],
  bottomLayer: [],
};

const CryptoChasers = {
  legacy: false,
  topLayer: [URL + '/img/logo/CryptoChasers.png'],
  bottomLayer: [],
};

const AWResearch = {
  legacy: false,
  topLayer: [URL + '/img/logo/AWResearch.png'],
  bottomLayer: [],
};

const BlockPi = {
  legacy: false,
  topLayer: [URL + '/img/logo/BlockPi.png'],
  bottomLayer: [],
};

const WhaleDAO = {
  legacy: false,
  topLayer: [URL + '/img/logo/WhaleDAO.png'],
  bottomLayer: [],
};

const Gametaverse = {
  legacy: false,
  topLayer: [URL + '/img/logo/Gametaverse.png'],
  bottomLayer: [],
};

const BuidlerDAO = {
  legacy: false,
  topLayer: [URL + '/img/logo/BuidlerDAO.png'],
  bottomLayer: [],
};

const THUBA = {
  legacy: false,
  topLayer: [URL + '/img/logo/THUBA.png'],
  bottomLayer: [],
};

const NJUBA = {
  legacy: false,
  topLayer: [URL + '/img/logo/NJUBA.png'],
  bottomLayer: [],
};

const RUChain = {
  legacy: false,
  topLayer: [URL + '/img/logo/RUChain.png'],
  bottomLayer: [],
};

const SIEA = {
  legacy: false,
  topLayer: [URL + '/img/logo/SIEA.png'],
  bottomLayer: [],
};

const KawaiiDoge = {
  legacy: false,
  topLayer: [URL + '/img/logo/kawaiidoge.png'],
  bottomLayer: [],
};

export const logoFromType = (type: LogoType): Logo => logos[type];

// export const avatarFromArtifactIdAndImageType = (
//   id: ArtifactId,
//   imageType: number,
//   ifRandom: boolean
// ): LogoType => {
//   const avatars = [
//     LogoType.DFARES,
//     LogoType.Doge,
//     LogoType.Cat,
//     LogoType.ChunZhen,
//     LogoType.IKunBird,
//     LogoType.Mike,
//     LogoType.Panda,
//     LogoType.Pepe,
//     LogoType.PigMan,
//     LogoType.RobotCat,
//     LogoType.TaiKuLa,
//     LogoType.Wojak1,
//     LogoType.Wojak2,
//     LogoType.Wojak3,
//     LogoType.Wojak4,
//     LogoType.DF,
//     LogoType.DFARES,
//     LogoType.DFArchon,
//     LogoType.AltLayer,
//     LogoType.DeGame,
//     LogoType.FunBlocks,
//     LogoType.GamePhylum,
//     LogoType.MarrowDAO,
//     LogoType.OrdenGG,
//     LogoType.DFDAO,
//     LogoType.Two77DAO,
//     LogoType.Web3MQ,
//     LogoType.Mask,
//     LogoType.AGLDDAO,
//     LogoType.Zero1a1,
//     LogoType.WeirdaoGhostGang,
//     LogoType.Briq,
//     LogoType.BlockBeats,
//     LogoType.Cointime,
//     LogoType.ChainCatcher,
//     LogoType.ForesightNews,
//     LogoType.SeeDAO,
//     LogoType.AWHouse,
//     LogoType.PaladinsDAO,
//     LogoType.NetherScape,
//     LogoType.UpchainDAO,
//     LogoType.LXDAO,
//     LogoType.MatrixWorld,
//     LogoType.CryptoChasers,
//     LogoType.AWResearch,
//     LogoType.BlockPi,
//     LogoType.WhaleDAO,
//     LogoType.Gametaverse,
//     LogoType.BuidlerDAO,
//     LogoType.THUBA,
//     LogoType.NJUBA,
//     LogoType.RUChain,
//     LogoType.SIEA,
//   ];
//   if (ifRandom) return avatars[parseInt(id.substring(id.length - 2), 16) % avatars.length];
//   else return avatars[parseInt(imageType.toString()) % avatars.length];
// };

export const logos: Record<LogoType, Logo> = {
  [LogoType.DF]: DF,
  [LogoType.DFARES]: DFARES,
  [LogoType.DFArchon]: DFArchon,
  [LogoType.AltLayer]: AltLayer,
  [LogoType.DeGame]: DeGame,
  [LogoType.FunBlocks]: FunBlocks,
  [LogoType.GamePhylum]: GamePhylum,
  [LogoType.MarrowDAO]: MarrowDAO,
  [LogoType.OrdenGG]: OrdenGG,
  [LogoType.DFDAO]: DFDAO,
  [LogoType.Two77DAO]: Two77DAO,
  [LogoType.Web3MQ]: Web3MQ,
  [LogoType.Mask]: Mask,
  [LogoType.AGLDDAO]: AGLDDAO,
  [LogoType.Zero1a1]: Zero1a1,
  [LogoType.WeirdaoGhostGang]: WeirdaoGhostGang,
  [LogoType.Briq]: Briq,
  [LogoType.BlockBeats]: BlockBeats,
  [LogoType.Cointime]: Cointime,
  [LogoType.ChainCatcher]: ChainCatcher,
  [LogoType.ForesightNews]: ForesightNews,
  [LogoType.SeeDAO]: SeeDAO,
  [LogoType.AWHouse]: AWHouse,
  [LogoType.PaladinsDAO]: PaladinsDAO,
  [LogoType.NetherScape]: NetherScape,
  [LogoType.UpchainDAO]: UpchainDAO,
  [LogoType.LXDAO]: LXDAO,
  [LogoType.MatrixWorld]: MatrixWorld,
  [LogoType.CryptoChasers]: CryptoChasers,
  [LogoType.AWResearch]: AWResearch,
  [LogoType.BlockPi]: BlockPi,
  [LogoType.WhaleDAO]: WhaleDAO,
  [LogoType.Gametaverse]: Gametaverse,
  [LogoType.BuidlerDAO]: BuidlerDAO,
  [LogoType.THUBA]: THUBA,
  [LogoType.NJUBA]: NJUBA,
  [LogoType.RUChain]: RUChain,
  [LogoType.SIEA]: SIEA,
  [LogoType.KawaiiDoge]: KawaiiDoge,
};
