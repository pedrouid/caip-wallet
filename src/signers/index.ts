import { CosmosSignerConnection } from './cosmos';
import { EIP155SignerConnection } from './eip155';
import { PolkadotSignerConnection } from './polkadot';

export const signers = {
  cosmos: CosmosSignerConnection,
  eip155: EIP155SignerConnection,
  polkadot: PolkadotSignerConnection,
};
