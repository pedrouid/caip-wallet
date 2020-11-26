import { ChainID } from 'caip';

import * as CAIPWallet from '../';
import { ChainAuthenticator, ChainSigner } from './types';

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
