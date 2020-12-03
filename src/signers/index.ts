import { CosmosSigner, CosmosMiddleware } from './cosmos';
import { EIP155Signer, EIP155Middleware } from './eip155';
import { PolkadotSigner, PolkadotMiddleware } from './polkadot';

export const signer = {
  cosmos: CosmosSigner,
  eip155: EIP155Signer,
  polkadot: PolkadotSigner,
};

export const middleware = {
  cosmos: CosmosMiddleware,
  eip155: EIP155Middleware,
  polkadot: PolkadotMiddleware,
};
