import { constants, providers, Signer, utils, BigNumber, Wallet, Contract } from "ethers";
import { Evt } from "evt";
import {
  ajv,
  getRandomBytes32,
  TIntegerString,
  TAddress,
  UserNxtpNatsMessagingService,
  PrepareParams,
  TransactionPreparedEvent,
  TransactionFulfilledEvent,
  TransactionCancelledEvent,
  TChainId,
  encrypt,
  generateMessagingInbox as _generateMessagingInbox,
  AuctionResponse,
  encodeAuctionBid,
  InvariantTransactionData,
  recoverAuctionBid as _recoverAuctionBid,
  signFulfillTransactionPayload as _signFulfillTransactionPayload,
  MetaTxResponse,
  jsonifyError,
  AuctionBid,
  isNode,
  NATS_AUTH_URL,
  NATS_CLUSTER_URL,
  NATS_WS_URL,
  NATS_AUTH_URL_TESTNET,
  NATS_AUTH_URL_LOCAL,
  NATS_CLUSTER_URL_LOCAL,
  NATS_WS_URL_LOCAL,
  NATS_CLUSTER_URL_TESTNET,
  NATS_WS_URL_TESTNET,
  getDeployedSubgraphUri,
  calculateExchangeWad,
  ERC20Abi,
  TransactionDataSchema,
  delay,
  getOnchainBalance as _getOnchainBalance,
  MetaTxTypes,
  getNtpTimeSeconds,
} from "@connext/nxtp-utils";
import pino, { BaseLogger } from "pino";
import { Type, Static } from "@sinclair/typebox";

import { TransactionManager, getDeployedTransactionManagerContract } from "./transactionManager";
import {
  SubmitError,
  NoTransactionManager,
  NoSubgraph,
  InvalidParamStructure,
  InvalidSlippage,
  InvalidExpiry,
  EncryptionError,
  NoBids,
  NoValidBids,
  UnknownAuctionError,
  ChainNotConfigured,
  InvalidAmount,
  InvalidBidSignature,
  MetaTxTimeout,
} from "./error";
import { Subgraph, SubgraphEvent, SubgraphEvents, ActiveTransaction, HistoricalTransaction } from "./subgraph";

/**
 * Utility to convert the number of hours into seconds
 *
 * @param hours - Number of hours to convert
 * @returns Equivalent seconds
 */
const hoursToSeconds = (hours: number) => hours * 60 * 60;

/**
 * Utility to convert the number of days into seconds
 *
 * @param days - Number of days to convert
 * @returns Equivalent seconds
 */
const daysToSeconds = (days: number) => hoursToSeconds(days * 24);

/**
 * Gets the expiry to use for new transfers
 *
 * @param latestBlockTimestamp - Timestamp of the latest block on the sending chain (from `getTimestampInSeconds`)
 * @returns Default expiry of 3 days + 3 hours (in seconds)
 */
export const getExpiry = (latestBlockTimestamp: number) => latestBlockTimestamp + daysToSeconds(3) + hoursToSeconds(3);

/**
 * Gets the current timestamp. Uses the latest block.timestamp instead of a
 * local clock to avoid issues with time when router is validating
 *
 * @remarks User should use the timestamp on the chain they are preparing on (sending chain)
 *
 * @returns Timestamp on latest block in seconds
 */
export const getTimestampInSeconds = async (): Promise<number> => {
  return await getNtpTimeSeconds();
};

export const getOnchainBalance = (assetId: string, address: string, provider: providers.FallbackProvider) =>
  _getOnchainBalance(assetId, address, provider);

/**
 * Gets the minimum expiry buffer
 *
 * @returns Equivalent of 2days + 1 hour in seconds
 */
export const getMinExpiryBuffer = () => daysToSeconds(2) + hoursToSeconds(1); // 2 days + 1 hour

/**
 * Gets the maximum expiry buffer
 *
 * @remarks This is *not* the same as the contract maximum of 30days
 *
 * @returns Equivalent of 4 days
 */
export const getMaxExpiryBuffer = () => daysToSeconds(4); // 4 days

export const getDecimals = async (assetId: string, provider: providers.FallbackProvider) => {
  if (assetId === constants.AddressZero) {
    return 18;
  }
  const decimals = await new Contract(assetId, ERC20Abi, provider).decimals();
  return decimals;
};

export const MIN_SLIPPAGE_TOLERANCE = "00.01"; // 0.01%;
export const MAX_SLIPPAGE_TOLERANCE = "15.00"; // 15.0%
export const DEFAULT_SLIPPAGE_TOLERANCE = "0.10"; // 0.10%
export const AUCTION_TIMEOUT = 6_000;
export const META_TX_TIMEOUT = 300_000;

declare const ethereum: any; // TODO: #141 what to do about node?

export const CrossChainParamsSchema = Type.Object({
  callData: Type.Optional(Type.RegEx(/^0x[a-fA-F0-9]*$/)),
  sendingChainId: TChainId,
  sendingAssetId: TAddress,
  receivingChainId: TChainId,
  receivingAssetId: TAddress,
  callTo: Type.Optional(TAddress),
  receivingAddress: TAddress,
  amount: TIntegerString,
  expiry: Type.Optional(Type.Number()),
  transactionId: Type.Optional(Type.RegEx(/^0x[a-fA-F0-9]{64}$/)),
  slippageTolerance: Type.Optional(Type.String()),
  dryRun: Type.Optional(Type.Boolean()),
  preferredRouter: Type.Optional(TAddress),
});

