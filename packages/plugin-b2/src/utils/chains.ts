import { defineChain } from 'viem'

export const b2Network = defineChain({
  id: 223,
  name: 'B2Network',
  network: 'B2Network',
  nativeCurrency: {
    decimals: 18,
    name: 'Bitcoin',
    symbol: 'BTC',
  },
  blockExplorers: {
    default: {
      name: 'B2Network',
      url: 'https://explorer.bsquared.network/'
    }
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.bsquared.network/'],
    },
    public: {
      http: ['https://rpc.bsquared.network/'],
    },
  },
})