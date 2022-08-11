import Web3 from 'web3';
 
const ethereum = Web3.givenProvider

declare global {
  interface Window { web3: Web3; ethereum: any }
}
export const  loadWeb3 =  ()  => {
    const web3 = new Web3(ethereum );
    window.web3 = web3
    if (!web3) {
      alert('Web3 nao carregou');
    }
   // console.log("WEB3: ", web3)
    return web3;
}

export const loadAccount = async ( web3: Web3) => {
    ethereum.enable()
    const accounts:  string[] = await web3.eth.getAccounts();
    return accounts;
}
