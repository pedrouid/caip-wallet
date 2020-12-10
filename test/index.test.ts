import Wallet from '../src';

const TEST_CHAINS = ['eip155:1'];

const TEST_MNEMONIC =
  'basic guard spider horse civil trumpet into chalk basket month cabbage walk';

describe('caip-wallet', () => {
  let wallet: Wallet;
  beforeAll(async () => {
    wallet = await Wallet.init({
      mnemonic: TEST_MNEMONIC,
      chainIds: TEST_CHAINS,
    });
  });
  it('init', async () => {
    console.log('mnemonic', wallet.mnemonic);
    expect(wallet).toBeTruthy();
  });
  it('getChainIds', async () => {
    const chains = await wallet.getChainIds();
    console.log('chains', chains);
    expect(chains).toBeTruthy();
    expect(chains).toEqual(TEST_CHAINS);
  });
  // TODO: needs to be fixed on @json-rpc-tools/utils isJsonRpcResponse error
  // ......Unhandled error. (TypeError: Cannot use 'in' operator to search for 'method' in
  //
  // it('getAccountIds', async () => {
  //   const accounts = await wallet.getAccountIds(TEST_CHAINS[0]);
  //   console.log('accounts', accounts);
  //   expect(accounts).toBeTruthy();
  // });
  it('personal_sign', async () => {});
});
