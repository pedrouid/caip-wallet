import { getChainConfig, getChainJsonRpcSchemas } from 'caip-api';
import { IKeyValueStorage } from 'keyvaluestorage';
import Keyring, { KeyPair } from 'mnemonic-keyring';
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
} from './types';
import { getChainJsonRpcRoutes } from './jsonrpc';

export async function generateChainAuthenticator(
  chainId: string,
  rpcUrl: string,
  keyPair: KeyPair,
  jsonrpc: ChainJsonRpc,
  storage?: IKeyValueStorage
): Promise<BlockchainAuthenticator> {
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
  const auth = new BlockchainAuthenticator({
    provider,
    requiredApproval: jsonrpc.wallet.auth,
    storage,
  });
  await auth.init();
  return auth;
}

export async function generateCaipWalletConfig(
  opts: CaipWalletOptions
): Promise<CaipWalletConfig> {
  const { chains, storage } = opts;
  const keyring = await Keyring.init({ ...opts });
  const auth: ChainAuthenticatorsMap = {};
  const jsonrpc: ChainJsonRpcMap = {};
  await Promise.all(
    chains.map(async (chainId: string) => {
      const config = getChainConfig(chainId);
      const keyPair = keyring.getKeyPair(config.derivationPath);
      const rpcUrl = `https://${config.rpcUrl}`;
      jsonrpc[chainId] = {
        ...getChainJsonRpcRoutes(chainId),
        schemas: getChainJsonRpcSchemas(chainId),
      };
      auth[chainId] = await generateChainAuthenticator(
        chainId,
        rpcUrl,
        keyPair,
        jsonrpc[chainId],
        storage
      );
    })
  );
  return { auth, jsonrpc, mnemonic: keyring.mnemonic };
}
