import Keyring from 'mnemonic-keyring';
import Store from '@pedrouid/iso-store';
import { getChainConfig, getChainJsonRpc } from 'caip-api';
import {
  BlockchainAuthenticator,
  BlockchainProvider,
} from '@json-rpc-tools/blockchain';
import { JsonRpcProvider } from '@json-rpc-tools/provider';
import { generateChainSigner } from './signer';

export function generateChainProvider(
  chainId: string,
  signer: JsonRpcProvider,
  http: JsonRpcProvider
): BlockchainProvider {
  const { routes, state, schemas } = getChainJsonRpc(chainId);
  const provider = new BlockchainProvider({
    providers: { http, signer },
    routes,
    state,
    schemas,
  });
  return provider;
}

export function generateChainAuthenticator(
  chainId: string,
  keyring: Keyring,
  store?: Store
): BlockchainAuthenticator {
  const config = getChainConfig(chainId);
  const keyPair = keyring.getKeyPair(config.derivationPath);
  const http = new JsonRpcProvider(`https://${config.rpcUrl}`);
  const signer = generateChainSigner(chainId, keyPair, http);
  const provider = generateChainProvider(chainId, signer, http);
  const auth = new BlockchainAuthenticator(provider, store);
  return auth;
}
