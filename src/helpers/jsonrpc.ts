import { ChainID } from 'caip';
import { jsonrpc } from '../jsonrpc';
import { ChainJsonRpcRoutes } from './types';

export function getChainJsonRpcRoutes(chainId: string): ChainJsonRpcRoutes {
  const { namespace } = ChainID.parse(chainId);
  const result = jsonrpc[namespace];

  if (!result) {
    throw new Error(`No matching jsonrpc for chainId: ${chainId}`);
  }
  return result;
}
