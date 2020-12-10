import {
  IEvents,
  JsonRpcRequest,
  JsonRpcResponse,
} from '@json-rpc-tools/utils';
import { EventEmitter } from 'events';
import Keyring from 'mnemonic-keyring';

import {
  ChainAuthenticatorsMap,
  CaipWalletOptions,
  generateChainAuthenticator,
} from '../helpers';

export class CaipWallet implements IEvents {
  public events = new EventEmitter();

  public static async init(opts: CaipWalletOptions): Promise<CaipWallet> {
    const { chainIds, store } = opts;
    const keyring = await Keyring.init({ ...opts });
    const chains: ChainAuthenticatorsMap = {};
    chainIds.forEach((chainId: string) => {
      chains[chainId] = generateChainAuthenticator(chainId, keyring, store);
    });
    return new CaipWallet(chains, keyring.mnemonic);
  }

  constructor(public chains: ChainAuthenticatorsMap, public mnemonic: string) {
    this.chains = chains;
    this.mnemonic = mnemonic;
  }

  public on(event: string, listener: any): void {
    this.events.on(event, listener);
  }

  public once(event: string, listener: any): void {
    this.events.once(event, listener);
  }

  public off(event: string, listener: any): void {
    this.events.off(event, listener);
  }

  public async getChainIds(): Promise<string[]> {
    return Object.keys(this.chains);
  }

  public async getAccountIds(chainId: string): Promise<string[]> {
    return (await this.chains[chainId].getAccounts()).map(
      address => `${address}@${chainId}`
    );
  }

  public async approve(
    request: JsonRpcRequest,
    chainId: string
  ): Promise<JsonRpcResponse> {
    return this.chains[chainId].approve(request);
  }

  public async reject(
    request: JsonRpcRequest,
    chainId: string
  ): Promise<JsonRpcResponse> {
    return this.chains[chainId].reject(request);
  }

  public async request(
    request: JsonRpcRequest,
    chainId: string
  ): Promise<JsonRpcResponse> {
    return this.chains[chainId].request(request);
  }
}

export default CaipWallet;
