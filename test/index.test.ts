import { formatJsonRpcRequest, isJsonRpcError } from '@json-rpc-tools/utils';
import { utils } from 'ethers';
import Wallet from '../src';

const TEST_ETH_CHAIN_ID = 'eip155:5';

const TEST_ETH_ADDRESS = '0xEc90a68010fd3CF4A90EB01F4977d442d62F4C76';

const TEST_ETH_ACCOUNT = `${TEST_ETH_ADDRESS}@${TEST_ETH_CHAIN_ID}`;

const TEST_COSMOS_CHAIN_ID = 'cosmos:cosmoshub-4';

const TEST_COSMOS_ADDRESS = 'cosmos1t2uflqwqe0fsj0shcfkrvpukewcw40yjj6hdc0';

const TEST_COSMOS_ACCOUNT = `${TEST_COSMOS_ADDRESS}@${TEST_COSMOS_CHAIN_ID}`;

const TEST_CHAINS = [TEST_ETH_CHAIN_ID, TEST_COSMOS_CHAIN_ID];

const TEST_ACCOUNTS = [TEST_ETH_ACCOUNT, TEST_COSMOS_ACCOUNT];

const TEST_MNEMONIC =
  'raven what cart burst flag helmet chalk job board grocery tomato measure';

const TEST_MESSAGE = utils.hexlify(
  utils.toUtf8Bytes(`Approving a test message with ${TEST_ETH_ADDRESS}`)
);

const TEST_TRANSACTION = {
  from: TEST_ETH_ADDRESS,
  to: TEST_ETH_ADDRESS,
  data: '0x',
};

const TEST_SIGNATURE =
  '0x10635ed1d7055f1109416d3408ee98379c20b57bdac58c4626b67b26870f738405a9ef1007b9656552025dfb11b8ed152938f265da720857b2fda8dc86d2bdf41b';

describe('caip-wallet', () => {
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
  it('getAccounts (single)', async () => {
    const accounts = await wallet.getAccounts(TEST_ETH_CHAIN_ID);
    expect(accounts).toBeTruthy();
    expect(accounts).toEqual([TEST_ETH_ACCOUNT]);
  });
  it('getAccounts (multi)', async () => {
    const accounts = await wallet.getAccounts();
    expect(accounts).toBeTruthy();
    expect(accounts).toEqual(TEST_ACCOUNTS);
  });
  it('eth_sign', async () => {
    wallet.on('pending_approval', ({ chainId, request }) => {
      if (chainId === TEST_ETH_CHAIN_ID && request.method === 'eth_sign') {
        wallet.approve(request, chainId);
      }
    });
    const request = formatJsonRpcRequest('eth_sign', [
      TEST_ETH_ADDRESS,
      TEST_MESSAGE,
    ]);
    const response = await wallet.resolve(request, TEST_ETH_CHAIN_ID);
    if (isJsonRpcError(response)) throw new Error(response.error.message);
    expect(response).toBeTruthy();
    expect(response.result).toBeTruthy();
    expect(response.result).toEqual(TEST_SIGNATURE);
  });
  it('personal_sign', async () => {
    wallet.on('pending_approval', ({ chainId, request }) => {
      if (chainId === TEST_ETH_CHAIN_ID && request.method === 'personal_sign') {
        wallet.approve(request, chainId);
      }
    });
    const request = formatJsonRpcRequest('personal_sign', [
      TEST_MESSAGE,
      TEST_ETH_ADDRESS,
    ]);
    const response = await wallet.resolve(request, TEST_ETH_CHAIN_ID);
    if (isJsonRpcError(response)) throw new Error(response.error.message);
    expect(response).toBeTruthy();
    expect(response.result).toBeTruthy();
    expect(response.result).toEqual(TEST_SIGNATURE);
  });
  it('eth_sendTransaction', async () => {
    wallet.on('pending_approval', ({ chainId, request }) => {
      if (
        chainId === TEST_ETH_CHAIN_ID &&
        request.method === 'eth_sendTransaction'
      ) {
        wallet.approve(request, chainId);
      }
    });
    const request = formatJsonRpcRequest('eth_sendTransaction', [
      TEST_TRANSACTION,
    ]);
    const response = await wallet.resolve(request, TEST_ETH_CHAIN_ID);
    if (isJsonRpcError(response)) throw new Error(response.error.message);
    expect(response).toBeTruthy();
    expect(response.result).toBeTruthy();
    expect(typeof response.result).toEqual('string');
    expect(response.result.length).toEqual(66);
  });
  it('eth_signTransaction', async () => {
    wallet.on('pending_approval', ({ chainId, request }) => {
      if (
        chainId === TEST_ETH_CHAIN_ID &&
        request.method === 'eth_signTransaction'
      ) {
        wallet.approve(request, chainId);
      }
    });
    const request = formatJsonRpcRequest('eth_signTransaction', [
      TEST_TRANSACTION,
    ]);
    const response = await wallet.resolve(request, TEST_ETH_CHAIN_ID);
    if (isJsonRpcError(response)) throw new Error(response.error.message);
    expect(response).toBeTruthy();
    expect(response.result).toBeTruthy();
    expect(typeof response.result).toEqual('string');
    expect(response.result.length).toEqual(192);
  });
});
