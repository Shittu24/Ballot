const { assert, expect } = require("chai")
const { network, deployments, ethers } = require("hardhat")

describe("Ballot", function () {
    let ballot, deployer
    beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])
        await deployments.fixture(["all"])
        ballot = await ethers.getContract("Ballot")
    })

    describe("constructor", function () {
        it("sets the owner of the contract correctly", async () => {
            const response = await ballot.getOwner()
            assert.equal(response, deployer)
        })

        // it("sets owner's vote weight to one", async function () {
        //     const vote = await ballot.Voter.weight.toString()
        //     const res = await 
        //     assert.equal(ballot.s_voters[deployer], "1")
        // })

        it("only owner can give right to vote", async function () {
            await expect(ballot.giveRightToVote(deployer)).to.be.reverted
        })

        it("allows eligible voters vote", async function () {
            const tx = await ballot.giveRightToVote(deployer)
            const txReceipt = await tx.wait(1)
            const voted = await ballot.vote(deployer)
            const votedRx = await voted.wait(1)
            const voterWeight = await ballot.s_voters[deployer].weight 
            assert.equal(voterWeight.toString(), "1")
        })
    })

})