export type CrossChainParams = Static<typeof CrossChainParamsSchema>;

export const AuctionBidParamsSchema = Type.Object({
  user: TAddress,
  router: TAddress,
  sendingChainId: TChainId,
  sendingAssetId: TAddress,
  amount: TIntegerString,
  receivingChainId: TChainId,
  receivingAssetId: TAddress,
  amountReceived: TIntegerString,
  receivingAddress: TAddress,
  transactionId: Type.RegEx(/^0x[a-fA-F0-9]{64}$/),
  expiry: Type.Number(),
  callDataHash: Type.RegEx(/^0x[a-fA-F0-9]{64}$/),
  callTo: TAddress,
  encryptedCallData: Type.String(),
  sendingChainTxManagerAddress: TAddress,
  receivingChainTxManagerAddress: TAddress,
  bidExpiry: Type.Number(),
});

export type AuctionBidParams = Static<typeof AuctionBidParamsSchema>;

export const TransactionPrepareEventSchema = Type.Object({
  txData: TransactionDataSchema,
  encryptedCallData: Type.String(),
  encodedBid: Type.String(),
  bidSignature: Type.String(),
});

export type TransactionPrepareEventParams = Static<typeof TransactionPrepareEventSchema>;

export const CancelSchema = Type.Object({
  txData: TransactionDataSchema,
  relayerFee: Type.String(),
  signature: Type.String(),
});

export type CancelParams = Static<typeof CancelSchema>;

export const NxtpSdkEvents = {
  SenderTokenApprovalSubmitted: "SenderTokenApprovalSubmitted",
  SenderTokenApprovalMined: "SenderTokenApprovalMined",
  SenderTransactionPrepareSubmitted: "SenderTransactionPrepareSubmitted",
  SenderTransactionPrepared: "SenderTransactionPrepared",
  SenderTransactionFulfilled: "SenderTransactionFulfilled",
  SenderTransactionCancelled: "SenderTransactionCancelled",
  ReceiverPrepareSigned: "ReceiverPrepareSigned",
  ReceiverTransactionPrepared: "ReceiverTransactionPrepared",
  ReceiverTransactionFulfilled: "ReceiverTransactionFulfilled",
  ReceiverTransactionCancelled: "ReceiverTransactionCancelled",
} as const;
export type NxtpSdkEvent = typeof NxtpSdkEvents[keyof typeof NxtpSdkEvents];

export type SenderTokenApprovalSubmittedPayload = {
  assetId: string;
  chainId: number;
  transactionResponse: providers.TransactionResponse;
};

export type SenderTokenApprovalMinedPayload = {
  assetId: string;
  chainId: number;
  transactionReceipt: providers.TransactionReceipt;
};

export type SenderTransactionPrepareSubmittedPayload = {
  prepareParams: PrepareParams;
  transactionResponse: providers.TransactionResponse;
};

export type ReceiverPrepareSignedPayload = {
  signature: string;
  signer: string;
  transactionId: string;
};

export type SdkEvent<T> = T & {
  transactionHash: string;
};

export type SenderTransactionPreparedPayload = SdkEvent<TransactionPreparedEvent>;
export type SenderTransactionFulfilledPayload = SdkEvent<TransactionFulfilledEvent>;
export type SenderTransactionCancelledPayload = SdkEvent<TransactionCancelledEvent>;
export type ReceiverTransactionPreparedPayload = SdkEvent<TransactionPreparedEvent>;
export type ReceiverTransactionFulfilledPayload = SdkEvent<TransactionFulfilledEvent>;
export type ReceiverTransactionCancelledPayload = SdkEvent<TransactionCancelledEvent>;

export interface NxtpSdkEventPayloads {
  [NxtpSdkEvents.SenderTokenApprovalSubmitted]: SenderTokenApprovalSubmittedPayload;
  [NxtpSdkEvents.SenderTokenApprovalMined]: SenderTokenApprovalMinedPayload;
  [NxtpSdkEvents.SenderTransactionPrepareSubmitted]: SenderTransactionPrepareSubmittedPayload;
  [NxtpSdkEvents.SenderTransactionPrepared]: SenderTransactionPreparedPayload;
  [NxtpSdkEvents.SenderTransactionFulfilled]: SenderTransactionFulfilledPayload;
  [NxtpSdkEvents.SenderTransactionCancelled]: SenderTransactionCancelledPayload;
  [NxtpSdkEvents.ReceiverPrepareSigned]: ReceiverPrepareSignedPayload;
  [NxtpSdkEvents.ReceiverTransactionPrepared]: ReceiverTransactionPreparedPayload;
  [NxtpSdkEvents.ReceiverTransactionFulfilled]: ReceiverTransactionFulfilledPayload;
  [NxtpSdkEvents.ReceiverTransactionCancelled]: ReceiverTransactionCancelledPayload;
}

/**
 * Helper to generate evt instances for all SDK events
 *
 * @returns A container keyed on event names whos values contain the EVT instance for the keyed event
 */
