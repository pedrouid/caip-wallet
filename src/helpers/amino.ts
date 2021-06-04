import * as encUtils from 'enc-utils';
import { KeyPair } from 'mnemonic-keyring';
import { Secp256k1, Sha256 } from '@cosmjs/crypto';
import {
  StdSignDoc,
  serializeSignDoc,
  encodeSecp256k1Signature,
  AminoSignResponse,
} from '@cosmjs/amino';

export async function signAmino(
  keyPair: KeyPair,
  signDoc: StdSignDoc
): Promise<AminoSignResponse> {
  const message = new Sha256(serializeSignDoc(signDoc)).digest();
  const signature = await Secp256k1.createSignature(
    message,
    encUtils.hexToArray(keyPair.privateKey)
  );
  const signatureBytes = new Uint8Array([
    ...signature.r(32),
    ...signature.s(32),
  ]);
  return {
    signed: signDoc,
    signature: encodeSecp256k1Signature(
      encUtils.hexToArray(keyPair.publicKey),
      signatureBytes
    ),
  };
}
