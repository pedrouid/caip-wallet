import Store from '@pedrouid/iso-store';
import Keyring, { KeyPair } from 'mnemonic-keyring';
import {
  IBlockchainAuthenticator,
  IJsonRpcProvider,
  JsonRpcRequest,
} from '@json-rpc-tools/utils';

export interface AuthenticatorMap {
  [chainId: string]: IBlockchainAuthenticator;
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
