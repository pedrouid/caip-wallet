import { formatJsonRpcRequest, isJsonRpcError } from '@json-rpc-tools/utils';
import { utils } from 'ethers';
import Wallet from '../src';

const TEST_ETH_CHAIN_ID = 'eip155:1';

const TEST_ETH_ADDRESS = '0xa89Df33a6f26c29ea23A9Ff582E865C03132b140';

const TEST_CHAINS = [TEST_ETH_CHAIN_ID];

const TEST_ACCOUNTS = [`${TEST_ETH_ADDRESS}@${TEST_ETH_CHAIN_ID}`];

const TEST_MNEMONIC =
  'basic guard spider horse civil trumpet into chalk basket month cabbage walk';

const TEST_MESSAGE = utils.hexlify(
  utils.toUtf8Bytes(`Approving a test message with ${TEST_ETH_ADDRESS}`)
);

const TEST_SIGNATURE =
  '0x6ebcf4d9998a31a29cc8e7d9aa6ca85b5ea2c31427e529f607214cd03d96124e741f31080e6aa606abb3ea7d6aa498a7dba8659a57478016a9061ae9d448a9691c';

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
  it('getAccounts', async () => {
    const accounts = await wallet.getAccounts(TEST_ETH_CHAIN_ID);
    expect(accounts).toBeTruthy();
    expect(accounts).toEqual(TEST_ACCOUNTS);
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
});