export const createEvts = (): { [K in NxtpSdkEvent]: Evt<NxtpSdkEventPayloads[K]> } => {
  return {
    [NxtpSdkEvents.SenderTokenApprovalSubmitted]: Evt.create<SenderTokenApprovalSubmittedPayload>(),
    [NxtpSdkEvents.SenderTokenApprovalMined]: Evt.create<SenderTokenApprovalMinedPayload>(),
    [NxtpSdkEvents.SenderTransactionPrepareSubmitted]: Evt.create<SenderTransactionPrepareSubmittedPayload>(),
    [NxtpSdkEvents.SenderTransactionPrepared]: Evt.create<SenderTransactionPreparedPayload>(),
    [NxtpSdkEvents.SenderTransactionFulfilled]: Evt.create<SenderTransactionFulfilledPayload>(),
    [NxtpSdkEvents.SenderTransactionCancelled]: Evt.create<SenderTransactionCancelledPayload>(),
    [NxtpSdkEvents.ReceiverPrepareSigned]: Evt.create<ReceiverPrepareSignedPayload>(),
    [NxtpSdkEvents.ReceiverTransactionPrepared]: Evt.create<ReceiverTransactionPreparedPayload>(),
    [NxtpSdkEvents.ReceiverTransactionFulfilled]: Evt.create<ReceiverTransactionFulfilledPayload>(),
    [NxtpSdkEvents.ReceiverTransactionCancelled]: Evt.create<ReceiverTransactionCancelledPayload>(),
  };
};

/**
 * This is only here to make it easier for sinon mocks to happen in the tests. Otherwise, this is a very dumb thing.
 *
 */
export const signFulfillTransactionPayload = async (
  transactionId: string,
  relayerFee: string,
  receivingChainId: number,
  receivingChainTxManagerAddress: string,
  signer: Wallet | Signer,
): Promise<string> => {
  return await _signFulfillTransactionPayload(
    transactionId,
    relayerFee,
    receivingChainId,
    receivingChainTxManagerAddress,
    signer,
  );
};

/**
 * This is only here to make it easier for sinon mocks to happen in the tests. Otherwise, this is a very dumb thing.
 *
 */
export const generateMessagingInbox = (): string => {
  return _generateMessagingInbox();
};

/**
 * This is only here to make it easier for sinon mocks to happen in the tests. Otherwise, this is a very dumb thing.
 *
 * @param bid - Bid information that should've been signed
 * @param signature - Signature to recover signer of
 * @returns Recovered signer
 */
export const recoverAuctionBid = (bid: AuctionBid, signature: string): string => {
  return _recoverAuctionBid(bid, signature);
};

/**
 * Used to make mocking easier
 */
export const createMessagingEvt = <T>() => {
  return Evt.create<{ inbox: string; data?: T; err?: any }>();
};

/**
 * @classdesc Lightweight class to facilitate interaction with the TransactionManager contract on configured chains.
 *
 */
export class NxtpSdk {
  private evts: { [K in NxtpSdkEvent]: Evt<NxtpSdkEventPayloads[K]> } = createEvts();
  private readonly transactionManager: TransactionManager;
  private readonly messaging: UserNxtpNatsMessagingService;
  private readonly subgraph: Subgraph;

  // Keep messaging evts separate from the evt container that has things
  // attached to it
  private readonly auctionResponseEvt = createMessagingEvt<AuctionResponse>();
  private readonly metaTxResponseEvt = createMessagingEvt<MetaTxResponse>();

  constructor(
    private readonly chainConfig: {
      [chainId: number]: {
        provider: providers.FallbackProvider;
        transactionManagerAddress?: string;
        subgraph?: string;
      };
    },
    private signer: Signer,
    private readonly logger: BaseLogger = pino(),
    network: "testnet" | "mainnet" | "local" = "mainnet",
    natsUrl?: string,
    authUrl?: string,
    messaging?: UserNxtpNatsMessagingService,
  ) {
    if (messaging) {
      this.messaging = messaging;
    } else {
      let _natsUrl;
      let _authUrl;
      switch (network) {
        case "mainnet": {
          _natsUrl = natsUrl ?? (isNode() ? NATS_CLUSTER_URL : NATS_WS_URL);
          _authUrl = authUrl ?? NATS_AUTH_URL;
          break;
        }
        case "testnet": {
          _natsUrl = natsUrl ?? (isNode() ? NATS_CLUSTER_URL_TESTNET : NATS_WS_URL_TESTNET);
          _authUrl = authUrl ?? NATS_AUTH_URL_TESTNET;
          break;
        }
        case "local": {
          _natsUrl = natsUrl ?? (isNode() ? NATS_CLUSTER_URL_LOCAL : NATS_WS_URL_LOCAL);
          _authUrl = authUrl ?? NATS_AUTH_URL_LOCAL;
          break;
        }
      }
      this.messaging = new UserNxtpNatsMessagingService({
        signer,
        logger: logger.child({ module: "UserNxtpNatsMessagingService" }),
        natsUrl: _natsUrl,
        authUrl: _authUrl,
      });
    }

    const txManagerConfig: Record<
      number,
      {
        provider: providers.FallbackProvider;
        transactionManagerAddress: string;
      }
    > = {};

    const subgraphConfig: Record<
      number,
      {
        subgraph: string;
      }
    > = {};

    // create configs for subclasses based on passed-in config
    Object.entries(this.chainConfig).forEach(
      ([_chainId, { provider, transactionManagerAddress: _transactionManagerAddress, subgraph: _subgraph }]) => {
        const chainId = parseInt(_chainId);
        let transactionManagerAddress = _transactionManagerAddress;
        if (!transactionManagerAddress) {
          const res = getDeployedTransactionManagerContract(chainId);
          if (!res || !res.address) {
            throw new NoTransactionManager(chainId);
          }
          transactionManagerAddress = res.address;
        }

        txManagerConfig[chainId] = {
          provider,
          transactionManagerAddress,
        };

        let subgraph = _subgraph;
        if (!subgraph) {
          subgraph = getDeployedSubgraphUri(chainId);
        }
        if (!subgraph) {
          throw new NoSubgraph(chainId);
        }
        subgraphConfig[chainId] = {
          subgraph,
        };
      },
    );
    this.transactionManager = new TransactionManager(
      this.signer,
      txManagerConfig,
      this.logger.child({ module: "TransactionManager" }),
    );
    this.subgraph = new Subgraph(this.signer, subgraphConfig, this.logger.child({ module: "Subgraph" }));
  }

