// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");
const {METADATA_URL, WHITELIST_CONTRACT_ADDRESS} =require("../../my-next-app/constants")
async function main() {

  const whitelistContract = WHITELIST_CONTRACT_ADDRESS;
  const metadataUrl = METADATA_URL;
  /* A contract factory in ether.js is a abstraction used to deploy new smart contracts 
 so WhiteListContract here is a factory for instances of our Whitelist Contract*/
  const cryptoDevsContract = await ethers.getContractFactory("CryptoDevs");
  const deployedCryptoDevsContract = await cryptoDevsContract.deploy(metadataUrl,whitelistContract);

  console.log(
    `deployed Crypto Devs at: ${deployedCryptoDevsContract.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
