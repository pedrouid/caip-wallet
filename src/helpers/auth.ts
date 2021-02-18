import { getChainConfig, getChainJsonRpcSchemas } from 'caip-api';
import Keyring from 'mnemonic-keyring';
import {
  BlockchainAuthenticator,
  BlockchainProvider,
} from '@json-rpc-tools/blockchain';

import { getChainSignerConnection } from './signer';
import {
  CaipWalletConfig,
  CaipWalletOptions,
  ChainAuthenticatorsMap,
  ChainJsonRpc,
  ChainJsonRpcMap,
  ChainSignerOptions,
} from './types';
import { getChainJsonRpcRoutes } from './jsonrpc';

export function getChainJsonRpc(chainId: string): ChainJsonRpc {
  return {
    ...getChainJsonRpcRoutes(chainId),
    schemas: getChainJsonRpcSchemas(chainId),
  };
}

export function getSignerOptions(
  opts: ChainSignerOptions
): { keyPath: string; rpcUrl: string } {
  const config = getChainConfig(opts.chainId);
  const keyPath =
    opts?.customPath || `${config.derivationPath}/${opts?.index || 0}`;
  const rpcUrl = `https://${config.rpcUrl}`;
  return { keyPath, rpcUrl };
}

export async function getChainProvider(
  keyring: Keyring,
  opts: ChainSignerOptions
): Promise<BlockchainProvider> {
  const { chainId, index, customPath } = opts;
  const { keyPath, rpcUrl } = getSignerOptions({
    chainId,
    index,
    customPath,
  });
  const keyPair = keyring.getKeyPair(keyPath);
  const jsonrpc = opts.jsonrpc || getChainJsonRpc(chainId);
  const SignerConnection = getChainSignerConnection(chainId);
  const provider = new BlockchainProvider(rpcUrl, {
    chainId,
    routes: jsonrpc.routes.http,
    signer: {
      routes: jsonrpc.routes.signer,
      connection: new SignerConnection({ keyPair, rpcUrl }),
    },
    validator: {
      schemas: jsonrpc.schemas,
    },
  });
  await provider.connect();
  return provider;
}

export async function getCaipWalletConfig(
  opts: CaipWalletOptions
): Promise<CaipWalletConfig> {
  const { chains, storage } = opts;
  const keyring = await Keyring.init({ ...opts });
  const mnemonic = keyring.mnemonic;
  const auth: ChainAuthenticatorsMap = {};
  const jsonrpc: ChainJsonRpcMap = {};
  await Promise.all(
    chains.map(async (chainId: string) => {
      jsonrpc[chainId] = getChainJsonRpc(chainId);
      const provider = await getChainProvider(keyring, {
        chainId,
        jsonrpc: jsonrpc[chainId],
      });
      const requiredApproval = jsonrpc[chainId].wallet.auth;
      auth[chainId] = new BlockchainAuthenticator({
        provider,
        requiredApproval,
        storage,
      });
      await auth[chainId].init();
    })
  );
  return { auth, jsonrpc, mnemonic };
}