  async connectMessaging(bearerToken?: string): Promise<string> {
    // Setup the subscriptions
    const token = await this.messaging.connect(bearerToken);
    await this.messaging.subscribeToAuctionResponse(
      (_from: string, inbox: string, data?: AuctionResponse, err?: any) => {
        this.auctionResponseEvt.post({ inbox, data, err });
      },
    );

    await this.messaging.subscribeToMetaTxResponse((_from: string, inbox: string, data?: MetaTxResponse, err?: any) => {
      this.metaTxResponseEvt.post({ inbox, data, err });
    });

    await delay(1000);
    return token;
  }

  /**
   * Gets all the transactions that could require user action from the subgraph across all configured chains
   *
   * @returns An array of the active transactions and their status
   */
  public async getActiveTransactions(): Promise<ActiveTransaction[]> {
    return this.subgraph.getActiveTransactions();
  }

  /**
   * Gets historical transactions
   *
   * @returns An array of historical transactions
   */
  public async getHistoricalTransactions(): Promise<HistoricalTransaction[]> {
    return this.subgraph.getHistoricalTransactions();
  }

  /**
   * Fetches an estimated quote for a proposed crosschain transfer. Runs an auction to determine the `router` for a transaction and the estimated received value.
   *
   * @param params - Params to create crosschain transfer with
   * @param params.callData - The calldata to execute on the receiving chain
   * @param params.sendingChainId - The originating chain (where user is sending funds from)
   * @param params.sendingAssetId - The originating asset of the funds the user is sending
   * @param params.receivingChainId - The destination chain (where user wants the funds)
   * @param params.receivingAssetId - The assetId of funds the user would like to receive on the receiving chain
   * @param params.callTo - The address on the receiving chain to execute the callData on
   * @param params.receivingAddress - The address the funds should be sent to on the destination chain if callTo/callData is empty, or the fallback address if the callTo/callData is specified
   * @param params.amount - The amount the user will send on the sending chain. This is not necessarily the amount they will receive
   * @param params.expiry - The expiry on the sending chain for the transfer
   * @param params.transactionId - The unique identifier for the transfer
   *
   * @returns The auction response for the given transacton
   *
   * @remarks
   * The user chooses the transactionId, and they are incentivized to keep the transactionId unique otherwise their signature could e replayed and they would lose funds.
   */
  public async getTransferQuote(params: CrossChainParams): Promise<AuctionResponse> {
    const method = "getTransferQuote";
    const methodId = getRandomBytes32();
    this.logger.info({ method, methodId, params }, "Method started");

    // Validate params schema
    const validate = ajv.compile(CrossChainParamsSchema);
    const valid = validate(params);
    if (!valid) {
      const error = (validate.errors ?? []).map((err) => `${err.instancePath} - ${err.message}`).join(",");
      this.logger.error({ method, methodId, error: validate.errors, params }, "Invalid transfer params");
      throw new InvalidParamStructure("getTransferQuote", "CrossChainParams", error, params);
    }

    const user = await this.signer.getAddress();

    const {
      sendingAssetId,
      sendingChainId,
      amount,
      receivingChainId,
      receivingAssetId,
      receivingAddress,
      slippageTolerance = DEFAULT_SLIPPAGE_TOLERANCE,
      expiry: _expiry,
      dryRun,
      preferredRouter: _preferredRouter,
    } = params;
    if (!this.chainConfig[sendingChainId]) {
      throw new ChainNotConfigured(sendingChainId, Object.keys(this.chainConfig));
    }

    if (!this.chainConfig[receivingChainId]) {
      throw new ChainNotConfigured(receivingChainId, Object.keys(this.chainConfig));
    }

    if (parseFloat(slippageTolerance) < parseFloat(MIN_SLIPPAGE_TOLERANCE)) {
      throw new InvalidSlippage(slippageTolerance, MIN_SLIPPAGE_TOLERANCE, MAX_SLIPPAGE_TOLERANCE);
    }

    if (parseFloat(slippageTolerance) > parseFloat(MAX_SLIPPAGE_TOLERANCE)) {
      throw new InvalidSlippage(slippageTolerance, MIN_SLIPPAGE_TOLERANCE, MAX_SLIPPAGE_TOLERANCE);
    }

    const preferredRouter = _preferredRouter ? utils.getAddress(_preferredRouter) : undefined;

    const blockTimestamp = await getTimestampInSeconds();
    const expiry = _expiry ?? getExpiry(blockTimestamp);
    if (expiry - blockTimestamp < getMinExpiryBuffer()) {
      throw new InvalidExpiry(expiry, getMinExpiryBuffer(), getMaxExpiryBuffer(), blockTimestamp);
    }

    if (expiry - blockTimestamp > getMaxExpiryBuffer()) {
      throw new InvalidExpiry(expiry, getMinExpiryBuffer(), getMaxExpiryBuffer(), blockTimestamp);
    }

    const transactionId = params.transactionId ?? getRandomBytes32();
    const callTo = params.callTo ?? constants.AddressZero;
    const callData = params.callData ?? "0x";

    let encryptedCallData = "0x";
    const callDataHash = utils.keccak256(callData);
    if (callData !== "0x") {
      let encryptionPublicKey;

      try {
        encryptionPublicKey = await ethereum.request({
          method: "eth_getEncryptionPublicKey",
          params: [user], // you must have access to the specified account
        });
      } catch (error) {
        let encryptionError = "Error getting public key";
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          encryptionError = "User rejected public key request";
        }
        throw new EncryptionError(encryptionError, jsonifyError(error));
      }

      try {
        encryptedCallData = await encrypt(callData, encryptionPublicKey);
      } catch (e) {
        throw new EncryptionError("public key encryption failed", jsonifyError(e));
      }
    }

