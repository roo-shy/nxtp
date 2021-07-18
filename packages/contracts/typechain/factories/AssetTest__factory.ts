/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { AssetTest, AssetTestInterface } from "../AssetTest";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "assetId",
        type: "address",
      },
    ],
    name: "getOwnBalance",
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
        name: "assetId",
        type: "address",
      },
    ],
    name: "isEther",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "assetId",
        type: "address",
      },
      {
        internalType: "address payable",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferAsset",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "assetId",
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
    name: "transferERC20",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address payable",
        name: "recipient",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferEther",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610934806100206000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c806305b1137b1461005c578063439e2e45146100785780634b93c875146100945780639db5dbe4146100c4578063a7d2fdf6146100e0575b600080fd5b61007660048036038101906100719190610675565b610110565b005b610092600480360381019061008d91906106b1565b61011e565b005b6100ae60048036038101906100a9919061064c565b61012e565b6040516100bb9190610812565b60405180910390f35b6100de60048036038101906100d99190610700565b610140565b005b6100fa60048036038101906100f5919061064c565b610150565b604051610107919061082d565b60405180910390f35b61011a8282610162565b5050565b610129838383610231565b505050565b6000610139826102e2565b9050919050565b61014b83838361039f565b505050565b600061015b826104b6565b9050919050565b61018e7fd7351ce214b1feb59e7ef5eb05925a06330c27e57f3e1350dbc336bcc5bba12960001b6105e0565b6101ba7faeff790d8746aeae5c96cf16007aa1d3c0a3310cfdf0dbf222029f3750f58fbf60001b6105e0565b6101e67f7cbbc28866cd9cc6e9fdd8ad3ac8348b4042ed2cd22991fad1352d8bfacbed2e60001b6105e0565b8173ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f1935050505015801561022c573d6000803e3d6000fd5b505050565b61025d7f9c1192522ed404332a2d7d1a80b7ad817f70c1f6a8af221f3c040d59ef4e127160001b6105e0565b6102897f0168ac6c7d2d25350f4bf14b865d18dacaa977c9d8ede32042cedd047edaf25360001b6105e0565b6102b57f895b9ebb1fd8a25e9cd0066a4dcafa3aebc62333246c2461e1a059f88cb54cf860001b6105e0565b6102be836102e2565b6102d2576102cd83838361039f565b6102dd565b6102dc8282610162565b5b505050565b60006103107fe74d3bf5d343e3316beb207a38168ee59d74663e3a3fb0929f61dd5e8f24d6e360001b6105e0565b61033c7fc6447d64bf0c80f184f71c923e77c9cc86f84c25ed2d208b05a862eda4eeea9560001b6105e0565b6103687f4ee1d7f77d6ba549754071140c254f86be7e035f2c4624c2dcd681660496d9ae60001b6105e0565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16149050919050565b6103cb7fa204dd2175f9bd0af6ff6c41f54dbaad7a8fe0452b52f38c08bad1dad42d23ad60001b6105e0565b6103f77ff798f16718148904f23b4a2c7f042f8be367883d38374c87e0d8fd44a20d825c60001b6105e0565b6104237f1c4667e907fa81165cca71b1910cd3bb16fbb9acc22178d6c37b57ebcc305aa160001b6105e0565b8273ffffffffffffffffffffffffffffffffffffffff1663a9059cbb83836040518363ffffffff1660e01b815260040161045e9291906107e9565b602060405180830381600087803b15801561047857600080fd5b505af115801561048c573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906104b0919061074f565b50505050565b60006104e47fc58e81f724a156e4fd3753192f754822d1472162fcc07737b16ded3943ae886360001b6105e0565b6105107fb9f9d7b8fa71d13bc93820bc857e679d0e4ca147c1b7f64b2066dd8c0fc87daf60001b6105e0565b61053c7f4a23f53b885284ea56e13d740c006bd7a6023b10c12e5068bcc36908ddbb7fa760001b6105e0565b610545826102e2565b6105d7578173ffffffffffffffffffffffffffffffffffffffff166370a08231306040518263ffffffff1660e01b815260040161058291906107ce565b60206040518083038186803b15801561059a57600080fd5b505afa1580156105ae573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906105d29190610778565b6105d9565b475b9050919050565b50565b6000813590506105f2816108a2565b92915050565b600081359050610607816108b9565b92915050565b60008151905061061c816108d0565b92915050565b600081359050610631816108e7565b92915050565b600081519050610646816108e7565b92915050565b60006020828403121561065e57600080fd5b600061066c848285016105e3565b91505092915050565b6000806040838503121561068857600080fd5b6000610696858286016105f8565b92505060206106a785828601610622565b9150509250929050565b6000806000606084860312156106c657600080fd5b60006106d4868287016105e3565b93505060206106e5868287016105f8565b92505060406106f686828701610622565b9150509250925092565b60008060006060848603121561071557600080fd5b6000610723868287016105e3565b9350506020610734868287016105e3565b925050604061074586828701610622565b9150509250925092565b60006020828403121561076157600080fd5b600061076f8482850161060d565b91505092915050565b60006020828403121561078a57600080fd5b600061079884828501610637565b91505092915050565b6107aa81610848565b82525050565b6107b98161086c565b82525050565b6107c881610898565b82525050565b60006020820190506107e360008301846107a1565b92915050565b60006040820190506107fe60008301856107a1565b61080b60208301846107bf565b9392505050565b600060208201905061082760008301846107b0565b92915050565b600060208201905061084260008301846107bf565b92915050565b600061085382610878565b9050919050565b600061086582610878565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b6108ab81610848565b81146108b657600080fd5b50565b6108c28161085a565b81146108cd57600080fd5b50565b6108d98161086c565b81146108e457600080fd5b50565b6108f081610898565b81146108fb57600080fd5b5056fea2646970667358221220990f6a252d3fff1639800aaf955c2293ca0913ecc62b68684a3e12e6702e195564736f6c63430008040033";

export class AssetTest__factory extends ContractFactory {
  constructor(signer?: Signer) {
    super(_abi, _bytecode, signer);
  }

  deploy(overrides?: Overrides & { from?: string | Promise<string> }): Promise<AssetTest> {
    return super.deploy(overrides || {}) as Promise<AssetTest>;
  }
  getDeployTransaction(overrides?: Overrides & { from?: string | Promise<string> }): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): AssetTest {
    return super.attach(address) as AssetTest;
  }
  connect(signer: Signer): AssetTest__factory {
    return super.connect(signer) as AssetTest__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): AssetTestInterface {
    return new utils.Interface(_abi) as AssetTestInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): AssetTest {
    return new Contract(address, _abi, signerOrProvider) as AssetTest;
  }
}