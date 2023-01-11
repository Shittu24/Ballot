const { network } = require("hardhat")
const { verify } = require("../utils/verify")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    const developmentChains = ["hardhat", "localhost"]
    const proposalNames = [
        "0x41646577616c6500000000000000000000000000000000000000000000000000",
        "0x4f706579656d6900000000000000000000000000000000000000000000000000",
        "0x204f6c6100000000000000000000000000000000000000000000000000000000"
    ]
    log("----------------------------------------------------")
    log("Deploying Ballot and waiting for confirmations...")
    const ballot = await deploy("Ballot", {
        from: deployer,
        args: [proposalNames],
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: network.config.blockConfirmations || 1,
    })
    log(`Ballot deployed at ${ballot.address}`)

    if (
        !developmentChains.includes(network.name) &&
        process.env.POLYGONSCAN_API_KEY
    ) {
        await verify(ballot.address, [proposalNames])
    }
}

module.exports.tags = ["all", "ballot"]