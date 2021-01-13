# caip-wallet [![npm version](https://badge.fury.io/js/caip-wallet.svg)](https://badge.fury.io/js/caip-wallet)

CAIP-compatible Multi-Blockchain Wallet

## Quick Start

```typescript
import CaipWallet from "caip-wallet";

// Initiate Wallet with target chains
const wallet = await CaipWallet.init({
  chains: ["eip155:1"],
  mnemonic:
    "basic guard spider horse civil trumpet into chalk basket month cabbage walk",
});

// Subscribe to pending user approval event
wallet.on("pending_approval", ({ chainId, request }) => {
  // Display Request with ChainID for user approval
  if (userApproved) {
    wallet.approve(request, chainId);
  } else {
    wallet.reject(request, chainId);
  }
});

// Resolve incoming JSON-RPC requests
const request = {
  id: 1,
  jsonrpc: "2.0",
  method: "personal_sign",
  params: [
    toHex("Test Message")
    "0xa89Df33a6f26c29ea23A9Ff582E865C03132b140"
  ]
}
const response = await wallet.resolve(request, chainId)
// (resolved automatically unless required user approval for authentication)
```

## API

```typescript
export abstract class ICaipWallet extends IEvents {
  public abstract chains: ChainAuthenticatorsMap;
  public abstract jsonrpc: ChainJsonRpcMap;
  public abstract mnemonic: string;

  constructor(config: CaipWalletConfig) {
    super();
  }

  public abstract getChains(): Promise<string[]>;

  public abstract getAccounts(chainId: string): Promise<string[]>;

  public abstract approve(
    request: JsonRpcRequest,
    chainId: string
  ): Promise<JsonRpcResponse>;

  public abstract reject(
    request: JsonRpcRequest,
    chainId: string
  ): Promise<JsonRpcResponse>;

  public abstract resolve(
    request: JsonRpcRequest,
    chainId: string
  ): Promise<JsonRpcResponse>;
}
```
