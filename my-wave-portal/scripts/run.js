// Código apra testar localmente antes de implementar na testnet rinkeby

const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal"); // Compilação
    const waveContract = await waveContractFactory.deploy({
        // Implementa o contrato com fundo de 0.1, removido da carteira que implementou
        value: hre.ethers.utils.parseEther("0.1"), 
    }); // iImplementa em uma blockchain local
    await waveContract.deployed(); // Checa se está disponível na blockchain
    console.log("Contract deployed to: ", waveContract.address);
    console.log("Contract deployed by: ", owner.address);

    //console.log(owner)

    let contractBalance = await hre.ethers.provider.getBalance(waveContract.address);
    let ownerBalance = await hre.ethers.provider.getBalance(owner.address);

    console.log(
        "Balanço do contrato antes:",
        hre.ethers.utils.formatEther(contractBalance)
    );

    console.log(
        "Balanço do usuário antes:",
        hre.ethers.utils.formatEther(ownerBalance)
    );

    let waveTxn = await waveContract.wave("A message");
    await waveTxn.wait();

    contractBalance = await hre.ethers.provider.getBalance(waveContract.address);

    // Balanço depois da transação
    console.log(
        "Balanço do contrato depois:",
        hre.ethers.utils.formatEther(contractBalance)
    );

    let allWaves = await waveContract.getAllWaves();
    console.log(allWaves)

}

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error){
        console.log(error);
        process.exit(1);
    }
}

runMain();