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
  generateChainAuthenticators,
} from '../helpers';

export class CaipWallet implements IEvents {
  public events = new EventEmitter();

  public static async init(opts: CaipWalletOptions): Promise<CaipWallet> {
    const keyring = await Keyring.init({ ...opts });
    const chains = generateChainAuthenticators({ ...opts, keyring });
    return new CaipWallet(chains);
  }

  constructor(public chains: ChainAuthenticatorsMap) {
    this.chains = chains;
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

  public async getAccounts(chainId: string): Promise<string[]> {
    return this.chains[chainId].getAccounts();
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
