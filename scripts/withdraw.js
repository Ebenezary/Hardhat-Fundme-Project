const { getNamedAccounts } = require("hardhat")

async function main() {
    const sendValue = ethers.parseEther("0.3")
    const { deployer } = await getNamedAccounts()
    const fundMe = await ethers.getContractAt("FundMe", deployer)
    console.log("Funding contract...")
    const trxReceipt = await fundMe.fund({ value: sendValue })
    await trxReceipt.wait(1)
    console.log("Contract funded")
    const withdrawalReceipt = await fundMe.withdraw()
    await withdrawalReceipt.wait(1)
    console.log("All funds has been withdrawn")
}
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
