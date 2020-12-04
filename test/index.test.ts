import Wallet from '../src';

const TEST_MNE;

describe('caip-wallet', () => {
  let wallet: Wallet;
  beforeAll(async () => {
    wallet = await Wallet.init({ chainIds: ['eip155:1'] });
  });
  it('init', async () => {
    expect(wallet).toBeTruthy();
  });
});
