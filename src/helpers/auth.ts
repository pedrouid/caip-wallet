import { IKeyValueStorage } from 'keyvaluestorage';
import { KeyPair } from 'mnemonic-keyring';
import {
  BlockchainAuthenticator,
  BlockchainProvider,
} from '@json-rpc-tools/blockchain';

import { getChainSignerConnection } from './signer';
import { ChainJsonRpc } from './types';

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
