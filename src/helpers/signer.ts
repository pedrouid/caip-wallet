import { EventEmitter } from 'events';
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
  ISignerConnection,
  SignerConnectionOptions,
} from '@json-rpc-tools/blockchain';

export class BlockchainSignerConnection implements ISignerConnection {
  public events = new EventEmitter();

  public keyPair: KeyPair;
  public provider: IJsonRpcProvider;

  constructor(opts: Required<SignerConnectionOptions>) {
    this.keyPair = opts.keyPair;
    this.provider =
      typeof opts.provider === 'string'
        ? new JsonRpcProvider(opts.provider)
        : opts.provider;
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
    let response: JsonRpcResponse;
    try {
      const result = await this.provider.request(request);
      response = formatJsonRpcResult(request.id, result);
    } catch (e) {
      response = formatJsonRpcError(request.id, e.message);
    }
    this.events.emit('payload', response);
  }

  // ---------- Private ----------------------------------------------- //

  private onOpen() {
    this.events.emit('open');
  }

  private onClose() {
    this.events.emit('close');
  }
}
