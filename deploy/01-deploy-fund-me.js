// function deployFunction(hre) {
//     console.log("Hardhat deploy ethers")
// hre.getNamedAccounts()
// hre.deployments

// }

// // const { getNamedAccounts, deployments } = require("hardhat")

// module.exports.default = deployFunction

// // module.exports = async (hre) => {
// //     const { getNamedAccounts, deployments } = hre
// // }
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { network } = require("hardhat")
const { verify } = require("../utils/verify")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    //Whenever we are going for localhost or hardhat network, we woukd like to make use of mock
    // const address = "0x694AA1769357215DE4FAC081bf1f309aDC325306"
    // const ethUsdPriceFeedAddress =
    //     networkconfig[chainId]["ethUsdPriceFeedAddress"]
    let ethUsdPriceFeedAddress
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress =
            networkConfig[chainId]["ethUsdPriceFeedAddress"]
    }
    const args = [ethUsdPriceFeedAddress]
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: args, //contract address from priceFeed
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) {
        await verify(fundMe.address, [ethUsdPriceFeedAddress])
    }
    log("-------------------------------------------------")
}

module.exports.tags = ["all", "fundme"]
