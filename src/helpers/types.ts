import Store from '@pedrouid/iso-store';
import Keyring from 'mnemonic-keyring';
import { IJsonRpcProvider, IJsonRpcAuthenticator } from '@json-rpc-tools/utils';

export type ChainSigner = IJsonRpcProvider;

export type ChainAuthenticator = IJsonRpcAuthenticator;

export interface AuthenticatorMap {
  [chainId: string]: ChainAuthenticator;
}

export interface GenerateAuthMapOptions {
  store: Store;
  keyring: Keyring;
  chainIds: string[];
}

export interface CaipWalletOptions {
  store: Store;
  chainIds: string[];
  mnemonic?: string;
}
