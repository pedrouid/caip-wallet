import { EventEmitter } from 'events';
import * as encUtils from 'enc-utils';

import { DirectSecp256k1Wallet } from '@cosmjs/proto-signing';
import { IJsonRpcConnection } from '@json-rpc-tools/types';
import { KeyPair } from 'mnemonic-keyring';
import {
  formatJsonRpcError,
  formatJsonRpcResult,
  JsonRpcRequest,
} from '@json-rpc-tools/utils';

import {
  getCosmosAddressPrefix,
  getCosmosAddress,
  signAmino,
} from '../helpers';

export class CosmosSignerConnection implements IJsonRpcConnection {
  public events = new EventEmitter();

  public wallet: DirectSecp256k1Wallet | undefined;

  private registering = false;

  constructor(
    public url: string,
    public keyPair: KeyPair,
    public chainId: string
  ) {
    this.url = url;
    this.keyPair = keyPair;
    this.chainId = chainId;
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
      const address = getCosmosAddress(this.keyPair.publicKey, this.chainId);
      let result: any;
      switch (request.method) {
        case 'cosmos_getAccounts':
          result = this.wallet.getAccounts();
          break;
        case 'cosmos_signDirect':
          if (
            request.params.signerAddress.toLowerCase() !== address.toLowerCase()
          ) {
            throw new Error(
              `Method ${request.method} targetted incorrect account: ${address}`
            );
          }
          result = await this.wallet.signDirect(
            request.params.signerAddress,
            request.params.signDoc
          );
          break;
        case 'cosmos_signAmino':
          if (
            request.params.signerAddress.toLowerCase() !== address.toLowerCase()
          ) {
            throw new Error(
              `Method ${request.method} targetted incorrect account: ${address}`
            );
          }
          result = await signAmino(this.keyPair, request.params.signDoc);
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

  private async register(url = this.url): Promise<DirectSecp256k1Wallet> {
    if (this.registering) {
      return new Promise((resolve, reject) => {
        this.events.once('open', () => {
          if (typeof this.wallet === 'undefined') {
            return reject(new Error('Cosmos signer is missing or invalid'));
          }
          resolve(this.wallet);
        });
      });
    }
    this.url = url;
    this.registering = true;
    const prefix = getCosmosAddressPrefix(this.chainId);
    const wallet = await DirectSecp256k1Wallet.fromKey(
      encUtils.hexToArray(this.keyPair.privateKey),
      prefix
    );
    this.onOpen(wallet);
    return wallet;
  }

  private onOpen(wallet: DirectSecp256k1Wallet) {
    this.wallet = wallet;
    this.registering = false;
    this.events.emit('open');
  }

  private onClose() {
    this.events.emit('close');
  }
}
