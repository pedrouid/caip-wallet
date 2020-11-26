import { CosmosAuthenticator } from './cosmos';
import { EIP155Authenticator } from './eip155';
import { PolkadotAuthenticator } from './polkadot';

export const authenticator = {
  cosmos: CosmosAuthenticator,
  eip155: EIP155Authenticator,
  polkadot: PolkadotAuthenticator,
};
