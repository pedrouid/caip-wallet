import { EventEmitter } from 'events';
import { IJsonRpcConnection, JsonRpcRequest } from '@json-rpc-tools/utils';

import { ISigner } from './signer';
import { ISignerMiddleware } from './middleware';

export class SignerConnection implements IJsonRpcConnection {
  public events = new EventEmitter();

  constructor(private signer: ISigner, public middleware: ISignerMiddleware) {
    this.signer = signer;
    this.middleware = middleware;
  }

  get connected(): boolean {
    return true;
  }

  public on(event: string, listener: any): void {
    this.middleware.on(event, listener);
  }

  public once(event: string, listener: any): void {
    this.middleware.once(event, listener);
  }

  public off(event: string, listener: any): void {
    this.middleware.off(event, listener);
  }

  public async open(): Promise<void> {
    this.onOpen();
  }

  public async close(): Promise<void> {
    this.onClose();
  }

  public async send(request: JsonRpcRequest): Promise<void> {
    const message = await this.middleware.before(request);
    const signature = await this.signer.sign(message);
    const response = await this.middleware.after(signature);
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
