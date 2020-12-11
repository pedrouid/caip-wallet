import Store from '@pedrouid/iso-store';
import Keyring, { KeyPair } from 'mnemonic-keyring';
import { IBlockchainAuthenticator } from '@json-rpc-tools/utils';
import { ChainJsonRpc } from 'caip-api';

export interface ChainAuthenticatorsMap {
  [chainId: string]: IBlockchainAuthenticator;
}

export interface ChainJsonRpcMap {
  [chainId: string]: ChainJsonRpc;
}

export interface BaseCaipWalletOptions {
  chainIds: string[];
  store?: Store;
}

export interface GenerateChainAuthenticatorsOptions
  extends BaseCaipWalletOptions {
  keyring: Keyring;
}

export interface CaipWalletOptions extends BaseCaipWalletOptions {
  mnemonic?: string;
}

export interface CaipWalletConfig {
  chains: ChainAuthenticatorsMap;
  jsonrpc: ChainJsonRpcMap;
  mnemonic: string;
}

export interface SignerConnectionOptions {
  rpcUrl: string;
  keyPair: KeyPair;
}
