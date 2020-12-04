import { EventEmitter } from 'events';
import { providers, utils, Wallet } from 'ethers';
import {
  formatJsonRpcError,
  formatJsonRpcResult,
  IJsonRpcProvider,
  JsonRpcRequest,
  JsonRpcResponse,
} from '@json-rpc-tools/utils';
import { JsonRpcProvider } from '@json-rpc-tools/provider';
import {
  ISignerConnection,
  SignerConnectionOptions,
} from '@json-rpc-tools/blockchain';

export class EIP155SignerConnection implements ISignerConnection {
  public events = new EventEmitter();

  public wallet: Wallet;
  public provider: IJsonRpcProvider;

  constructor(opts: Required<SignerConnectionOptions>) {
    this.provider =
      typeof opts.provider === 'string'
        ? new JsonRpcProvider(opts.provider)
        : opts.provider;
    this.wallet = new Wallet(
      opts.keyPair.privateKey,
      new providers.Web3Provider(this.provider as any)
    );
  }

  get connected(): boolean {
    return true;
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

  public async open(): Promise<void> {
    this.onOpen();
  }

  public async close(): Promise<void> {
    this.onClose();
  }

  public async send(request: JsonRpcRequest): Promise<void> {
    if (request.method.startsWith('eth_signTypedData')) {
      // assume latest spec is being and replace version identifiers
      request.method = 'eth_signTypedData';
    }
    let result: any;
    switch (request.method) {
      case 'eth_sendTransaction':
        result = await this.wallet.sendTransaction(request.params[0]);
        break;
      case 'eth_signTransaction':
        result = await this.wallet.signTransaction(request.params[0]);
        break;
      case 'eth_sign':
        result = this.legacySignMessage(request);
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

  protected legacySignMessage(request: JsonRpcRequest): string {
    const signingKey = new utils.SigningKey(this.wallet.privateKey);
    const sigParams = signingKey.signDigest(utils.arrayify(request.params[1]));
    const result = utils.joinSignature(sigParams);
    return result;
  }

  // ---------- Private ----------------------------------------------- //

  private onOpen() {
    this.events.emit('open');
  }

  private onClose() {
    this.events.emit('close');
  }
}
