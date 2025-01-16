export default [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "indexed": true,
        "name": "owner",
        "internalType": "address",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "spender",
        "internalType": "address",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "value",
        "internalType": "uint256",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "anonymous": false,
    "type": "event"
  },
  {
    "inputs": [
      {
        "indexed": true,
        "name": "sender",
        "internalType": "address",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "amount0",
        "internalType": "uint256",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "amount1",
        "internalType": "uint256",
        "type": "uint256"
      },
      {
        "indexed": true,
        "name": "to",
        "internalType": "address",
        "type": "address"
      }
    ],
    "name": "Burn",
    "anonymous": false,
    "type": "event"
  },
  {
    "inputs": [
      {
        "indexed": true,
        "name": "sender",
        "internalType": "address",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "amount0",
        "internalType": "uint256",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "amount1",
        "internalType": "uint256",
        "type": "uint256"
      }
    ],
    "name": "Mint",
    "anonymous": false,
    "type": "event"
  },
  {
    "inputs": [
      {
        "indexed": true,
        "name": "sender",
        "internalType": "address",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "amount0In",
        "internalType": "uint256",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "amount1In",
        "internalType": "uint256",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "amount0Out",
        "internalType": "uint256",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "amount1Out",
        "internalType": "uint256",
        "type": "uint256"
      },
      {
        "indexed": true,
        "name": "to",
        "internalType": "address",
        "type": "address"
      }
    ],
    "name": "Swap",
    "anonymous": false,
    "type": "event"
  },
  {
    "inputs": [
      {
        "indexed": false,
        "name": "reserve0",
        "internalType": "uint112",
        "type": "uint112"
      },
      {
        "indexed": false,
        "name": "reserve1",
        "internalType": "uint112",
        "type": "uint112"
      }
    ],
    "name": "Sync",
    "anonymous": false,
    "type": "event"
  },
  {
    "inputs": [
      {
        "indexed": true,
        "name": "from",
        "internalType": "address",
        "type": "address"
      },
      {
        "indexed": true,
        "name": "to",
        "internalType": "address",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "value",
        "internalType": "uint256",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "anonymous": false,
    "type": "event"
  },
  {
    "outputs": [
      {
        "name": "",
        "internalType": "bytes32",
        "type": "bytes32"
      }
    ],
    "inputs": [],
    "name": "DOMAIN_SEPARATOR",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [
      {
        "name": "",
        "internalType": "uint256",
        "type": "uint256"
      }
    ],
    "inputs": [],
    "name": "MINIMUM_LIQUIDITY",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [
      {
        "name": "",
        "internalType": "bytes32",
        "type": "bytes32"
      }
    ],
    "inputs": [],
    "name": "PERMIT_TYPEHASH",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [
      {
        "name": "",
        "internalType": "uint256",
        "type": "uint256"
      }
    ],
    "inputs": [
      {
        "name": "",
        "internalType": "address",
        "type": "address"
      },
      {
        "name": "",
        "internalType": "address",
        "type": "address"
      }
    ],
    "name": "allowance",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [
      {
        "name": "",
        "internalType": "bool",
        "type": "bool"
      }
    ],
    "inputs": [
      {
        "name": "spender",
        "internalType": "address",
        "type": "address"
      },
      {
        "name": "value",
        "internalType": "uint256",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "outputs": [
      {
        "name": "",
        "internalType": "uint256",
        "type": "uint256"
      }
    ],
    "inputs": [
      {
        "name": "",
        "internalType": "address",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [
      {
        "name": "",
        "internalType": "uint8",
        "type": "uint8"
      }
    ],
    "inputs": [],
    "name": "decimals",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [
      {
        "name": "",
        "internalType": "address",
        "type": "address"
      }
    ],
    "inputs": [],
    "name": "factory",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [
      {
        "name": "",
        "internalType": "uint256",
        "type": "uint256"
      }
    ],
    "inputs": [],
    "name": "kLast",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [
      {
        "name": "",
        "internalType": "string",
        "type": "string"
      }
    ],
    "inputs": [],
    "name": "name",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [
      {
        "name": "",
        "internalType": "uint256",
        "type": "uint256"
      }
    ],
    "inputs": [
      {
        "name": "",
        "internalType": "address",
        "type": "address"
      }
    ],
    "name": "nonces",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [],
    "inputs": [
      {
        "name": "owner",
        "internalType": "address",
        "type": "address"
      },
      {
        "name": "spender",
        "internalType": "address",
        "type": "address"
      },
      {
        "name": "value",
        "internalType": "uint256",
        "type": "uint256"
      },
      {
        "name": "deadline",
        "internalType": "uint256",
        "type": "uint256"
      },
      {
        "name": "v",
        "internalType": "uint8",
        "type": "uint8"
      },
      {
        "name": "r",
        "internalType": "bytes32",
        "type": "bytes32"
      },
      {
        "name": "s",
        "internalType": "bytes32",
        "type": "bytes32"
      }
    ],
    "name": "permit",
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "outputs": [
      {
        "name": "",
        "internalType": "uint256",
        "type": "uint256"
      }
    ],
    "inputs": [],
    "name": "price0CumulativeLast",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [
      {
        "name": "",
        "internalType": "uint256",
        "type": "uint256"
      }
    ],
    "inputs": [],
    "name": "price1CumulativeLast",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [
      {
        "name": "",
        "internalType": "string",
        "type": "string"
      }
    ],
    "inputs": [],
    "name": "symbol",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [
      {
        "name": "",
        "internalType": "address",
        "type": "address"
      }
    ],
    "inputs": [],
    "name": "token0",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [
      {
        "name": "",
        "internalType": "address",
        "type": "address"
      }
    ],
    "inputs": [],
    "name": "token1",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [
      {
        "name": "",
        "internalType": "uint256",
        "type": "uint256"
      }
    ],
    "inputs": [],
    "name": "totalSupply",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [
      {
        "name": "",
        "internalType": "bool",
        "type": "bool"
      }
    ],
    "inputs": [
      {
        "name": "to",
        "internalType": "address",
        "type": "address"
      },
      {
        "name": "value",
        "internalType": "uint256",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "outputs": [
      {
        "name": "",
        "internalType": "bool",
        "type": "bool"
      }
    ],
    "inputs": [
      {
        "name": "from",
        "internalType": "address",
        "type": "address"
      },
      {
        "name": "to",
        "internalType": "address",
        "type": "address"
      },
      {
        "name": "value",
        "internalType": "uint256",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "outputs": [
      {
        "name": "_reserve0",
        "internalType": "uint112",
        "type": "uint112"
      },
      {
        "name": "_reserve1",
        "internalType": "uint112",
        "type": "uint112"
      },
      {
        "name": "_blockTimestampLast",
        "internalType": "uint32",
        "type": "uint32"
      }
    ],
    "inputs": [],
    "name": "getReserves",
    "stateMutability": "view",
    "type": "function"
  },
  {
    "outputs": [],
    "inputs": [
      {
        "name": "_token0",
        "internalType": "address",
        "type": "address"
      },
      {
        "name": "_token1",
        "internalType": "address",
        "type": "address"
      }
    ],
    "name": "initialize",
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "outputs": [
      {
        "name": "liquidity",
        "internalType": "uint256",
        "type": "uint256"
      }
    ],
    "inputs": [
      {
        "name": "to",
        "internalType": "address",
        "type": "address"
      }
    ],
    "name": "mint",
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "outputs": [
      {
        "name": "amount0",
        "internalType": "uint256",
        "type": "uint256"
      },
      {
        "name": "amount1",
        "internalType": "uint256",
        "type": "uint256"
      }
    ],
    "inputs": [
      {
        "name": "to",
        "internalType": "address",
        "type": "address"
      }
    ],
    "name": "burn",
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "outputs": [],
    "inputs": [
      {
        "name": "amount0Out",
        "internalType": "uint256",
        "type": "uint256"
      },
      {
        "name": "amount1Out",
        "internalType": "uint256",
        "type": "uint256"
      },
      {
        "name": "to",
        "internalType": "address",
        "type": "address"
      },
      {
        "name": "data",
        "internalType": "bytes",
        "type": "bytes"
      }
    ],
    "name": "swap",
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "outputs": [],
    "inputs": [
      {
        "name": "to",
        "internalType": "address",
        "type": "address"
      }
    ],
    "name": "skim",
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "outputs": [],
    "inputs": [],
    "name": "sync",
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
