import { ChainID } from 'caip';
import { getChainConfig, getChainJsonRpc } from 'caip-api';
import {
  BlockchainAuthenticator,
  BlockchainProvider,
  SignerConnection,
} from '@json-rpc-tools/blockchain';
import { JsonRpcProvider } from '@json-rpc-tools/provider';

import { AuthenticatorMap, GenerateAuthMapOptions } from './types';

import * as blockchain from '../';
import { ISigner } from '../shared';

export function getChainSigner(chainId: string): ISigner {
  const { namespace } = ChainID.parse(chainId);
  const signer = blockchain.signer[namespace];

  if (!signer) {
    throw new Error(`No matching signer for chainId: ${chainId}`);
  }
  return signer;
}

export function getChainMiddleware(chainId: string): any {
  const { namespace } = ChainID.parse(chainId);
  const middleware = blockchain.middleware[namespace];

  if (!middleware) {
    throw new Error(`No matching middleware for chainId: ${chainId}`);
  }
  return middleware;
}

export function generateAuthMap(
  opts: GenerateAuthMapOptions
): AuthenticatorMap {
  const map: AuthenticatorMap = {};
  opts.chainIds.forEach((chainId: string) => {
    const { rpcUrl, derivationPath } = getChainConfig(chainId);
    const keyPair = opts.keyring.getKeyPair(derivationPath);
    const Signer = getChainSigner(chainId) as any;
    const Middleware = getChainMiddleware(chainId) as any;
    const http = new JsonRpcProvider(rpcUrl);
    const connection = new SignerConnection(
      new Signer(keyPair),
      new Middleware(http)
    );
    const { schemas } = getChainJsonRpc(chainId);
    const provider = new BlockchainProvider({
      providers: {
        http,
        signer: new JsonRpcProvider(connection),
      },
      routes: {
        http: ['*'],
        signer: Object.keys(schemas),
      },
      state: {
        chainId: '',
        accounts: '',
      },
      schemas,
    });
    const auth = new BlockchainAuthenticator(provider, opts.store);
    map[chainId] = auth;
  });
  return map;
}
