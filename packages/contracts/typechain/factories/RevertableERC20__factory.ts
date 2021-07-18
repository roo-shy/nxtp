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
  "0x60806040526000600560006101000a81548160ff0219169083151502179055503480156200002c57600080fd5b506040518060400160405280601081526020017f52657665727461626c6520546f6b656e000000000000000000000000000000008152506040518060400160405280600481526020017f52565254000000000000000000000000000000000000000000000000000000008152508160039080519060200190620000b192919062000272565b508060049080519060200190620000ca92919062000272565b505050620000e93369d3c21bcecceda1000000620000ef60201b60201c565b620004ce565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16141562000162576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040162000159906200035a565b60405180910390fd5b62000176600083836200026860201b60201c565b80600260008282546200018a9190620003aa565b92505081905550806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254620001e19190620003aa565b925050819055508173ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040516200024891906200037c565b60405180910390a362000264600083836200026d60201b60201c565b5050565b505050565b505050565b828054620002809062000411565b90600052602060002090601f016020900481019282620002a45760008555620002f0565b82601f10620002bf57805160ff1916838001178555620002f0565b82800160010185558215620002f0579182015b82811115620002ef578251825591602001919060010190620002d2565b5b509050620002ff919062000303565b5090565b5b808211156200031e57600081600090555060010162000304565b5090565b600062000331601f8362000399565b91506200033e82620004a5565b602082019050919050565b620003548162000407565b82525050565b60006020820190508181036000830152620003758162000322565b9050919050565b600060208201905062000393600083018462000349565b92915050565b600082825260208201905092915050565b6000620003b78262000407565b9150620003c48362000407565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115620003fc57620003fb62000447565b5b828201905092915050565b6000819050919050565b600060028204905060018216806200042a57607f821691505b6020821081141562000441576200044062000476565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b7f45524332303a206d696e7420746f20746865207a65726f206164647265737300600082015250565b611c1c80620004de6000396000f3fe608060405234801561001057600080fd5b50600436106100f55760003560e01c80636813d78711610097578063a457c2d711610066578063a457c2d714610286578063a9059cbb146102b6578063d3072d82146102e6578063dd62ed3e14610304576100f5565b80636813d7871461020057806370a082311461021c57806395d89b411461024c5780639dc29fac1461026a576100f5565b806323b872dd116100d357806323b872dd14610166578063313ce5671461019657806339509351146101b457806340c10f19146101e4576100f5565b806306fdde03146100fa578063095ea7b31461011857806318160ddd14610148575b600080fd5b610102610334565b60405161010f919061146f565b60405180910390f35b610132600480360381019061012d91906111c2565b6103c6565b60405161013f9190611454565b60405180910390f35b6101506103e4565b60405161015d9190611631565b60405180910390f35b610180600480360381019061017b9190611173565b6103ee565b60405161018d9190611454565b60405180910390f35b61019e6104e6565b6040516101ab919061164c565b60405180910390f35b6101ce60048036038101906101c991906111c2565b6104ef565b6040516101db9190611454565b60405180910390f35b6101fe60048036038101906101f991906111c2565b61059b565b005b61021a600480360381019061021591906111fe565b6105f9565b005b6102366004803603810190610231919061110e565b610616565b6040516102439190611631565b60405180910390f35b61025461065e565b604051610261919061146f565b60405180910390f35b610284600480360381019061027f91906111c2565b6106f0565b005b6102a0600480360381019061029b91906111c2565b61074e565b6040516102ad9190611454565b60405180910390f35b6102d060048036038101906102cb91906111c2565b610839565b6040516102dd9190611454565b60405180910390f35b6102ee6108a0565b6040516102fb9190611454565b60405180910390f35b61031e60048036038101906103199190611137565b6108b3565b60405161032b9190611631565b60405180910390f35b60606003805461034390611795565b80601f016020809104026020016040519081016040528092919081815260200182805461036f90611795565b80156103bc5780601f10610391576101008083540402835291602001916103bc565b820191906000526020600020905b81548152906001019060200180831161039f57829003601f168201915b5050505050905090565b60006103da6103d361093a565b8484610942565b6001905092915050565b6000600254905090565b60006103fb848484610b0d565b6000600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600061044661093a565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050828110156104c6576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016104bd90611551565b60405180910390fd5b6104da856104d261093a565b858403610942565b60019150509392505050565b60006012905090565b60006105916104fc61093a565b84846001600061050a61093a565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461058c9190611683565b610942565b6001905092915050565b600560009054906101000a900460ff16156105eb576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016105e2906115b1565b60405180910390fd5b6105f58282610d8e565b5050565b80600560006101000a81548160ff02191690831515021790555050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b60606004805461066d90611795565b80601f016020809104026020016040519081016040528092919081815260200182805461069990611795565b80156106e65780601f106106bb576101008083540402835291602001916106e6565b820191906000526020600020905b8154815290600101906020018083116106c957829003601f168201915b5050505050905090565b600560009054906101000a900460ff1615610740576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610737906114d1565b60405180910390fd5b61074a8282610eee565b5050565b6000806001600061075d61093a565b73ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490508281101561081a576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610811906115f1565b60405180910390fd5b61082e61082561093a565b85858403610942565b600191505092915050565b6000600560009054906101000a900460ff161561088b576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161088290611511565b60405180910390fd5b610896338484610b0d565b6001905092915050565b600560009054906101000a900460ff1681565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b600033905090565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614156109b2576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016109a9906115d1565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610a22576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a19906114f1565b60405180910390fd5b80600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92583604051610b009190611631565b60405180910390a3505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415610b7d576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610b7490611591565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610bed576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610be490611491565b60405180910390fd5b610bf88383836110c5565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015610c7e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610c7590611531565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610d119190611683565b925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610d759190611631565b60405180910390a3610d888484846110ca565b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610dfe576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610df590611611565b60405180910390fd5b610e0a600083836110c5565b8060026000828254610e1c9190611683565b92505081905550806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610e719190611683565b925050819055508173ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610ed69190611631565b60405180910390a3610eea600083836110ca565b5050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610f5e576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610f5590611571565b60405180910390fd5b610f6a826000836110c5565b60008060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015610ff0576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610fe7906114b1565b60405180910390fd5b8181036000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550816002600082825461104791906116d9565b92505081905550600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040516110ac9190611631565b60405180910390a36110c0836000846110ca565b505050565b505050565b505050565b6000813590506110de81611ba1565b92915050565b6000813590506110f381611bb8565b92915050565b60008135905061110881611bcf565b92915050565b60006020828403121561112057600080fd5b600061112e848285016110cf565b91505092915050565b6000806040838503121561114a57600080fd5b6000611158858286016110cf565b9250506020611169858286016110cf565b9150509250929050565b60008060006060848603121561118857600080fd5b6000611196868287016110cf565b93505060206111a7868287016110cf565b92505060406111b8868287016110f9565b9150509250925092565b600080604083850312156111d557600080fd5b60006111e3858286016110cf565b92505060206111f4858286016110f9565b9150509250929050565b60006020828403121561121057600080fd5b600061121e848285016110e4565b91505092915050565b6112308161171f565b82525050565b600061124182611667565b61124b8185611672565b935061125b818560208601611762565b61126481611825565b840191505092915050565b600061127c602383611672565b915061128782611836565b604082019050919050565b600061129f602283611672565b91506112aa82611885565b604082019050919050565b60006112c2601383611672565b91506112cd826118d4565b602082019050919050565b60006112e5602283611672565b91506112f0826118fd565b604082019050919050565b6000611308601783611672565b91506113138261194c565b602082019050919050565b600061132b602683611672565b915061133682611975565b604082019050919050565b600061134e602883611672565b9150611359826119c4565b604082019050919050565b6000611371602183611672565b915061137c82611a13565b604082019050919050565b6000611394602583611672565b915061139f82611a62565b604082019050919050565b60006113b7601383611672565b91506113c282611ab1565b602082019050919050565b60006113da602483611672565b91506113e582611ada565b604082019050919050565b60006113fd602583611672565b915061140882611b29565b604082019050919050565b6000611420601f83611672565b915061142b82611b78565b602082019050919050565b61143f8161174b565b82525050565b61144e81611755565b82525050565b60006020820190506114696000830184611227565b92915050565b600060208201905081810360008301526114898184611236565b905092915050565b600060208201905081810360008301526114aa8161126f565b9050919050565b600060208201905081810360008301526114ca81611292565b9050919050565b600060208201905081810360008301526114ea816112b5565b9050919050565b6000602082019050818103600083015261150a816112d8565b9050919050565b6000602082019050818103600083015261152a816112fb565b9050919050565b6000602082019050818103600083015261154a8161131e565b9050919050565b6000602082019050818103600083015261156a81611341565b9050919050565b6000602082019050818103600083015261158a81611364565b9050919050565b600060208201905081810360008301526115aa81611387565b9050919050565b600060208201905081810360008301526115ca816113aa565b9050919050565b600060208201905081810360008301526115ea816113cd565b9050919050565b6000602082019050818103600083015261160a816113f0565b9050919050565b6000602082019050818103600083015261162a81611413565b9050919050565b60006020820190506116466000830184611436565b92915050565b60006020820190506116616000830184611445565b92915050565b600081519050919050565b600082825260208201905092915050565b600061168e8261174b565b91506116998361174b565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff038211156116ce576116cd6117c7565b5b828201905092915050565b60006116e48261174b565b91506116ef8361174b565b925082821015611702576117016117c7565b5b828203905092915050565b60006117188261172b565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b60005b83811015611780578082015181840152602081019050611765565b8381111561178f576000848401525b50505050565b600060028204905060018216806117ad57607f821691505b602082108114156117c1576117c06117f6565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000601f19601f8301169050919050565b7f45524332303a207472616e7366657220746f20746865207a65726f206164647260008201527f6573730000000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a206275726e20616d6f756e7420657863656564732062616c616e60008201527f6365000000000000000000000000000000000000000000000000000000000000602082015250565b7f6275726e3a2053484f554c445f52455645525400000000000000000000000000600082015250565b7f45524332303a20617070726f766520746f20746865207a65726f20616464726560008201527f7373000000000000000000000000000000000000000000000000000000000000602082015250565b7f7472616e736665723a2053484f554c445f524556455254000000000000000000600082015250565b7f45524332303a207472616e7366657220616d6f756e742065786365656473206260008201527f616c616e63650000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a207472616e7366657220616d6f756e742065786365656473206160008201527f6c6c6f77616e6365000000000000000000000000000000000000000000000000602082015250565b7f45524332303a206275726e2066726f6d20746865207a65726f2061646472657360008201527f7300000000000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a207472616e736665722066726f6d20746865207a65726f20616460008201527f6472657373000000000000000000000000000000000000000000000000000000602082015250565b7f6d696e743a2053484f554c445f52455645525400000000000000000000000000600082015250565b7f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460008201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760008201527f207a65726f000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a206d696e7420746f20746865207a65726f206164647265737300600082015250565b611baa8161170d565b8114611bb557600080fd5b50565b611bc18161171f565b8114611bcc57600080fd5b50565b611bd88161174b565b8114611be357600080fd5b5056fea26469706673582212203f5a494a362cf8febecad81447e0c42529516a61efb724daa75b9c1ee76e8d2264736f6c63430008040033";

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