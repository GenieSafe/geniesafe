require("@matterlabs/hardhat-zksync-solc");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  paths: {
    artifacts: "./artifacts-zk",
    cache: "./cache-zk",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    version: "0.8.7",
    defaultNetwork: "sepolia",
    networks: {
      hardhat: {},
      sepolia: {
        // url: "https://rpc.ankr.com/eth_sepolia",
        url: "https://sepolia.rpc.thirdweb.com",
        accounts: ["0x19882AfC7913B21E2E414F8219eA3bdF3202aB99"],
      },
    },
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
