import { ChainJsonRpcRoutes } from '../helpers';

const EIP155AccountsMethod = 'eth_accounts';

const EIP155SigningMethods: string[] = [
  'eth_sign',
  'eth_signTypedData',
  'eth_signTransaction',
  'eth_sendTransaction',
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
