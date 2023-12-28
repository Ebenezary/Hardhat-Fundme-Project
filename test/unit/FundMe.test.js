const { deployments, ethers, getNamedAccounts, network } = require("hardhat")
const { expect, assert } = require("chai")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async function () {
          let fundMe
          let deployer
          let mockV3Aggregator
          let fundMeAddress
          let mockV3AggregatorAddress
          // const sendValue = ethers.utils.parseEther("1")
          const sendValue = ethers.parseEther("1")
          beforeEach(async function () {
              // const accounts = await ethers.getSigner()
              // const accountZero = account[0]
              deployer = await ethers.provider.getSigner()
              await deployments.fixture(["all"])
              fundMeAddress = (await deployments.get("FundMe")).address
              fundMe = await ethers.getContractAt(
                  "FundMe",
                  fundMeAddress,
                  deployer
              )
              mockV3AggregatorAddress = (
                  await deployments.get("MockV3Aggregator")
              ).address
              mockV3Aggregator = await ethers.getContractAt(
                  "MockV3Aggregator",
                  mockV3AggregatorAddress,
                  deployer
              )
          })

          describe("constructor", async function () {
              it("Setting the aggregator priceFeed address correctly", async function () {
                  const response = await fundMe.getPriceFeed()
                  assert.equal(response, await mockV3Aggregator.getAddress())
              })
          })
          describe("Fund", async function () {
              it("Fails if enough ETH is not being sent", async function () {
                  await expect(fundMe.fund()).to.be.revertedWith(
                      "Didn't send enough"
                  )
              })
              it("Verifies the amount of ETH sent", async function () {
                  await fundMe.fund({ value: sendValue })
                  const response = await fundMe.getAddressToAmountFunded(
                      deployer
                  )
                  assert.equal(response.toString(), sendValue.toString())
              })
              it("Adds funder to array of funders", async function () {
                  await fundMe.fund({ value: sendValue })
                  const funder = await fundMe.getFunders(0)
                  assert.equal(funder, deployer.address)
              })
          })
          describe("Withdraw", async function () {
              beforeEach(async function () {
                  await fundMe.fund({ value: sendValue })
              })
              it("can withdraw ETH from a single founder", async function () {
                  //Arrange
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMe.target)
                  const StartingDeployerBalance =
                      await ethers.provider.getBalance(deployer.address)
                  // console.log(StartingDeployerBalance)
                  //Act
                  const response = await fundMe.withdraw()
                  const tranReceipt = await response.wait(1)
                  const endingFundMeBalance = await ethers.provider.getBalance(
                      fundMe.target
                  )
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer.address)
                  // gasCost
                  const gasUsed = tranReceipt.gasUsed
                  const gasPrice = tranReceipt.gasPrice
                  const gasCost = gasUsed * gasPrice
                  // console.log(gasCost)
                  // Assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      (
                          startingFundMeBalance + StartingDeployerBalance
                      ).toString(),
                      (endingDeployerBalance + gasCost).toString()
                  )
                  // console.log(
                  //     (startingFundMeBalance + StartingDeployerBalance).toString()
                  // )
                  // console.log(endingDeployerBalance + gasCost)
                  // console.log(
                  //     (startingFundMeBalance + StartingDeployerBalance).toString(),
                  //     (endingDeployerBalance + gasCost).toString()
                  // )
              })
              it("Allows us to withdraw with multiple funders", async function () {
                  //Arrange
                  const accounts = await ethers.getSigners()
                  for (i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMe.target)
                  const StartingDeployerBalance =
                      await ethers.provider.getBalance(deployer.address)
                  //Act
                  const response = await fundMe.withdraw()
                  const tranReceipt = await response.wait(1)
                  const endingFundMeBalance = await ethers.provider.getBalance(
                      fundMe.target
                  )
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer.address)
                  // gasCost
                  const gasUsed = tranReceipt.gasUsed
                  const gasPrice = tranReceipt.gasPrice
                  const gasCost = gasUsed * gasPrice
                  //Assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      (
                          startingFundMeBalance + StartingDeployerBalance
                      ).toString(),
                      (endingDeployerBalance + gasCost).toString()
                  )
                  await expect(fundMe.getFunders(0)).to.be.reverted
                  for (i = 0; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })
              it("Only allows the contract deployer to withdraw", async function () {
                  const accounts = await ethers.getSigners()
                  const attacker = accounts[1]
                  const attackerConnectedContract = await fundMe.connect(
                      attacker
                  )
                  await expect(
                      attackerConnectedContract.withdraw()
                  ).to.be.revertedWithCustomError(fundMe, "FundMe__NotOwner")
              })
              it("Allows us to make a cheaper withdrawal with multiple funders", async function () {
                  //Arrange
                  const accounts = await ethers.getSigners()
                  for (i = 1; i < 6; i++) {
                      const fundMeConnectedContract = await fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMe.target)
                  const StartingDeployerBalance =
                      await ethers.provider.getBalance(deployer.address)
                  //Act
                  const response = await fundMe.cheaperWithdraw()
                  const tranReceipt = await response.wait(1)
                  const endingFundMeBalance = await ethers.provider.getBalance(
                      fundMe.target
                  )
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer.address)
                  // gasCost
                  const gasUsed = tranReceipt.gasUsed
                  const gasPrice = tranReceipt.gasPrice
                  const gasCost = gasUsed * gasPrice
                  //Assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      (
                          startingFundMeBalance + StartingDeployerBalance
                      ).toString(),
                      (endingDeployerBalance + gasCost).toString()
                  )
                  await expect(fundMe.getFunders(0)).to.be.reverted
                  for (i = 0; i < 6; i++) {
                      assert.equal(
                          await fundMe.getAddressToAmountFunded(
                              accounts[i].address
                          ),
                          0
                      )
                  }
              })
              it("can withdraw ETH from a single founder", async function () {
                  //Arrange
                  const startingFundMeBalance =
                      await ethers.provider.getBalance(fundMe.target)
                  const StartingDeployerBalance =
                      await ethers.provider.getBalance(deployer.address)
                  // console.log(StartingDeployerBalance)
                  //Act
                  const response = await fundMe.cheaperWithdraw()
                  const tranReceipt = await response.wait(1)
                  const endingFundMeBalance = await ethers.provider.getBalance(
                      fundMe.target
                  )
                  const endingDeployerBalance =
                      await ethers.provider.getBalance(deployer.address)
                  // gasCost
                  const gasUsed = tranReceipt.gasUsed
                  const gasPrice = tranReceipt.gasPrice
                  const gasCost = gasUsed * gasPrice
                  // console.log(gasCost)
                  // Assert
                  assert.equal(endingFundMeBalance, 0)
                  assert.equal(
                      (
                          startingFundMeBalance + StartingDeployerBalance
                      ).toString(),
                      (endingDeployerBalance + gasCost).toString()
                  )
              })
          })
      })
