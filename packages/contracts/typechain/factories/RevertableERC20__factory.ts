/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  RevertableERC20,
  RevertableERC20Interface,
} from "../RevertableERC20";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bool",
        name: "_shouldRevert",
        type: "bool",
      },
    ],
    name: "setShouldRevert",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "shouldRevert",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "address",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040526005805461ff00191690553480156200001c57600080fd5b50604080518082018252601081526f2932bb32b93a30b13632902a37b5b2b760811b6020808301918252835180850190945260048452631495949560e21b908401528151919291620000719160039162000229565b5080516200008790600490602084019062000229565b50506005805460ff1916601217905550620000ad3369d3c21bcecceda1000000620000b3565b620002d5565b6001600160a01b0382166200010f576040805162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015290519081900360640190fd5b6200011d60008383620001c2565b6200013981600254620001c760201b6200077d1790919060201c565b6002556001600160a01b038216600090815260208181526040909120546200016c9183906200077d620001c7821b17901c565b6001600160a01b0383166000818152602081815260408083209490945583518581529351929391927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9281900390910190a35050565b505050565b60008282018381101562000222576040805162461bcd60e51b815260206004820152601b60248201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604482015290519081900360640190fd5b9392505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282620002615760008555620002ac565b82601f106200027c57805160ff1916838001178555620002ac565b82800160010185558215620002ac579182015b82811115620002ac5782518255916020019190600101906200028f565b50620002ba929150620002be565b5090565b5b80821115620002ba5760008155600101620002bf565b610e8880620002e56000396000f3fe608060405234801561001057600080fd5b50600436106100f55760003560e01c80636813d78711610097578063a457c2d711610066578063a457c2d7146102f8578063a9059cbb14610324578063d3072d8214610350578063dd62ed3e14610358576100f5565b80636813d7871461027f57806370a082311461029e57806395d89b41146102c45780639dc29fac146102cc576100f5565b806323b872dd116100d357806323b872dd146101d1578063313ce56714610207578063395093511461022557806340c10f1914610251576100f5565b806306fdde03146100fa578063095ea7b31461017757806318160ddd146101b7575b600080fd5b610102610386565b6040805160208082528351818301528351919283929083019185019080838360005b8381101561013c578181015183820152602001610124565b50505050905090810190601f1680156101695780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b6101a36004803603604081101561018d57600080fd5b506001600160a01b03813516906020013561041c565b604080519115158252519081900360200190f35b6101bf610439565b60408051918252519081900360200190f35b6101a3600480360360608110156101e757600080fd5b506001600160a01b0381358116916020810135909116906040013561043f565b61020f6104c6565b6040805160ff9092168252519081900360200190f35b6101a36004803603604081101561023b57600080fd5b506001600160a01b0381351690602001356104cf565b61027d6004803603604081101561026757600080fd5b506001600160a01b03813516906020013561051d565b005b61027d6004803603602081101561029557600080fd5b5035151561057e565b6101bf600480360360208110156102b457600080fd5b50356001600160a01b0316610598565b6101026105b3565b61027d600480360360408110156102e257600080fd5b506001600160a01b038135169060200135610614565b6101a36004803603604081101561030e57600080fd5b506001600160a01b038135169060200135610671565b6101a36004803603604081101561033a57600080fd5b506001600160a01b0381351690602001356106d9565b6101a3610744565b6101bf6004803603604081101561036e57600080fd5b506001600160a01b0381358116916020013516610752565b60038054604080516020601f60026000196101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156104125780601f106103e757610100808354040283529160200191610412565b820191906000526020600020905b8154815290600101906020018083116103f557829003601f168201915b5050505050905090565b60006104306104296107de565b84846107e2565b50600192915050565b60025490565b600061044c8484846108ce565b6104bc846104586107de565b6104b785604051806060016040528060288152602001610d9c602891396001600160a01b038a166000908152600160205260408120906104966107de565b6001600160a01b031681526020810191909152604001600020549190610a29565b6107e2565b5060019392505050565b60055460ff1690565b60006104306104dc6107de565b846104b785600160006104ed6107de565b6001600160a01b03908116825260208083019390935260409182016000908120918c16815292529020549061077d565b600554610100900460ff1615610570576040805162461bcd60e51b81526020600482015260136024820152721b5a5b9d0e8814d213d5531117d49155915495606a1b604482015290519081900360640190fd5b61057a8282610ac0565b5050565b600580549115156101000261ff0019909216919091179055565b6001600160a01b031660009081526020819052604090205490565b60048054604080516020601f60026000196101006001881615020190951694909404938401819004810282018101909252828152606093909290918301828280156104125780601f106103e757610100808354040283529160200191610412565b600554610100900460ff1615610667576040805162461bcd60e51b8152602060048201526013602482015272189d5c9b8e8814d213d5531117d49155915495606a1b604482015290519081900360640190fd5b61057a8282610bb0565b600061043061067e6107de565b846104b785604051806060016040528060258152602001610e2e60259139600160006106a86107de565b6001600160a01b03908116825260208083019390935260409182016000908120918d16815292529020549190610a29565b600554600090610100900460ff1615610739576040805162461bcd60e51b815260206004820152601760248201527f7472616e736665723a2053484f554c445f524556455254000000000000000000604482015290519081900360640190fd5b6104303384846108ce565b600554610100900460ff1681565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b6000828201838110156107d7576040805162461bcd60e51b815260206004820152601b60248201527f536166654d6174683a206164646974696f6e206f766572666c6f770000000000604482015290519081900360640190fd5b9392505050565b3390565b6001600160a01b0383166108275760405162461bcd60e51b8152600401808060200182810382526024815260200180610e0a6024913960400191505060405180910390fd5b6001600160a01b03821661086c5760405162461bcd60e51b8152600401808060200182810382526022815260200180610d546022913960400191505060405180910390fd5b6001600160a01b03808416600081815260016020908152604080832094871680845294825291829020859055815185815291517f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259281900390910190a3505050565b6001600160a01b0383166109135760405162461bcd60e51b8152600401808060200182810382526025815260200180610de56025913960400191505060405180910390fd5b6001600160a01b0382166109585760405162461bcd60e51b8152600401808060200182810382526023815260200180610d0f6023913960400191505060405180910390fd5b610963838383610cac565b6109a081604051806060016040528060268152602001610d76602691396001600160a01b0386166000908152602081905260409020549190610a29565b6001600160a01b0380851660009081526020819052604080822093909355908416815220546109cf908261077d565b6001600160a01b038084166000818152602081815260409182902094909455805185815290519193928716927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef92918290030190a3505050565b60008184841115610ab85760405162461bcd60e51b81526004018080602001828103825283818151815260200191508051906020019080838360005b83811015610a7d578181015183820152602001610a65565b50505050905090810190601f168015610aaa5780820380516001836020036101000a031916815260200191505b509250505060405180910390fd5b505050900390565b6001600160a01b038216610b1b576040805162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015290519081900360640190fd5b610b2760008383610cac565b600254610b34908261077d565b6002556001600160a01b038216600090815260208190526040902054610b5a908261077d565b6001600160a01b0383166000818152602081815260408083209490945583518581529351929391927fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9281900390910190a35050565b6001600160a01b038216610bf55760405162461bcd60e51b8152600401808060200182810382526021815260200180610dc46021913960400191505060405180910390fd5b610c0182600083610cac565b610c3e81604051806060016040528060228152602001610d32602291396001600160a01b0385166000908152602081905260409020549190610a29565b6001600160a01b038316600090815260208190526040902055600254610c649082610cb1565b6002556040805182815290516000916001600160a01b038516917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9181900360200190a35050565b505050565b600082821115610d08576040805162461bcd60e51b815260206004820152601e60248201527f536166654d6174683a207375627472616374696f6e206f766572666c6f770000604482015290519081900360640190fd5b5090039056fe45524332303a207472616e7366657220746f20746865207a65726f206164647265737345524332303a206275726e20616d6f756e7420657863656564732062616c616e636545524332303a20617070726f766520746f20746865207a65726f206164647265737345524332303a207472616e7366657220616d6f756e7420657863656564732062616c616e636545524332303a207472616e7366657220616d6f756e74206578636565647320616c6c6f77616e636545524332303a206275726e2066726f6d20746865207a65726f206164647265737345524332303a207472616e736665722066726f6d20746865207a65726f206164647265737345524332303a20617070726f76652066726f6d20746865207a65726f206164647265737345524332303a2064656372656173656420616c6c6f77616e63652062656c6f77207a65726fa2646970667358221220c16b554a7be55b7d3c899c5017afcf2bcbadb3cd4ef2858f28c4906caae3ab1564736f6c63430007060033";

export class RevertableERC20__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<RevertableERC20> {
    return super.deploy(overrides || {}) as Promise<RevertableERC20>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): RevertableERC20 {
    return super.attach(address) as RevertableERC20;
  }
  connect(signer: Signer): RevertableERC20__factory {
    return super.connect(signer) as RevertableERC20__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): RevertableERC20Interface {
    return new utils.Interface(_abi) as RevertableERC20Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): RevertableERC20 {
    return new Contract(address, _abi, signerOrProvider) as RevertableERC20;
  }
}
