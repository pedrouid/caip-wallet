import { ChainJsonRpcRoutes } from '../helpers';

const EIP155AccountsMethod = 'eth_accounts';

const EIP155SigningMethods: string[] = [
  'eth_sendTransaction',
  'eth_signTransaction',
  'eth_sign',
  'eth_signTypedData',
  'personal_sign',
];

export const EIP155JsonRpc: ChainJsonRpcRoutes = {
  routes: {
    http: ['eth_*'],
    signer: [EIP155AccountsMethod, ...EIP155SigningMethods],
  },
  wallet: {
    accounts: EIP155AccountsMethod,
    auth: EIP155SigningMethods,
  },
};
