import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import obj from './utils/WavePortal.json'

export default function App() {
    // Para interagir com o contrato
    const contractAddress = "0xFb2822FdC63D8ca80096Cf9632AaE32fA6eDC5E1";
    const contractABI = obj.abi;

    const [currentAccount, setCurrentAccount] = useState("");
    const [allWaves, setAllWaves] = useState([])
    
    // Checa se o browser tem metamask
    const checkWallet = async () => {
        try {
            const { ethereum } = window

            if (!ethereum) {
                console.log('Browser não tem MetaMask')
            }
            else {
                console.log("Objeto Ethereum: ", ethereum)
            }

            // Checa se o usuário autorizou o acesso a carteira
            const accounts = await ethereum.request({ method: "eth_accounts" });

            if (accounts.length !== 0) {
                const account = accounts[0]
                console.log("Conectado na conta " + account)

                setCurrentAccount(account);
                getAllWaves();
            }
            else {
                console.log("Sem conta autorizada")
            }
        }
        catch (error) {
            console.log(error)
        }
    }

    const connectWallet = async () => {
        try {
            const { ethereum } = window

            if (!ethereum) {
                console.log("Sem MetaMask")

                return
            }

            const accounts = await ethereum.request({ method: "eth_requestAccounts" }) // método para requisitar acesso a conta metamask 

            console.log("Conectado na conta ", accounts[0])
            setCurrentAccount(accounts[0])
        }
        catch (error) {
            console.log(error)
        }
    }
    
    useEffect(() => {
        checkWallet();
    }, [currentAccount])

    const wave = async () => {
        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                //const provider = new ethers.providers.JsonRpcProvider('https://rinkeby.infura.io/v3/')
                const signer = provider.getSigner();
                const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

                let count = await wavePortalContract.getTotalWaves();
                console.log("Total de acenos... ", count.toNumber());

                const waveTxn = await wavePortalContract.wave("Olá! Mensagem temporária!!");
                console.log("Minerando... ", waveTxn.hash);

                waveTxn.wait();
                console.log("Minerado -- ", waveTxn.hash);

                count = await wavePortalContract.getTotalWaves();
            }
            else {
                console.log("Ethereum object doesn't exist!");
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const getAllWaves = async () => {
        try{
            const { ethereum } = window;

            if(ethereum){
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer)

                const waves = await wavePortalContract.getAllWaves();
                let holdWaves = []

                waves.forEach(wave => {
                    holdWaves.push({
                        address: wave.waver,
                        timestamp: new Date (wave.timestamp * 1000),
                        message: wave.message
                    })
                })

                console.log(waves)
                setAllWaves(holdWaves)
            }
            else{
                console.log("Sem objeto ethereum")
            }
        } catch(error){
            console.log(error)
        }
    }
            
    return (
        <div className="mainContainer">
            <div className="dataContainer">
                <div className="header">
                    👋 Olá!
                </div>
    
                <div className="bio">
                    Estou aprendendo sobre blockchain e smart contracts.
                </div>

                <textarea placeholder="Deixe uma mensagem!" rows="4" ></textarea>
        
                <button id="wave" className="waveButton" onClick={wave}>
                    Acenar
                </button>
        
                {/* só mostra o botão se não existir nenhuma conta conectada */}
                {!currentAccount &&
                    (
                      <button className="waveButton" id="conectar" onClick={connectWallet}>
                        Conectar MetaMask
                      </button>
                    )
                }

                {!currentAccount &&
                    (
                      <div className="bio">
                        Para ver as mensagens enviadas pelas pessoas, conecte-se com uma carteira!
                      </div>
                    )
                }

                 {allWaves.map((wave, index) => {
                    return (
                        <div key={index} 
                          style={{
                            backgroundColor: "lightblue",
                            marginTop: "1em",
                            marginBottom: "1em",
                            padding: "1em",
                            borderRadius: "0.4em"
                          }}
                        >
                            <p><span className="content">Endereço: </span>{wave.address}</p>
                            <p><span className="content">Data: </span>{wave.timestamp.toString()}</p>
                            <p><span className="content">Mensagem: </span>{wave.message}</p>
                        </div>)
                    })}
            </div>
        </div>
    );
}
