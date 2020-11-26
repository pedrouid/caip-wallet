import { CosmosSigner } from './cosmos';
import { EIP155Signer } from './eip155';
import { PolkadotSigner } from './polkadot';

export const signer = {
  cosmos: CosmosSigner,
  eip155: EIP155Signer,
  polkadot: PolkadotSigner,
};
