import { utils } from 'ethers';

export const TEST_EIP155_CHAIN_ID = 'eip155:5';

export const TEST_EIP155_ADDRESS = '0xEc90a68010fd3CF4A90EB01F4977d442d62F4C76';

export const TEST_EIP155_ACCOUNT = `${TEST_EIP155_ADDRESS}@${TEST_EIP155_CHAIN_ID}`;

export const TEST_COSMOS_CHAIN_ID = 'cosmos:cosmoshub-4';

export const TEST_COSMOS_ADDRESS =
  'cosmos1sguafvgmel6f880ryvq8efh9522p8zvmrzlcrq';

export const TEST_COSMOS_ACCOUNT = `${TEST_COSMOS_ADDRESS}@${TEST_COSMOS_CHAIN_ID}`;

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
