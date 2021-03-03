import { ChainJsonRpcRoutes } from '../helpers';

const CosmosAccountsMethod = 'cosmos_accounts';

const CosmosSigningMethods: string[] = ['cosmos_sign'];

export const CosmosJsonRpc: ChainJsonRpcRoutes = {
  routes: {
    http: ['cosmos_*'],
    signer: [CosmosAccountsMethod, ...CosmosSigningMethods],
  },
  wallet: {
    accounts: CosmosAccountsMethod,
    auth: CosmosSigningMethods,
  },
};
