import { NxtpSdk } from "@connext/nxtp-sdk";
import { constants, Contract, providers, utils, Wallet } from "ethers";
import pino from "pino";
import TransactionManagerArtifact from "@connext/nxtp-contracts/artifacts/contracts/TransactionManager.sol/TransactionManager.json";
import { TransactionManager } from "@connext/nxtp-contracts/typechain";
import { expect } from "@connext/nxtp-utils";

const TestTokenABI = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function allowance(address _owner, address _spender) public view returns (uint256 remaining)",

  // Authenticated Functions
  "function approve(address _spender, uint256 _value) public returns (bool success)",
  "function transfer(address to, uint amount) returns (boolean)",
  "function mint(address account, uint256 amount)",
];

const tokenAddress1337 = "0x345cA3e014Aaf5dcA488057592ee47305D9B3e10";
const tokenAddress1338 = tokenAddress1337;
const txManagerAddress1337 = "0xF12b5dd4EAD5F743C6BaA640B0216200e89B60Da";
const txManagerAddress1338 = txManagerAddress1337;
const chainProviders = {
  1337: new providers.JsonRpcProvider("http://localhost:8545"),
  1338: new providers.JsonRpcProvider("http://localhost:8546"),
};
const fundedPk = "0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3";
const router = "0xDc150c5Db2cD1d1d8e505F824aBd90aEF887caC6";

const sugarDaddy = new Wallet(fundedPk);
const MIN_ETH = utils.parseEther("0.5");
const ETH_GIFT = utils.parseEther("1");
const token1337 = new Contract(tokenAddress1337, TestTokenABI, sugarDaddy.connect(chainProviders[1337]));
const token1338 = new Contract(tokenAddress1338, TestTokenABI, sugarDaddy.connect(chainProviders[1338]));
const MIN_TOKEN = utils.parseEther("5");
const TOKEN_GIFT = utils.parseEther("10");
const txManager1337 = new Contract(
  txManagerAddress1337,
  TransactionManagerArtifact.abi,
  sugarDaddy.connect(chainProviders[1337]),
) as TransactionManager;
const txManager1338 = new Contract(
  txManagerAddress1338,
  TransactionManagerArtifact.abi,
  sugarDaddy.connect(chainProviders[1338]),
) as TransactionManager;

const logger = pino({ name: "IntegrationTest", level: process.env.LOG_LEVEL ?? "info" });

describe("Integration", () => {
  let userSdk: NxtpSdk;
  let userWallet: Wallet;

  before(async () => {
    const balance1337 = await chainProviders[1337].getBalance(router);
    const balance1338 = await chainProviders[1338].getBalance(router);

    // fund if necessary
    if (balance1337.lt(MIN_ETH)) {
      logger.info({ chainId: 1337 }, "Sending ETH_GIFT to router");
      const tx = await sugarDaddy.connect(chainProviders[1337]).sendTransaction({ to: router, value: ETH_GIFT });
      const receipt = await tx.wait();
      logger.info({ transactionHash: receipt.transactionHash, chainId: 1337 }, "ETH_GIFT to router mined");
    }

    if (balance1338.lt(MIN_ETH)) {
      logger.info({ chainId: 1338 }, "Sending ETH_GIFT to router");
      const tx = await sugarDaddy.connect(chainProviders[1338]).sendTransaction({ to: router, value: ETH_GIFT });
      const receipt = await tx.wait();
      logger.info({ transactionHash: receipt.transactionHash, chainId: 1338 }, "ETH_GIFT to router mined: ");
    }

    const liquidity1337 = await txManager1337.routerBalances(router, tokenAddress1337);
    const liquidity1338 = await txManager1338.routerBalances(router, tokenAddress1338);

    // fund if necessary
    if (liquidity1337.lt(MIN_TOKEN)) {
      logger.info({ chainId: 1337 }, "Adding liquidity");
      const approvetx = await token1337.approve(txManager1337.address, constants.MaxUint256);
      const approveReceipt = await approvetx.wait();
      logger.info({ transactionHash: approveReceipt.transactionHash, chainId: 1337 }, "addLiquidity approved");
      const tx = await txManager1337.addLiquidity(TOKEN_GIFT, tokenAddress1337, router);
      const receipt = await tx.wait();
      logger.info({ transactionHash: receipt.transactionHash, chainId: 1337 }, "addLiquidity mined");
    }

    if (liquidity1338.lt(MIN_TOKEN)) {
      logger.info({ chainId: 1338 }, "Adding liquidity");
      const approvetx = await token1338.approve(txManager1338.address, constants.MaxUint256);
      const approveReceipt = await approvetx.wait();
      logger.info({ transactionHash: approveReceipt.transactionHash, chainId: 1338 }, "addLiquidity approved");
      const tx = await txManager1338.addLiquidity(TOKEN_GIFT, tokenAddress1338, router);
      const receipt = await tx.wait();
      logger.info({ transactionHash: receipt.transactionHash, chainId: 1338 }, "addLiquidity mined");
    }
  });

  beforeEach(async () => {
    userWallet = Wallet.createRandom();

    // fund user sender side
    const balance1337 = await chainProviders[1337].getBalance(userWallet.address);
    if (balance1337.lt(MIN_ETH)) {
      logger.info({ chainId: 1337 }, "Sending ETH_GIFT to user");
      const tx = await sugarDaddy
        .connect(chainProviders[1337])
        .sendTransaction({ to: userWallet.address, value: ETH_GIFT });
      const receipt = await tx.wait();
      logger.info({ transactionHash: receipt.transactionHash, chainId: 1337 }, "ETH_GIFT to user mined: ");
    }

    const balanceToken1337 = await token1337.balanceOf(userWallet.address);
    if (balanceToken1337.lt(MIN_TOKEN)) {
      logger.info({ chainId: 1337 }, "Sending TOKEN_GIFT to user");
      const tx = await token1337.mint(userWallet.address, TOKEN_GIFT);
      const receipt = await tx.wait();
      logger.info({ transactionHash: receipt.transactionHash, chainId: 1337 }, "TOKEN_GIFT to user mined: ");
    }

    userSdk = await NxtpSdk.init(
      chainProviders,
      userWallet,
      pino({ name: "IntegrationTest" }),
      "nats://localhost:4222",
      "http://localhost:5040",
    );
  });

  it("should send tokens", async function () {
    this.timeout(120_000);
    const txs = await userSdk.getActiveTransactions();
    expect(txs.length).to.eq(0);
    const res = await userSdk.transfer({
      amount: utils.parseEther("1").toString(),
      expiry: (Math.floor(Date.now() / 1000) + 3600 * 24 * 3).toString(),
      sendingChainId: 1337,
      sendingAssetId: tokenAddress1337,
      receivingChainId: 1338,
      receivingAssetId: tokenAddress1338,
      receivingAddress: userWallet.address,
      router,
    });
    expect(res.prepareReceipt.status).to.be.eq(1);
  });
});