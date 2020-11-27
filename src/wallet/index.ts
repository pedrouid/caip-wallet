import {
  IEvents,
  JsonRpcRequest,
  JsonRpcResponse,
} from '@json-rpc-tools/utils';
import Store from '@pedrouid/iso-store';
import { EventEmitter } from 'events';
import Keyring from 'mnemonic-keyring';

import {
  AuthenticatorMap,
  CaipWalletOptions,
  generateAuthMap,
} from '../helpers';

export class CaipWallet implements IEvents {
  public events = new EventEmitter();

  public static async init(opts: CaipWalletOptions): Promise<CaipWallet> {
    const keyring = await Keyring.init({
      store: opts.store,
      mnemonic: opts.mnemonic,
    });
    const auth = generateAuthMap({ ...opts, keyring });
    return new CaipWallet(opts.store, keyring, auth);
  }

  constructor(
    public store: Store,
    public keyring: Keyring,
    public auth: AuthenticatorMap
  ) {
    this.store = store;
    this.keyring = keyring;
    this.auth = auth;
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
    return this.auth[chainId].getAccounts();
  }

  public async approve(
    request: JsonRpcRequest,
    chainId: string
  ): Promise<JsonRpcResponse> {
    return this.auth[chainId].approve(request);
  }

  public async resolve(
    request: JsonRpcRequest,
    chainId: string
  ): Promise<JsonRpcResponse> {
    return this.auth[chainId].resolve(request);
  }
}

export default CaipWallet;
