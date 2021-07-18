/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import { TypedEventFilter, TypedEvent, TypedListener } from "./commons";

interface PercentageMathTestInterface extends ethers.utils.Interface {
  functions: {
    "calculatePercent(uint256,uint256)": FunctionFragment;
    "percentDiv(uint256,uint256)": FunctionFragment;
    "percentMul(uint256,uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "calculatePercent",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "percentDiv",
    values: [BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "percentMul",
    values: [BigNumberish, BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "calculatePercent",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "percentDiv", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "percentMul", data: BytesLike): Result;

  events: {};
}

export class PercentageMathTest extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: PercentageMathTestInterface;

  functions: {
    calculatePercent(
      value: BigNumberish,
      total: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    percentDiv(
      value: BigNumberish,
      percentage: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;

    percentMul(
      value: BigNumberish,
      percentage: BigNumberish,
      overrides?: CallOverrides
    ): Promise<[BigNumber]>;
  };

  calculatePercent(
    value: BigNumberish,
    total: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  percentDiv(
    value: BigNumberish,
    percentage: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  percentMul(
    value: BigNumberish,
    percentage: BigNumberish,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  callStatic: {
    calculatePercent(
      value: BigNumberish,
      total: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    percentDiv(
      value: BigNumberish,
      percentage: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    percentMul(
      value: BigNumberish,
      percentage: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  filters: {};

  estimateGas: {
    calculatePercent(
      value: BigNumberish,
      total: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    percentDiv(
      value: BigNumberish,
      percentage: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    percentMul(
      value: BigNumberish,
      percentage: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    calculatePercent(
      value: BigNumberish,
      total: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    percentDiv(
      value: BigNumberish,
      percentage: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    percentMul(
      value: BigNumberish,
      percentage: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;
  };
}