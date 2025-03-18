// These are loaded as URL paths by a webpack loader
import diamondContractAbiUrl from '@dfares/contracts/abis/DarkForest.json';
import { createContract, createEthConnection, EthConnection } from '@dfares/network';
import type { Contract, providers, Wallet } from 'ethers';

/**
 * Loads the game contract, which is responsible for updating the state of the game.
 */
export async function loadDiamondContract<T extends Contract>(
  address: string,
  provider: providers.JsonRpcProvider,
  signer?: Wallet
): Promise<T> {
  const abi = await fetch(diamondContractAbiUrl).then((r) => r.json());

  return createContract<T>(address, abi, provider, signer);
}

export function getEthConnection(): Promise<EthConnection> {
  const isProd = process.env.NODE_ENV === 'production';
  const defaultUrl = process.env.DEFAULT_RPC as string;

  let url: string;

  if (isProd) {
    url = localStorage.getItem('XDAI_RPC_ENDPOINT_v5') || defaultUrl;
  } else {
    url =
      localStorage.getItem('SONIC_TESTNET_RPC_URL') ||
      defaultUrl ||
      'https://rpc.blaze.soniclabs.com';
  }

  console.log(`GAME METADATA:`);
  console.log(`rpc url: ${url}`);
  console.log(`is production: ${isProd}`);
  console.log(`webserver url: ${process.env.DF_WEBSERVER_URL}`);
  console.log(`leaderboard url: ${process.env.LEADER_BOARD_URL}`);

  return createEthConnection(url);
}
