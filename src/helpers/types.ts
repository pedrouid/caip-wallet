import { IJsonRpcProvider } from '@json-rpc-tools/types';
import { ChainsMap, ChainJsonRpc } from 'caip-api';
import { KeyValueStorage } from 'keyvaluestorage';

export interface WalletOptions {
  chains: string[];
  mnemonic?: string;
  storage?: KeyValueStorage;
}

export interface ProvidersMap {
  [chainId: string]: IJsonRpcProvider;
}

export interface NamespaceConfig {
  chains: ChainsMap;
  jsonrpc: ChainJsonRpc;
}

export type NamespaceMap = {
  [namespace: string]: NamespaceConfig;
};

export interface WalletConfig {
  mnemonic: string;
  providers: ProvidersMap;
  namespaces: NamespaceMap;
}
