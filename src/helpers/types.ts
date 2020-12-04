import Store from '@pedrouid/iso-store';
import Keyring, { KeyPair } from 'mnemonic-keyring';
import {
  IBlockchainAuthenticator,
  IJsonRpcProvider,
  JsonRpcRequest,
} from '@json-rpc-tools/utils';

export interface ChainAuthenticatorsMap {
  [chainId: string]: IBlockchainAuthenticator;
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

export abstract class IChainSigner {
  public abstract provider: IJsonRpcProvider | undefined;

  constructor(provider: string | IJsonRpcProvider, public keyPair: KeyPair) {}

  public abstract getConfig(): {
    chainId: string;
    accounts: { method: string };
  };

  public abstract connect(provider?: string | IJsonRpcProvider): Promise<void>;

  public abstract disconnect(): Promise<void>;

  public abstract request<Result = any, Params = any>(
    request: JsonRpcRequest<Params>
  ): Promise<Result>;
}