    if (!this.messaging.isConnected()) {
      await this.connectMessaging();
    }

    const inbox = generateMessagingInbox();

    const auctionBidsPromise = new Promise<AuctionResponse[]>(async (resolve, reject) => {
      if (dryRun) {
        try {
          const result = await this.auctionResponseEvt
            .pipe((data) => data.inbox === inbox)
            .pipe((data) => !!data.data)
            .pipe((data) => !data.err)
            .waitFor(AUCTION_TIMEOUT);
          return resolve([result.data!]);
        } catch (e) {
          return reject(e);
        }
      }

      if (preferredRouter) {
        this.logger.warn({ method, methodId, preferredRouter }, "Waiting for preferred router");
        try {
          const result = await this.auctionResponseEvt
            .pipe((data) => data.inbox === inbox)
            .pipe((data) => !!data.data)
            .pipe((data) => !data.err)
            .pipe((data) => data.data?.bid.router === preferredRouter)
            .waitFor(AUCTION_TIMEOUT * 2); // wait extra for preferred router
          return resolve([result.data!]);
        } catch (e) {
          return reject(e);
        }
      }

      const auctionCtx = Evt.newCtx();
      const bids: AuctionResponse[] = [];
      this.auctionResponseEvt
        .pipe(auctionCtx)
        .pipe((data) => data.inbox === inbox)
        .pipe((data) => !!data.data)
        .pipe((data) => {
          if (data.err) {
            this.logger.warn({ inbox, err: data.err }, "Invalid bid received");
            return false;
          }
          return true;
        })
        .attach((data) => {
          bids.push(data.data!);
        });

      setTimeout(async () => {
        this.auctionResponseEvt.detach(auctionCtx);
        return resolve(bids);
      }, AUCTION_TIMEOUT);
    });

    const payload = {
      user,
      sendingChainId,
      sendingAssetId,
      amount,
      receivingChainId,
      receivingAssetId,
      receivingAddress,
      callTo,
      callDataHash,
      encryptedCallData,
      expiry,
      transactionId,
      dryRun: !!dryRun,
    };
    await this.messaging.publishAuctionRequest(payload, inbox);

