import { EventEmitter } from 'events';
import { KeyPair } from 'mnemonic-keyring';
import {
  formatJsonRpcError,
  formatJsonRpcResult,
  IJsonRpcProvider,
  JsonRpcRequest,
} from '@json-rpc-tools/utils';
import { JsonRpcProvider } from '@json-rpc-tools/provider';

import {
  IBlockchainSignerConnection,
  SignerConnectionOptions,
} from '../helpers';

type PolkadotSigner = any;

export class PolkadotSignerConnection implements IBlockchainSignerConnection {
  public events = new EventEmitter();

  public url: string;
  public keyPair: KeyPair;
  public provider: IJsonRpcProvider;

  public signer: PolkadotSigner | undefined;

  private registering = false;

  constructor(opts: SignerConnectionOptions) {
    this.url = opts.rpcUrl;
    this.keyPair = opts.keyPair;
    this.provider = new JsonRpcProvider(opts.rpcUrl);
  }

  get connected(): boolean {
    return typeof this.signer !== 'undefined';
  }

  get connecting(): boolean {
    return this.registering;
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

  public removeListener(event: string, listener: any): void {
    this.events.removeListener(event, listener);
  }

  public async open(url: string = this.url): Promise<void> {
    this.signer = await this.register(url);
  }

  public async close(): Promise<void> {
    this.onClose();
  }

  public async send(request: JsonRpcRequest): Promise<void> {
    if (typeof this.signer === 'undefined') {
      this.signer = await this.register();
    }
    try {
      // TODO: to be implemented
      const address = '';
      let result: any;
      switch (request.method) {
        case 'cosmos_accounts':
          // TODO: to be implemented
          result = [address];
          break;
        case 'cosmos_sign':
          // TODO: to be implemented
          result = '';
          break;
        default:
          break;
      }

      this.events.emit('payload', formatJsonRpcResult(request.id, result));
    } catch (e) {
      this.events.emit('payload', formatJsonRpcError(request.id, e.message));
    }
  }

  // ---------- Private ----------------------------------------------- //

  private async register(url = this.url): Promise<PolkadotSigner> {
    if (this.registering) {
      return new Promise((resolve, reject) => {
        this.events.once('open', () => {
          if (typeof this.signer === 'undefined') {
            return reject(new Error('Polkadot signer is missing or invalid'));
          }
          resolve(this.signer);
        });
      });
    }
    this.url = url;
    this.registering = true;
    const signer = {};
    this.onOpen(signer);
    return signer;
  }

  private onOpen(signer: PolkadotSigner) {
    this.signer = signer;
    this.registering = false;
    this.events.emit('open');
  }

  private onClose() {
    this.events.emit('close');
  }
}
