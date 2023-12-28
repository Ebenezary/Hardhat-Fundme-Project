const { deployments, ethers, getNamedAccounts, network } = require("hardhat")
const { expect, assert } = require("chai")
const { developmentChains } = require("../../helper-hardhat-config")

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let fundMe
          let deployer
          let fundMeAddress
          const sendValue = ethers.parseEther("0.3")
          beforeEach(async function () {
              deployer = await ethers.provider.getSigner()
              fundMeAddress = (await deployments.get("FundMe")).address
              fundMe = await ethers.getContractAt(
                  "FundMe",
                  fundMeAddress,
                  deployer
              )
          })
          it("Allows deployer to withdraw", async function () {
              await fundMe.fund({ value: sendValue })
              await fundMe.withdraw()
              const endingBalance = await ethers.provider.getBalance(
                  fundMe.target
              )
              assert.equal(endingBalance, 0)
          })
      })
