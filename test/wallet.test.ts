import {
  TEST_EIP155_CHAIN_ID,
  TEST_EIP155_ADDRESS,
  TEST_EIP155_ACCOUNT,
  TEST_COSMOS_CHAIN_ID,
  TEST_COSMOS_ADDRESS,
  TEST_CHAINS,
  TEST_ACCOUNTS,
  TEST_MNEMONIC,
  TEST_EIP155_MESSAGE,
  TEST_EIP155_TRANSACTION,
  TEST_EIP155_SIGNATURE,
  TEST_COSMOS_ACCOUNT,
} from './shared';

import Wallet from '../src';

describe('Wallet', () => {
  let wallet: Wallet;
  beforeAll(async () => {
    wallet = await Wallet.init({
      mnemonic: TEST_MNEMONIC,
      chains: TEST_CHAINS,
    });
  });
  it('init', async () => {
    expect(wallet).toBeTruthy();
  });
  it('getChains', async () => {
    const chains = await wallet.getChains();
    expect(chains).toBeTruthy();
    expect(chains).toEqual(TEST_CHAINS);
  });
  it('getAccounts (all)', async () => {
    const accounts = await wallet.getAccounts();
    expect(accounts).toBeTruthy();
    expect(accounts).toEqual(TEST_ACCOUNTS);
  });
  describe('COSMOS', () => {
    it('getAccounts (cosmos)', async () => {
      const accounts = await wallet.getAccounts(TEST_COSMOS_CHAIN_ID);
      expect(accounts).toBeTruthy();
      expect(accounts).toEqual([TEST_COSMOS_ACCOUNT]);
    });
    it('cosmos_getAccounts', async () => {
      const request = { method: 'cosmos_getAccounts', params: {} };
      const context = { chainId: TEST_COSMOS_CHAIN_ID };
      const result = await wallet.request(request, context);
      expect(result).toBeTruthy();
      expect(result[0].address).toEqual(TEST_COSMOS_ADDRESS);
      expect(result[0].algo).toEqual('secp256k1');
    });
  });
  describe('EIP155', () => {
    it('getAccounts (eip155)', async () => {
      const accounts = await wallet.getAccounts(TEST_EIP155_CHAIN_ID);
      expect(accounts).toBeTruthy();
      expect(accounts).toEqual([TEST_EIP155_ACCOUNT]);
    });
    it('eth_sign', async () => {
      const request = {
        method: 'eth_sign',
        params: [TEST_EIP155_ADDRESS, TEST_EIP155_MESSAGE],
      };
      const context = { chainId: TEST_EIP155_CHAIN_ID };
      const result = await wallet.request(request, context);
      expect(result).toBeTruthy();
      expect(result).toEqual(TEST_EIP155_SIGNATURE);
    });
    it('personal_sign', async () => {
      const request = {
        method: 'personal_sign',
        params: [TEST_EIP155_MESSAGE, TEST_EIP155_ADDRESS],
      };
      const context = { chainId: TEST_EIP155_CHAIN_ID };
      const result = await wallet.request(request, context);
      expect(result).toBeTruthy();
      expect(result).toEqual(TEST_EIP155_SIGNATURE);
    });
    // FIXME: insufficient funds for intrinsic transaction cost
    it.skip('eth_sendTransaction', async () => {
      const request = {
        method: 'eth_sendTransaction',
        params: [TEST_EIP155_TRANSACTION],
      };
      const context = { chainId: TEST_EIP155_CHAIN_ID };
      const result = await wallet.request(request, context);
      expect(result).toBeTruthy();
      expect(typeof result).toEqual('string');
      expect(result.length).toEqual(66);
    });
    it('eth_signTransaction', async () => {
      const request = {
        method: 'eth_signTransaction',
        params: [TEST_EIP155_TRANSACTION],
      };
      const context = { chainId: TEST_EIP155_CHAIN_ID };
      const result = await wallet.request(request, context);
      expect(result).toBeTruthy();
      expect(typeof result).toEqual('string');
      expect(result.length).toEqual(206);
    });
  });
});
