/**
 * This package contains deployed contract addresses, ABIs, and Typechain types
 * for the Dark Forest game.
 *
 * ## Installation
 *
 * You can install this package using [`npm`](https://www.npmjs.com) or
 * [`yarn`](https://classic.yarnpkg.com/lang/en/) by running:
 *
 * ```bash
 * npm install --save @darkforest_eth/contracts
 * ```
 * ```bash
 * yarn add @darkforest_eth/contracts
 * ```
 *
 * When using this in a plugin, you might want to load it with [skypack](https://www.skypack.dev)
 *
 * ```js
 * import * as contracts from 'http://cdn.skypack.dev/@darkforest_eth/contracts'
 * ```
 *
 * ## Typechain
 *
 * The Typechain types can be found in the `typechain` directory.
 *
 * ## ABIs
 *
 * The contract ABIs can be found in the `abis` directory.
 *
 * @packageDocumentation
 */

/**
 * The name of the network where these contracts are deployed.
 */
export const NETWORK = 'altlayer';
/**
 * The id of the network where these contracts are deployed.
 */
export const NETWORK_ID = 4000002;
/**
 * The block in which the DarkForest contract was initialized.
 */
export const START_BLOCK = 678806;
/**
 * The address for the DarkForest contract.
 */
export const CONTRACT_ADDRESS = '0xd0B8067D4DAe59250A04D35Ea7C53CFE4bE06C4d';
/**
 * The address for the initalizer contract. Useful for lobbies.
 */
export const INIT_ADDRESS = '0x1A516C9053BcdF9ddb5cE7f5b17A9239423EcDAD';