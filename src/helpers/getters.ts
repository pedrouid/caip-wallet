import { utils } from 'ethers';
import * as encUtils from 'enc-utils';
import { toBase64 } from '@cosmjs/encoding';
import { pubkeyToAddress, pubkeyType } from '@cosmjs/amino';
import { IJsonRpcConnection, IJsonRpcProvider } from '@json-rpc-tools/types';
import { JsonRpcProvider } from '@json-rpc-tools/provider';
import Keyring, { KeyPair } from 'mnemonic-keyring';

import { COSMOS_ADDRESS_PREFIX } from '../constants';
import { EIP155SignerConnection, CosmosSignerConnection } from '../signers';
import { apiGetChainData } from 'caip-api';

export function getNamespaces(chains: string[]): string[] {
  const namespaces: string[] = [];
  chains.forEach(chain => {
    const [namespace] = chain.split(':');
    if (namespaces.includes(namespace)) return;
    namespaces.push(namespace);
  });
  return namespaces;
}

export async function getBlockchainProvider(
  chainId: string,
  rpcUrl: string,
  keyPair: KeyPair
): Promise<IJsonRpcProvider> {
  const [namespace] = chainId.split(':');
  let signer: IJsonRpcConnection | undefined;
  switch (namespace) {
    case 'eip155':
      signer = new EIP155SignerConnection(rpcUrl, keyPair, chainId);
      break;
    case 'cosmos':
      signer = new CosmosSignerConnection(rpcUrl, keyPair, chainId);
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

export function getSlip44Path(slip44: number, index = 0): string {
  return `m/44'/${slip44}'/0'/0/${index}`;
}

export async function getBlockchainKeyPair(
  mnemonic: string,
  chainId: string,
  index = 0
): Promise<KeyPair> {
  const keyring = await Keyring.init({ mnemonic });
  const chainData = await apiGetChainData(chainId);
  return keyring.getKeyPair(getSlip44Path(chainData.slip44, index));
}

export function getCosmosAddressPrefix(chainId?: string) {
  let prefix = 'cosmos';
  if (typeof chainId !== 'undefined') {
    const [namespace, reference] = chainId.split(':');
    if (namespace !== 'cosmos') {
      throw new Error(
        `Cannot get address with incompatible namespace for chainId: ${chainId}`
      );
    }
    const [name] = reference.split('-');
    if (typeof name !== 'undefined') {
      const match = COSMOS_ADDRESS_PREFIX[name];
      if (typeof match !== 'undefined') {
        prefix = match;
      }
    }
  }
  return prefix;
}

export function getCosmosAddress(publicKey: string, chainId?: string) {
  const prefix = getCosmosAddressPrefix(chainId);
  // assume for now only secp256k1
  const pubKey = {
    type: pubkeyType.secp256k1,
    value: toBase64(encUtils.hexToArray(publicKey)),
  };
  return pubkeyToAddress(pubKey, prefix);
}

export function getEip155Address(publicKey: string, chainId?: string) {
  if (typeof chainId !== 'undefined') {
    const [namespace] = chainId.split(':');
    if (namespace !== 'eip155') {
      throw new Error(
        `Cannot get address with incompatible namespace for chainId: ${chainId}`
      );
    }
  }
  return utils.computeAddress(encUtils.hexToArray(publicKey));
}
