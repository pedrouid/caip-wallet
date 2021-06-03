import { IJsonRpcConnection, IJsonRpcProvider } from '@json-rpc-tools/types';
import { JsonRpcProvider } from '@json-rpc-tools/provider';
import { KeyPair } from 'mnemonic-keyring';

import { EIP155SignerConnection, CosmosSignerConnection } from './signers';

export function getNamespaces(chains: string[]): string[] {
  const namespaces: string[] = [];
  chains.forEach(chain => {
    const [namespace] = chain.split(':');
    if (namespaces.includes(namespace)) return;
    namespaces.push(namespace);
  });
  return namespaces;
}

export function getSlip44Path(slip44: number, index = 0): string {
  return `m/44'/${slip44}'/0'/0/${index}`;
}

export async function getBlockchainProvider(
  namespace: string,
  rpcUrl: string,
  keyPair: KeyPair
): Promise<IJsonRpcProvider> {
  let signer: IJsonRpcConnection | undefined;
  switch (namespace) {
    case 'eip155':
      signer = new EIP155SignerConnection(rpcUrl, keyPair);
      break;
    case 'cosmos':
      signer = new CosmosSignerConnection(rpcUrl, keyPair);
      break;
    default:
      break;
  }
  if (typeof signer === 'undefined') {
    throw new Error(
      `Signer connection requested not supported for namespace: ${namespace}`
    );
  }
  const provider = new JsonRpcProvider(signer);
  await provider.connect();
  return provider;
}
