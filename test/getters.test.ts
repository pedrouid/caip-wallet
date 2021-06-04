import {
  getBlockchainKeyPair,
  getCosmosAddress,
  getEip155Address,
  getNamespaces,
} from '../src';

import {
  TEST_MNEMONIC,
  TEST_EIP155_CHAIN_ID,
  TEST_EIP155_ADDRESS,
  TEST_COSMOS_CHAIN_ID,
  TEST_COSMOS_ADDRESS,
  TEST_CHAINS,
} from './shared';

describe('Address', () => {
  it('getNamespaces', async () => {
    const namespaces = getNamespaces(TEST_CHAINS);
    expect(namespaces).toEqual(['eip155', 'cosmos']);
  });
  it('getCosmosAddress', async () => {
    const chainId = TEST_COSMOS_CHAIN_ID;
    const keyPair = await getBlockchainKeyPair(TEST_MNEMONIC, chainId);
    const address = getCosmosAddress(keyPair.publicKey, chainId);
    expect(address).toEqual(TEST_COSMOS_ADDRESS);
  });
  it('getEip155Address', async () => {
    const chainId = TEST_EIP155_CHAIN_ID;
    const keyPair = await getBlockchainKeyPair(TEST_MNEMONIC, chainId);
    const address = getEip155Address(keyPair.publicKey, chainId);
    expect(address).toEqual(TEST_EIP155_ADDRESS);
  });
});
