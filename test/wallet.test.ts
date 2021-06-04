import { fromHex } from '@cosmjs/encoding';
import { makeSignDoc, makeAuthInfoBytes } from '@cosmjs/proto-signing';

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
  TEST_COSMOS_CHAIN_REFERENCE,
  TEST_COSMOS_INPUTS,
  TEST_COSMOS_DIRECT_SIGNATURE,
  TEST_COSMOS_AMINO_SIGNATURE,
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
    it('cosmos_signDirect', async () => {
      const signerAddress = TEST_COSMOS_ADDRESS;
      const {
        fee,
        pubkey,
        gasLimit,
        accountNumber,
        sequence,
        bodyBytes,
      } = TEST_COSMOS_INPUTS.direct;
      const authInfoBytes = makeAuthInfoBytes(
        [pubkey as any],
        fee,
        gasLimit,
        sequence
      );
      const signDoc = makeSignDoc(
        fromHex(bodyBytes),
        authInfoBytes,
        TEST_COSMOS_CHAIN_REFERENCE,
        accountNumber
      );
      const request = {
        method: 'cosmos_signDirect',
        params: { signerAddress, signDoc },
      };
      const context = { chainId: TEST_COSMOS_CHAIN_ID };
      const result = await wallet.request(request, context);
      expect(result).toBeTruthy();
      expect(result.signature.signature).toEqual(TEST_COSMOS_DIRECT_SIGNATURE);
    });
    it('cosmos_signAmino', async () => {
      const signerAddress = TEST_COSMOS_ADDRESS;
      const signDoc = TEST_COSMOS_INPUTS.amino;
      const request = {
        method: 'cosmos_signAmino',
        params: { signerAddress, signDoc },
      };
      const context = { chainId: TEST_COSMOS_CHAIN_ID };
      const result = await wallet.request(request, context);
      expect(result).toBeTruthy();
      expect(result.signature.signature).toEqual(TEST_COSMOS_AMINO_SIGNATURE);
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
