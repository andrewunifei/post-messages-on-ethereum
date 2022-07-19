const main = async () => {
    const [owner, randomPerson] = await hre.ethers.getSigners();
    const waveContractFactory = await hre.ethers.getContractFactory("WavePortal"); // Compilação
    const waveContract = await waveContractFactory.deploy(); // iImplementa em uma blockchain local
    await waveContract.deployed(); // Checa se está disponível na blockchain
    console.log("Contract deployed to: ", waveContract.address);
    console.log("Contract deployed by: ", owner.address)

    let waveCount;
    waveCount = await waveContract.getTotalWaves();

    let waveTxn = await waveContract.wave();

    // Espera a "mineração" da função. Em outras palavras, a confimação de bloco
    // como uma variável de estado é alterada, é necessário esperar a confirmação de bloco
    await waveTxn.wait();

    // Aqui não é necessário esperar porque estamos apenas consultando a blockchain
    waveCount = await waveContract.getTotalWaves();

    waveTxn = await waveContract.connect(randomPerson).wave();
    await waveTxn.wait();

    waveCount = await waveContract.getTotalWaves();
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