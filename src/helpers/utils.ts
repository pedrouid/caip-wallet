import Store from '@pedrouid/iso-store';
import Keyring from 'mnemonic-keyring';
import { ChainID } from 'caip';
import { getChainConfig } from 'caip-api';
import { JsonRpcAuthConfig } from '@json-rpc-tools/utils';

import * as CAIPWallet from '../';
import {
  AuthenticatorMap,
  ChainAuthenticator,
  ChainSigner,
  GenerateAuthMapOptions,
} from './types';
import { getChainJsonRpc } from 'caip-api';

export function getChainProperty<T>(chainId: string, property: string): T {
  const { namespace } = ChainID.parse(chainId);
  const config = CAIPWallet[property][namespace];

  if (!config) {
    throw new Error(`No matching ${property} for chainId: ${chainId}`);
  }
  return config;
}

export function getChainSigner(chainId: string): ChainSigner {
  return getChainProperty<ChainSigner>(chainId, 'signer');
}

export function getChainAuthenticator(chainId: string): ChainAuthenticator {
  return getChainProperty<ChainAuthenticator>(chainId, 'authenticator');
}

export function generateAuthenticatorConfig(
  chainId: string
): JsonRpcAuthConfig {
  const jsonrpc = getChainJsonRpc(chainId);
  return {
    chainId,
    accounts: {
      method: '',
    },
    ...jsonrpc,
  };
}

export function generateAuthMap(
  opts: GenerateAuthMapOptions
): AuthenticatorMap {
  const map: AuthenticatorMap = {};
  opts.chainIds.forEach((chainId: string) => {
    const config = getChainConfig(chainId);

    const Auth = getChainAuthenticator(chainId);
    const Signer = getChainSigner(chainId);
    const keyPair = opts.keyring.getKeyPair(config.derivationPath);
    // TODO: Fix types for Signer
    // @ts-ignore
    const signer = new Signer(config.rpcUrl, keyPair);
    // TODO: Fix types for Auth
    // @ts-ignore
    const auth = new Auth(
      generateAuthenticatorConfig(chainId),
      signer,
      opts.store
    );
    map[chainId] = auth;
  });
  return map;
}
