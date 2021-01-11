import {
  formatJsonRpcRequest,
  isJsonRpcError,
  JsonRpcRequest,
  JsonRpcResponse,
} from '@json-rpc-tools/utils';
import { EventEmitter } from 'events';

import {
  ChainAuthenticatorsMap,
  CaipWalletOptions,
  ChainJsonRpcMap,
  CaipWalletConfig,
  ICaipWallet,
  generateCaipWalletConfig,
} from '../helpers';

export class CaipWallet implements ICaipWallet {
  public events = new EventEmitter();

  public chains: ChainAuthenticatorsMap;
  public jsonrpc: ChainJsonRpcMap;
  public mnemonic: string;

  public static async init(opts: CaipWalletOptions): Promise<CaipWallet> {
    const config = await generateCaipWalletConfig(opts);
    return new CaipWallet(config);
  }

  constructor(config: CaipWalletConfig) {
    this.chains = config.chains;
    this.jsonrpc = config.jsonrpc;
    this.mnemonic = config.mnemonic;
    this.registerEventListeners();
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

  public async getChainIds(): Promise<string[]> {
    return Object.keys(this.chains);
  }

  public async getAccountIds(chainId: string): Promise<string[]> {
    const method = this.jsonrpc[chainId].wallet.accounts;
    const request = formatJsonRpcRequest(method, []);
    const response = await this.chains[chainId].resolve(request);
    if (isJsonRpcError(response)) {
      throw new Error(response.error.message);
    }
    const accounts = response.result.map(address => `${address}@${chainId}`);
    return accounts;
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

  public async resolve(
    request: JsonRpcRequest,
    chainId: string
  ): Promise<JsonRpcResponse> {
    return this.chains[chainId].resolve(request);
  }

  // ---------- Private ----------------------------------------------- //

  private registerEventListeners() {
    Object.keys(this.chains).forEach(chainId => {
      this.chains[chainId].on('pending_approval', (request: JsonRpcRequest) => {
        this.events.emit('pending_approval', { chainId, request });
      });
    });
  }
}

export default CaipWallet;
