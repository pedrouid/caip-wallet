import { EventEmitter } from 'events';
import Keyring from 'mnemonic-keyring';
import { apiGetChainJsonRpc, apiGetChainNamespace } from 'caip-api';
import { IJsonRpcProvider, RequestArguments } from '@json-rpc-tools/types';

import {
  NamespaceConfig,
  NamespaceMap,
  ProvidersMap,
  WalletConfig,
  WalletOptions,
  getNamespaces,
  getSlip44Path,
  getBlockchainProvider,
  parseAccounts,
} from './helpers';

export async function getNamespaceMap(chains: string[]) {
  const namespaces: NamespaceMap = {};
  await Promise.all(
    getNamespaces(chains).map(async namespace => {
      const chains = await apiGetChainNamespace(namespace);
      const jsonrpc = await apiGetChainJsonRpc(namespace);
      const config: NamespaceConfig = { chains, jsonrpc };
      namespaces[namespace] = config;
    })
  );
  return namespaces;
}

export async function getWalletConfig(
  opts: WalletOptions
): Promise<WalletConfig> {
  const { chains } = opts;
  const keyring = await Keyring.init({
    mnemonic: opts.mnemonic,
    storage: opts.storage,
  });
  const namespaces = await getNamespaceMap(chains);
  const providers: ProvidersMap = {};
  await Promise.all(
    chains.map(async (chainId: string) => {
      const [namespace, reference] = chainId.split(':');
      if (Object.keys(namespaces).includes(namespace)) {
        const chainList = namespaces[namespace].chains;
        if (Object.keys(chainList).includes(reference)) {
          const chainData = chainList[reference];
          const rpcUrl = chainData.rpc[0];
          const keyPair = keyring.getKeyPair(getSlip44Path(chainData.slip44));
          const provider = await getBlockchainProvider(
            chainId,
            rpcUrl,
            keyPair
          );
          providers[chainId] = provider;
        }
      }
    })
  );
  return { mnemonic: keyring.mnemonic, providers, namespaces };
}

export class Wallet {
  public events = new EventEmitter();

  public providers: ProvidersMap = {};

  public namespaces: NamespaceMap = {};

  public mnemonic: string;

  static async init(opts: WalletOptions): Promise<Wallet> {
    const config = await getWalletConfig(opts);
    return new Wallet(config);
  }

  constructor(config: WalletConfig) {
    this.providers = config.providers;
    this.namespaces = config.namespaces;
    this.mnemonic = config.mnemonic;
  }

  public async getChains(namespace?: string) {
    let chains = Object.keys(this.providers);
    if (typeof namespace !== 'undefined') {
      chains = chains.filter(chainId => chainId.split(':')[0] === namespace);
    }
    return chains;
  }

  public async getAccounts(chainId?: string) {
    if (typeof chainId === 'undefined') {
      return (
        await Promise.all(
          Object.keys(this.providers).map(chainId =>
            this.getProviderAccounts(chainId)
          )
        )
      ).flat();
    }
    return this.getProviderAccounts(chainId);
  }

  public async request(request: RequestArguments, context?: any): Promise<any> {
    const provider = this.getProvider(context);
    return provider.request(request, context);
  }

  // ---------- Private ----------------------------------------------- //

  private getProvider(context?: any): IJsonRpcProvider {
    if (typeof context === 'undefined') {
      throw new Error('Missing request context');
    }
    const { chainId } = context;
    if (typeof chainId === 'undefined') {
      throw new Error('Missing request chainId');
    }
    const provider = this.providers[chainId];
    if (typeof provider === 'undefined') {
      throw new Error(`Missing provider for chainId: ${chainId}`);
    }
    return provider;
  }

  private async getProviderAccounts(chainId: string): Promise<any> {
    const provider = this.getProvider({ chainId });
    const method = this.getMethods('accounts', chainId)[0];
    if (typeof method === 'undefined') {
      throw new Error(`Cannot get accounts for chainId: ${chainId}`);
    }
    const accounts = (await provider.request({ method })) || [];
    return accounts.map(account => parseAccounts(account, chainId));
  }

  private getMethods(scope: string, chainId: string): string[] {
    const [namespace] = chainId.split(':');
    let methods: string[] = [];
    if (Object.keys(this.namespaces).includes(namespace)) {
      methods = this.namespaces[namespace].jsonrpc.methods[scope];
    }
    return methods;
  }
}

export default Wallet;
