// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");

async function main() {
  /* A contract factory in ether.js is a abstraction used to deploy new smart contracts 
 so WhiteListContract here is a factory for instances of our Whitelist Contract*/
  const WhiteListContractFactory = await ethers.getContractFactory("Whitelist");
  const deployedWhitelistContract = await WhiteListContractFactory.deploy(10);
  await deployedWhitelistContract.deployed();
  console.log(
    `deployed whitelist Contract at: ${deployedWhitelistContract.address}`
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
