import { IKeyValueStorage } from 'keyvaluestorage';
import Keyring, { KeyPair } from 'mnemonic-keyring';
import {
  BlockchainJsonRpcConfig,
  IBlockchainAuthenticator,
  IEvents,
  JsonRpcRequest,
  JsonRpcResponse,
  JsonRpcSchemas,
} from '@json-rpc-tools/utils';

export interface ChainAuthenticatorsMap {
  [chainId: string]: IBlockchainAuthenticator;
}

export interface ChainJsonRpcMap {
  [chainId: string]: ChainJsonRpc;
}

export interface ChainJsonRpcRoutes extends BlockchainJsonRpcConfig {
  wallet: {
    accounts: string;
    auth: string[];
  };
}

export type ChainJsonRpc = ChainJsonRpcRoutes & JsonRpcSchemas;

export interface BaseCaipWalletOptions {
  chainIds: string[];
  storage?: IKeyValueStorage;
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

export abstract class ICaipWallet extends IEvents {
  public abstract chains: ChainAuthenticatorsMap;
  public abstract jsonrpc: ChainJsonRpcMap;
  public abstract mnemonic: string;

  constructor(config: CaipWalletConfig) {
    super();
  }

  public abstract getChainIds(): Promise<string[]>;

  public abstract getAccountIds(chainId: string): Promise<string[]>;

  public abstract approve(
    request: JsonRpcRequest,
    chainId: string
  ): Promise<JsonRpcResponse>;

  public abstract reject(
    request: JsonRpcRequest,
    chainId: string
  ): Promise<JsonRpcResponse>;

  public abstract resolve(
    request: JsonRpcRequest,
    chainId: string
  ): Promise<JsonRpcResponse>;
}
