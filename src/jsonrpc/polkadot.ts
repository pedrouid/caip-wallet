import { ChainJsonRpcRoutes } from '../helpers';

const PolkadotAccountsMethod = 'polkadot_accounts';

const PolkadotSigningMethods: string[] = ['polkadot_sign'];

export const PolkadotJsonRpc: ChainJsonRpcRoutes = {
  routes: {
    http: ['polkadot_*'],
    signer: [PolkadotAccountsMethod, ...PolkadotSigningMethods],
  },
  wallet: {
    accounts: PolkadotAccountsMethod,
    auth: PolkadotSigningMethods,
  },
};
