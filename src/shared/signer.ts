export interface KeyPair {
  privateKey: string;
  publicKey: string;
}

export abstract class ISigner {
  public abstract account: string;

  constructor(public keyPair: KeyPair) {}

  public abstract sign(message: string): Promise<string>;
}
