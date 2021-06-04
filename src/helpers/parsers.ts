export function parseAccounts(account: any, chainId: string) {
  const [namespace] = chainId.split(':');
  let address = account;
  if (namespace === 'cosmos') {
    address = account.address;
  }
  return `${address}@${chainId}`;
}
