import {
  IEvents,
  JsonRpcRequest,
  JsonRpcResponse,
} from '@json-rpc-tools/utils';

export abstract class ISignerMiddleware extends IEvents {
  public abstract before(request: JsonRpcRequest): Promise<string>;
  public abstract after(signature: string): Promise<JsonRpcResponse>;
}
