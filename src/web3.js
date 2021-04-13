import Web3 from 'web3';
const web3 = new Web3(Web3.givenProvider);

const loadWeb3 = async () => {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum)
        await window.ethereum.enable()
    }
    else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
        window.alert('non Ethereum browser detected. Download Metamask')
    }
};
export default web3;

loadWeb3();