    this.logger.info({ method, methodId, inbox }, `Waiting up to ${AUCTION_TIMEOUT} ms for responses`);
    try {
      const auctionResponses = await auctionBidsPromise;
      this.logger.info({ method, methodId, auctionResponses, transactionId, inbox }, "Auction closed");
      if (auctionResponses.length === 0) {
        throw new NoBids(AUCTION_TIMEOUT, transactionId, payload);
      }
      const filtered: (AuctionResponse | string)[] = await Promise.all(
        auctionResponses.map(async (data: AuctionResponse) => {
          // validate bid
          // check router sig on bid
          const signer = recoverAuctionBid(data.bid, data.bidSignature ?? "");
          if (signer !== data.bid.router) {
            const msg = "Invalid router signature on bid";
            this.logger.error({ method, methodId, signer, router: data.bid.router }, msg);
            return msg;
          }

          // check contract for router liquidity
          try {
            const routerLiq = await this.transactionManager.getRouterLiquidity(
              receivingChainId,
              data.bid.router,
              receivingAssetId,
            );
            if (routerLiq.lt(data.bid.amountReceived)) {
              const msg = "Router's liquidity low";
              this.logger.error(
                { method, methodId, signer, receivingChainId, receivingAssetId, router: data.bid.router },
                msg,
              );
              return msg;
            }
          } catch (err) {
            const msg = "Error getting router liquidity";
            this.logger.error({ method, methodId, sendingChainId, receivingChainId, err: jsonifyError(err) }, msg);
            return msg;
          }

          // check if the price changes unfovorably by more than the slippage tolerance(percentage).
          const lowerBoundExchangeRate = (1 - parseFloat(slippageTolerance) / 100).toString();

          const { provider: sendingProvider } = this.chainConfig[sendingChainId] ?? {};
          const { provider: receivingProvider } = this.chainConfig[receivingChainId] ?? {};

          if (!sendingProvider || !receivingProvider) {
            const msg = "Provider not found";
            this.logger.error(
              { method, methodId, supported: Object.keys(this.chainConfig), sendingChainId, receivingChainId },
              msg,
            );
            return msg;
          }

          const [inputDecimals, outputDecimals] = await Promise.all([
            getDecimals(sendingAssetId, sendingProvider),
            getDecimals(receivingAssetId, receivingProvider),
          ]);

          const lowerBound = calculateExchangeWad(
            BigNumber.from(amount),
            inputDecimals,
            lowerBoundExchangeRate,
            outputDecimals,
          );

          // safe calculation if the amountReceived is greater than 4 decimals
          if (BigNumber.from(data.bid.amountReceived).lt(lowerBound)) {
            const msg = "Invalid bid price: price impact is more than the slippage tolerance";
            this.logger.error(
              {
                method,
                methodId,
                signer,
                lowerBound: lowerBound,
                bidAmount: data.bid.amount,
                amountReceived: data.bid.amountReceived,
                slippageTolerance: slippageTolerance,
                router: data.bid.router,
              },
              msg,
            );
            return msg;
          }

          return data;
        }),
      );

      const valid = filtered.filter((x) => typeof x !== "string") as AuctionResponse[];
      const invalid = filtered.filter((x) => typeof x === "string") as string[];
      if (valid.length === 0) {
        throw new NoValidBids(transactionId, payload, invalid.join(","), auctionResponses);
      }
      const chosen = valid.sort((a: AuctionResponse, b) => {
        return BigNumber.from(b.bid.amountReceived).gt(a.bid.amountReceived) ? -1 : 1; // TODO: #142 check this logic
      })[0];
      return chosen;
    } catch (e) {
      this.logger.error({ method, methodId, err: jsonifyError(e), transactionId }, "Auction error");
      throw new UnknownAuctionError(transactionId, jsonifyError(e), payload);
    }
  }

  /**
   * Begins a crosschain transfer by calling `prepare` on the sending chain.
   *
   * @param transferParams - The auction result (winning bid and associated signature)
   * @param transferParams.bid - The winning action bid (includes all data needed to call prepare)
   * @param transferParams.bidSignature - The signature of the router on the winning bid
   * @param infiniteApprove - (optional) If true, will approve the TransactionManager on `transferParams.sendingChainId` for the max value. If false, will approve for only transferParams.amount. Defaults to false
   * @returns A promise with the transactionId and the `TransactionResponse` returned when the prepare transaction was submitted, not mined.
   */
  public async prepareTransfer(
    transferParams: AuctionResponse,
    infiniteApprove = false,
  ): Promise<{ prepareResponse: providers.TransactionResponse; transactionId: string }> {
    const method = "transfer";
    const methodId = getRandomBytes32();
    this.logger.info({ method, methodId, transferParams }, "Method started");

    const { bid, bidSignature } = transferParams;

    // Validate params schema
    const validate = ajv.compile(AuctionBidParamsSchema);
    const valid = validate(bid);
    if (!valid) {
      const error = (validate.errors ?? []).map((err) => `${err.instancePath} - ${err.message}`).join(",");
      this.logger.error({ method, methodId, error: validate.errors, transferParams }, "Invalid transfer params");
      throw new InvalidParamStructure("prepareTransfer", "AuctionResponse", error, transferParams, {
        transactionId: transferParams.bid.transactionId,
      });
    }

    const {
      user,
      router,
      sendingAssetId,
      receivingAssetId,
      receivingAddress,
      amount,
      expiry,
      callDataHash,
      encryptedCallData,
      sendingChainId,
      receivingChainId,
      callTo,
      transactionId,
    } = bid;
    const encodedBid = encodeAuctionBid(bid);

    if (!this.chainConfig[sendingChainId]) {
      throw new ChainNotConfigured(sendingChainId, Object.keys(this.chainConfig));
    }

    if (!this.chainConfig[receivingChainId]) {
      throw new ChainNotConfigured(receivingChainId, Object.keys(this.chainConfig));
    }

    const signerAddr = await this.signer.getAddress();
    const balance = await getOnchainBalance(sendingAssetId, signerAddr, this.chainConfig[sendingChainId].provider);
    if (balance.lt(amount)) {
      throw new InvalidAmount(transactionId, signerAddr, balance.toString(), amount, sendingChainId, sendingAssetId);
    }

    if (!bidSignature) {
      throw new InvalidBidSignature(transactionId, bid, router);
    }

    const recovered = recoverAuctionBid(bid, bidSignature);
    if (recovered.toLowerCase() !== router.toLowerCase()) {
      throw new InvalidBidSignature(transactionId, bid, router, recovered, bidSignature);
    }

    this.logger.info(
      {
        method,
        methodId,
        amount,
        expiry,
        encodedBid,
        bidSignature,
      },
      "Preparing tx!",
    );

    if (sendingAssetId !== constants.AddressZero) {
      const approveTx = await this.transactionManager.approveTokensIfNeeded(
        sendingChainId,
        sendingAssetId,
        amount,
        infiniteApprove,
      );

      if (approveTx) {
        this.evts.SenderTokenApprovalSubmitted.post({
          assetId: sendingAssetId,
          chainId: sendingChainId,
          transactionResponse: approveTx,
        });

        const approveReceipt = await approveTx.wait(1);
        if (approveReceipt?.status === 0) {
          throw new SubmitError(
            transactionId,
            sendingChainId,
            signerAddr,
            "approve",
            sendingAssetId,
            { infiniteApprove, amount },
            jsonifyError(new Error("Receipt status is 0")),
            {
              approveReceipt,
            },
          );
        }
        this.logger.info(
          { method, methodId, transactionId, transactionHash: approveReceipt.transactionHash },
          "Mined approve tx",
        );
        this.evts.SenderTokenApprovalMined.post({
          assetId: sendingAssetId,
          chainId: sendingChainId,
          transactionReceipt: approveReceipt,
        });
      }
    }

    // Prepare sender side tx
    const txData: InvariantTransactionData = {
      receivingChainTxManagerAddress: this.transactionManager.getTransactionManagerAddress(receivingChainId),
      user,
      router,
      sendingAssetId,
      receivingAssetId,
      sendingChainFallback: user,
      callTo,
      receivingAddress,
      sendingChainId,
      receivingChainId,
      callDataHash,
      transactionId,
    };
    const params: PrepareParams = {
      txData,
      encryptedCallData,
      bidSignature,
      encodedBid,
      amount,
      expiry,
    };
    const prepareResponse = await this.transactionManager.prepare(sendingChainId, params);
    this.evts.SenderTransactionPrepareSubmitted.post({
      prepareParams: params,
      transactionResponse: prepareResponse,
    });
    return { prepareResponse, transactionId };
  }

  /**
   * Fulfills the transaction on the receiving chain.
   *
   * @param params - The `TransactionPrepared` event payload from the receiving chain
   * @param relayerFee - (optional) The fee paid to relayers. Comes out of the transaction amount the router prepared with. Defaults to 0
   * @param useRelayers - (optional) If true, will use a realyer to submit the fulfill transaction
   * @returns An object containing either the TransactionResponse from self-submitting the fulfill transaction, or the Meta-tx response (if you used meta transactions)
   */
  public async fulfillTransfer(
    params: Omit<TransactionPreparedEvent, "caller">,
    relayerFee = "0",
    useRelayers = true,
  ): Promise<{ fulfillResponse?: providers.TransactionResponse; metaTxResponse?: MetaTxResponse }> {
    const method = "finishTransfer";
    const methodId = getRandomBytes32();
    this.logger.info({ method, methodId, params, useRelayers }, "Method started");

    // Validate params schema
    const validate = ajv.compile(TransactionPrepareEventSchema);
    const valid = validate(params);
    if (!valid) {
      const error = (validate.errors ?? []).map((err) => `${err.instancePath} - ${err.message}`).join(",");
      this.logger.error({ method, methodId, error: validate.errors, params }, "Invalid Params");
      throw new InvalidParamStructure("fulfillTransfer", "TransactionPrepareEventParams", error, params, {
        transactionId: params.txData.transactionId,
      });
    }

    const { txData, encryptedCallData } = params;

    const signerAddress = await this.signer.getAddress();

    if (!this.chainConfig[txData.sendingChainId]) {
      throw new ChainNotConfigured(txData.sendingChainId, Object.keys(this.chainConfig));
    }

    if (!this.chainConfig[txData.receivingChainId]) {
      throw new ChainNotConfigured(txData.receivingChainId, Object.keys(this.chainConfig));
    }

    this.logger.info({ method, methodId, transactionId: params.txData.transactionId }, "Generating fulfill signature");
    const signature = await signFulfillTransactionPayload(
      txData.transactionId,
      relayerFee,
      txData.receivingChainId,
      txData.receivingChainTxManagerAddress,
      this.signer,
    );

    this.logger.info({ method, methodId, signature }, "Generated signature");
    this.evts.ReceiverPrepareSigned.post({ signature, transactionId: txData.transactionId, signer: signerAddress });
    this.logger.info({ method, methodId, transactionId: txData.transactionId, relayerFee }, "Preparing fulfill tx");
    let callData = "0x";
    if (txData.callDataHash !== utils.keccak256(callData)) {
      callData = await ethereum.request({
        method: "eth_decrypt",
        params: [encryptedCallData, txData.user],
      });
    }

    if (useRelayers) {
      this.logger.info({ method, methodId }, "Fulfilling using relayers");
      if (!this.messaging.isConnected()) {
        await this.connectMessaging();
      }

      // send through messaging to metatx relayers
      const responseInbox = generateMessagingInbox();

      const metaTxProm = this.metaTxResponseEvt
        .pipe((data) => data.inbox === responseInbox)
        .pipe((data) => !!data.data?.transactionHash)
        .pipe((data) => !data.err)
        .waitFor(META_TX_TIMEOUT);

      const request = {
        type: MetaTxTypes.Fulfill,
        relayerFee,
        to: this.transactionManager.getTransactionManagerAddress(txData.receivingChainId),
        chainId: txData.receivingChainId,
        data: {
          relayerFee,
          signature,
          txData,
          callData,
        },
      };
      await this.messaging.publishMetaTxRequest(request, responseInbox);

      try {
        const response = await metaTxProm;
        const metaTxRes = response.data;
        this.logger.info({ method, methodId }, "Method complete");
        return { metaTxResponse: metaTxRes };
      } catch (e) {
        throw e.message.includes("Evt timeout") ? new MetaTxTimeout(txData.transactionId, META_TX_TIMEOUT, request) : e;
      }
    } else {
      this.logger.info({ method, methodId }, "Fulfilling with user's signer");
      const fulfillResponse = await this.transactionManager.fulfill(txData.receivingChainId, {
        callData,
        relayerFee,
        signature,
        txData,
      });

      this.logger.info({ method, methodId }, "Method complete");
      return { fulfillResponse };
    }
  }

  /**
   * Cancels the given transaction
   *
   * @param cancelParams - Arguments to submit to chain
   * @param cancelParams.txData - TransactionData (invariant + variant) to be cancelled
   * @param cancelParams.relayerFee - Fee to be paid for relaying transaction (only respected on sending chain cancellations post-expiry by the user)
   * @param cancelParams.signature - User signature for relayer to use
   * @param chainId - Chain to cancel the transaction on
   * @returns A TransactionResponse when the transaction was submitted, not mined
   */

  public async cancel(cancelParams: CancelParams, chainId: number): Promise<providers.TransactionResponse> {
    const method = this.cancel.name;
    const methodId = getRandomBytes32();
    this.logger.info({ method, methodId, chainId, cancelParams }, "Method started");

    // Validate params schema
    const validate = ajv.compile(CancelSchema);
    const valid = validate(cancelParams);
    if (!valid) {
      const error = (validate.errors ?? []).map((err) => `${err.instancePath} - ${err.message}`).join(",");
      this.logger.error({ method, methodId, error: validate.errors, cancelParams }, "Invalid Params");
      throw new InvalidParamStructure("cancel", "CancelParams", error, cancelParams, {
        transactionId: cancelParams.txData.transactionId,
      });
    }

    const cancelResponse = await this.transactionManager.cancel(chainId, cancelParams);
    this.logger.info({ method, methodId }, "Method complete");
    return cancelResponse;
  }

  /**
   * Changes the signer associated with the sdk
   *
   * @param signer - Signer to change to
   */
  public changeInjectedSigner(signer: Signer) {
    this.signer = signer;
  }

  /**
   * Turns off all listeners and disconnects messaging from the sdk
   */
  public removeAllListeners(): void {
    this.metaTxResponseEvt.detach();
    this.auctionResponseEvt.detach();
    this.messaging.disconnect();
    this.subgraph.stopPolling();
  }

  // Listener methods
  /**
   * Attaches a callback to the emitted event
   *
   * @param event - The event name to attach a handler for
   * @param callback - The callback to invoke on event emission
   * @param filter - (optional) A filter where callbacks are only invoked if the filter returns true
   * @param timeout - (optional) A timeout to detach the handler within. I.e. if no events fired within the timeout, then the handler is detached
   */
  public attach<T extends NxtpSdkEvent>(
    event: T,
    callback: (data: NxtpSdkEventPayloads[T]) => void,
    filter: (data: NxtpSdkEventPayloads[T]) => boolean = (_data: NxtpSdkEventPayloads[T]) => true,
    timeout?: number,
  ): void {
    const args = [timeout, callback].filter((x) => !!x);
    if (Object.keys(SubgraphEvents).includes(event)) {
      this.subgraph.attach(event as SubgraphEvent, callback as any, filter as any);
    } else {
      this.evts[event].pipe(filter).attach(...(args as [number, any]));
    }
  }

  /**
   * Attaches a callback to the emitted event that will be executed one time and then detached.
   *
   * @param event - The event name to attach a handler for
   * @param callback - The callback to invoke on event emission
   * @param filter - (optional) A filter where callbacks are only invoked if the filter returns true
   * @param timeout - (optional) A timeout to detach the handler within. I.e. if no events fired within the timeout, then the handler is detached
   *
   */
  public attachOnce<T extends NxtpSdkEvent>(
    event: T,
    callback: (data: NxtpSdkEventPayloads[T]) => void,
    filter: (data: NxtpSdkEventPayloads[T]) => boolean = (_data: NxtpSdkEventPayloads[T]) => true,
    timeout?: number,
  ): void {
    const args = [timeout, callback].filter((x) => !!x);
    if (Object.keys(SubgraphEvents).includes(event)) {
      this.subgraph.attachOnce(event as SubgraphEvent, callback as any, filter as any, timeout);
    } else {
      this.evts[event].pipe(filter).attachOnce(...(args as [number, any]));
    }
  }

  /**
   * Removes all attached handlers from the given event.
   *
   * @param event - (optional) The event name to remove handlers from. If not provided, will detach handlers from *all* subgraph events
   */
  public detach<T extends NxtpSdkEvent>(event?: T): void {
    if (event) {
      if (Object.keys(SubgraphEvents).includes(event)) {
        this.subgraph.detach(event as SubgraphEvent);
      } else {
        this.evts[event].detach();
      }
      this.evts[event].detach();
    } else {
      Object.values(this.evts).forEach((evt) => evt.detach());
      this.subgraph.detach();
    }
  }

  /**
   * Returns a promise that resolves when the event matching the filter is emitted
   *
   * @param event - The event name to wait for
   * @param timeout - The ms to continue waiting before rejecting
   * @param filter - (optional) A filter where the promise is only resolved if the filter returns true
   *
   * @returns Promise that will resolve with the event payload once the event is emitted, or rejects if the timeout is reached.
   *
   */
  public waitFor<T extends NxtpSdkEvent>(
    event: T,
    timeout: number,
    filter: (data: NxtpSdkEventPayloads[T]) => boolean = (_data: NxtpSdkEventPayloads[T]) => true,
  ): Promise<NxtpSdkEventPayloads[T]> {
    if (Object.keys(SubgraphEvents).includes(event)) {
      return this.subgraph.waitFor(event as SubgraphEvent, timeout, filter as any) as Promise<NxtpSdkEventPayloads[T]>;
    } else {
      return this.evts[event].pipe(filter).waitFor(timeout);
    }
  }
}
