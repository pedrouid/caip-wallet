import { EventEmitter } from 'events';
import { ChainID } from 'caip';
import { KeyPair } from 'mnemonic-keyring';
import {
  formatJsonRpcError,
  formatJsonRpcResult,
  IJsonRpcConnection,
  IJsonRpcProvider,
  JsonRpcRequest,
  JsonRpcResponse,
} from '@json-rpc-tools/utils';
import { JsonRpcProvider } from '@json-rpc-tools/provider';

import { signers } from '../signers';
import { SignerConnectionOptions } from './types';

export abstract class IBlockchainSignerConnection extends IJsonRpcConnection {
  public abstract keyPair: KeyPair;
  public abstract provider: IJsonRpcProvider;

  constructor(opts: SignerConnectionOptions) {
    super(opts.rpcUrl);
  }
}

export class BlockchainSignerConnection implements IBlockchainSignerConnection {
  public events = new EventEmitter();

  public keyPair: KeyPair;
  public provider: IJsonRpcProvider;

  constructor(opts: SignerConnectionOptions) {
    this.keyPair = opts.keyPair;
    this.provider = new JsonRpcProvider(opts.rpcUrl);
  }

  get connected(): boolean {
    return true;
  }

  get connecting(): boolean {
    return false;
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

  // ---------- Protected ----------------------------------------------- //

  protected onOpen() {
    this.events.emit('open');
  }

  protected onClose() {
    this.events.emit('close');
  }
}

export function getChainSignerConnection(
  chainId: string
): typeof BlockchainSignerConnection {
  const { namespace } = ChainID.parse(chainId);
  const signer = signers[namespace];

  if (!signer) {
    throw new Error(`No matching signer for chainId: ${chainId}`);
  }
  return signer;
}
