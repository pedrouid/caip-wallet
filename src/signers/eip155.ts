import { EventEmitter } from 'events';
import { providers, utils, Wallet } from 'ethers';
import { KeyPair } from 'mnemonic-keyring';
import {
  formatJsonRpcError,
  formatJsonRpcResult,
  IJsonRpcProvider,
  JsonRpcRequest,
  JsonRpcResponse,
} from '@json-rpc-tools/utils';
import { JsonRpcProvider } from '@json-rpc-tools/provider';

import {
  IBlockchainSignerConnection,
  SignerConnectionOptions,
} from '../helpers';

export class EIP155SignerConnection implements IBlockchainSignerConnection {
  public events = new EventEmitter();

  public url: string;
  public keyPair: KeyPair;
  public provider: IJsonRpcProvider;

  public wallet: Wallet | undefined;

  private registering = false;

  constructor(opts: SignerConnectionOptions) {
    this.url = opts.rpcUrl;
    this.keyPair = opts.keyPair;
    this.provider = new JsonRpcProvider(opts.rpcUrl);
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
    if (request.method.startsWith('eth_signTypedData')) {
      // assume latest spec is being and replace version identifiers
      request.method = 'eth_signTypedData';
    }
    let result: any;
    switch (request.method) {
      case 'eth_accounts':
        result = [await this.wallet.getAddress()];
        break;
      case 'eth_sendTransaction':
        result = await this.wallet.sendTransaction(request.params[0]);
        break;
      case 'eth_signTransaction':
        result = await this.wallet.signTransaction(request.params[0]);
        break;
      case 'eth_sign':
        result = await this.legacySignMessage(request);
        break;
      case 'eth_signTypedData':
        result = await this.wallet._signTypedData(
          request.params[1].domain,
          request.params[1].types,
          request.params[1].message
        );
        break;
      case 'personal_sign':
        result = await this.wallet.signMessage(
          utils.isHexString(request.params[0])
            ? utils.arrayify(request.params[0])
            : request.params[0]
        );
        break;
      default:
        break;
    }
    let response: JsonRpcResponse;
    try {
      response = formatJsonRpcResult(request.id, result);
    } catch (e) {
      response = formatJsonRpcError(request.id, e.message);
    }

    this.events.emit('payload', response);
  }

  // ---------- Protected ----------------------------------------------- //

  protected async legacySignMessage(request: JsonRpcRequest): Promise<string> {
    if (typeof this.wallet === 'undefined') {
      this.wallet = await this.register();
    }
    const signingKey = new utils.SigningKey(this.wallet.privateKey);
    const sigParams = signingKey.signDigest(utils.arrayify(request.params[1]));
    const result = utils.joinSignature(sigParams);
    return result;
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
