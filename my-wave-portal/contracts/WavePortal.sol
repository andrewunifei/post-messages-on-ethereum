// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal{
    uint256 totalWaves;

    // Eventos são usados para servir dados para um consumidor (e.g. front-end)
    event NewWave(address indexed from, uint256 timestamp, string message);

    struct Wave{
        address waver;
        string message;
        uint256 timestamp;
    }

    Wave[] waves;

    constructor() payable {
        console.log("Oi mundo!");
    }

    function wave(string memory _message) public{
        totalWaves += 1;
        console.log ('%s acenou com a mensagem %s', msg.sender, _message);
        console.log("Balanco do usuario depois", msg.sender.balance);

        waves.push(Wave(
            msg.sender,
            _message,
            block.timestamp
        ));

        emit NewWave(msg.sender, block.timestamp, _message);

        uint256 prize = 0.0001 ether;

        require(prize <= address(this).balance, "Impossivel. Quantidade insuficiente.");

        (bool success,) = (msg.sender).call{value: prize}(""); // Envia o valor para o endereço

        require(success, "Erro na passagem do premio");
    }

    function getAllWaves() public view returns (Wave[] memory){
        return waves;
    }

    function getTotalWaves() public view returns (uint256){
        console.log('Temos um total de %d acenos', totalWaves);

        return totalWaves;
    }
}