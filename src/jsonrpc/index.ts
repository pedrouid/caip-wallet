import { CosmosJsonRpc } from './cosmos';
import { EIP155JsonRpc } from './eip155';
import { PolkadotJsonRpc } from './polkadot';

export const jsonrpc = {
  cosmos: CosmosJsonRpc,
  eip155: EIP155JsonRpc,
  polkadot: PolkadotJsonRpc,
};
