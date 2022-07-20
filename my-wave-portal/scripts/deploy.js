const main = async () => {
    const [deployer] = await hre.ethers.getSigners()
    const accountBalance = await deployer.getBalance()

    console.log("Deploying contract with account: ", deployer.address);
    console.log("Account balance: ", accountBalance.toString())

    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal") // Compilação
    const waveContract = await waveContractFactory.deploy() // Implementação na blockchain
    await waveContract.deployed() // Espera confirmação de bloco

    console.log("WavePortal address: ", waveContract.address);
};

const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
};

runMain();