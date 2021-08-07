import { utils } from 'ethers';

export const TEST_EIP155_KEYPAIR = {
  publicKey:
    '03adfe81f5d70efadcea0a84dceb4d7d2e9128ad50ef31e04cfc5e79f027091e60',
  privateKey:
    '43a533254c59d903a427948dc7c0976cea840bf16a6cfc76fcc5b6dd96d11e05',
};

export const TEST_EIP155_CHAIN_NAMESPACE = 'eip155';

export const TEST_EIP155_CHAIN_REFERENCE = 5;

export const TEST_EIP155_CHAIN_ID = `${TEST_EIP155_CHAIN_NAMESPACE}:${TEST_EIP155_CHAIN_REFERENCE}`;

export const TEST_EIP155_ADDRESS = '0xEc90a68010fd3CF4A90EB01F4977d442d62F4C76';

export const TEST_EIP155_ACCOUNT = `${TEST_EIP155_CHAIN_ID}:${TEST_EIP155_ADDRESS}`;

export const TEST_COSMOS_KEYPAIR = {
  publicKey:
    '0204848ceb8eafdf754251c2391466744e5a85529ec81ae6b60a187a90a9406396',
  privateKey:
    '366cd8d38f760f970bdc70b18d19f40756b92beeebc84074ceea8e092d406666',
};

export const TEST_COSMOS_CHAIN_NAMESPACE = 'cosmos';

export const TEST_COSMOS_CHAIN_REFERENCE = 'cosmoshub-4';

export const TEST_COSMOS_CHAIN_ID = `${TEST_COSMOS_CHAIN_NAMESPACE}:${TEST_COSMOS_CHAIN_REFERENCE}`;

export const TEST_COSMOS_ADDRESS =
  'cosmos1sguafvgmel6f880ryvq8efh9522p8zvmrzlcrq';

export const TEST_COSMOS_ACCOUNT = `${TEST_COSMOS_CHAIN_ID}:${TEST_COSMOS_ADDRESS}`;

export const TEST_CHAINS = [TEST_EIP155_CHAIN_ID, TEST_COSMOS_CHAIN_ID];

export const TEST_ACCOUNTS = [TEST_EIP155_ACCOUNT, TEST_COSMOS_ACCOUNT];

export const TEST_MNEMONIC =
  'raven what cart burst flag helmet chalk job board grocery tomato measure';

export const TEST_EIP155_MESSAGE = utils.hexlify(
  utils.toUtf8Bytes(`Approving a test message with ${TEST_EIP155_ADDRESS}`)
);

export const TEST_EIP155_TRANSACTION = {
  from: TEST_EIP155_ADDRESS,
  to: TEST_EIP155_ADDRESS,
  data: '0x',
  gas: '0x5208',
};

export const TEST_EIP155_SIGNATURE =
  '0x10635ed1d7055f1109416d3408ee98379c20b57bdac58c4626b67b26870f738405a9ef1007b9656552025dfb11b8ed152938f265da720857b2fda8dc86d2bdf41b';

export const TEST_COSMOS_INPUTS = {
  direct: {
    fee: [{ amount: '2000', denom: 'ucosm' }],
    pubkey: 'AgSEjOuOr991QlHCORRmdE5ahVKeyBrmtgoYepCpQGOW',
    gasLimit: 200000,
    accountNumber: 1,
    sequence: 1,
    bodyBytes:
      '0a90010a1c2f636f736d6f732e62616e6b2e763162657461312e4d736753656e6412700a2d636f736d6f7331706b707472653766646b6c366766727a6c65736a6a766878686c63337234676d6d6b38727336122d636f736d6f7331717970717870713971637273737a673270767871367273307a716733797963356c7a763778751a100a0575636f736d120731323334353637',
    authInfoBytes:
      '0a500a460a1f2f636f736d6f732e63727970746f2e736563703235366b312e5075624b657912230a21034f04181eeba35391b858633a765c4a0c189697b40d216354d50890d350c7029012040a020801180112130a0d0a0575636f736d12043230303010c09a0c',
  },
  amino: {
    msgs: [],
    fee: { amount: [], gas: '23' },
    chain_id: 'foochain',
    memo: 'hello, world',
    account_number: '7',
    sequence: '54',
  },
};

export const TEST_COSMOS_DIRECT_SIGNATURE =
  'LVtl91xbrxCTR643RZMw08uHV3tR5aL46iMiVnAFdWVoaQJN/+jpbs6GPyOOBgZW6nWldiB/WxGmMMoEHoCudQ==';

export const TEST_COSMOS_AMINO_SIGNATURE =
  'AnTrXtS2lr9CBwhTpRa8ZlKcVR9PeIXGaTpvodyJU05QvRKVjIkQfOZl5JhdkfxCY+a6rhwCOYVcbKQTJlMw4w==';
