import { EventEmitter } from 'events';
import { providers, utils, Wallet } from 'ethers';
import { IJsonRpcConnection } from '@json-rpc-tools/types';
import { KeyPair } from 'mnemonic-keyring';
import {
  formatJsonRpcError,
  formatJsonRpcResult,
  JsonRpcRequest,
} from '@json-rpc-tools/utils';

export class CosmosSignerConnection implements IJsonRpcConnection {
  public events = new EventEmitter();

  public wallet: Wallet | undefined;

  private registering = false;

  constructor(public url: string, public keyPair: KeyPair) {
    this.url = url;
    this.keyPair = keyPair;
  }

  get connected(): boolean {
    return typeof this.wallet !== 'undefined';
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
    this.wallet = await this.register(url);
  }

  public async close(): Promise<void> {
    this.onClose();
  }

  public async send(request: JsonRpcRequest): Promise<void> {
    if (typeof this.wallet === 'undefined') {
      this.wallet = await this.register();
    }

    try {
      const address = await this.wallet.getAddress();
      let result: any;
      switch (request.method) {
        // TODO: relace these with actual Cosmos API methods
        case 'cosmos_getAccounts':
          // FIXME: returning hardcoded address
          result = ['cosmos1t2uflqwqe0fsj0shcfkrvpukewcw40yjj6hdc0'];
          break;
        // TODO: relace these with actual Cosmos API methods
        case 'cosmos_signAmino':
          if (request.params[0].toLowerCase() !== address.toLowerCase()) {
            throw new Error(
              `Method ${request.method} targetted incorrect account: ${address}`
            );
          }
          result = await this.wallet.signMessage(
            utils.isHexString(request.params[1])
              ? utils.arrayify(request.params[1])
              : request.params[1]
          );
          break;
        // TODO: relace these with actual Cosmos API methods
        case 'cosmos_signDirect':
          if (request.params[0].toLowerCase() !== address.toLowerCase()) {
            throw new Error(
              `Method ${request.method} targetted incorrect account: ${address}`
            );
          }
          result = await this.wallet._signTypedData(
            request.params[1].domain,
            request.params[1].types,
            request.params[1].message
          );
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

  private async register(url = this.url): Promise<Wallet> {
    if (this.registering) {
      return new Promise((resolve, reject) => {
        this.events.once('open', () => {
          if (typeof this.wallet === 'undefined') {
            return reject(new Error('EIP155 signer is missing or invalid'));
          }
          resolve(this.wallet);
        });
      });
    }
    this.url = url;
    this.registering = true;
    const wallet = new Wallet(
      this.keyPair.privateKey,
      new providers.JsonRpcProvider(this.url)
    );
    this.onOpen(wallet);
    return wallet;
  }

  private onOpen(wallet: Wallet) {
    this.wallet = wallet;
    this.registering = false;
    this.events.emit('open');
  }

  private onClose() {
    this.events.emit('close');
  }
}
