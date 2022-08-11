import Web3 from 'web3';
import ERC20 from '../../abis/ERC20.json'
import { AbiItem } from 'web3-utils';
import { ETHUnit } from './helpers';

export const loadAvailableTokens = async (web3: Web3, pairs: any ) => {
  //  dispatch(availableTokensLoading());

  const numberOfTokens = await pairs.methods.size().call();
  //console.log(numberOfTokens)
  //dispatch(numberOfTokensLoaded(numberOfTokens));

  let tokenPairs = [];
  for (let i = 0; i < numberOfTokens; i++) {
    let tokenAddress = await pairs.methods.addresses(i).call();
    let token = new web3.eth.Contract(ERC20.abi   as unknown as AbiItem, tokenAddress);
   //  let [token]: any = await loadTokenAddress(web3, tokenAddress)
    let name = await token.methods.symbol().call();

    tokenPairs.push([tokenAddress, name]);
  }
  return tokenPairs;
}


export const getUserInfo = async (credencialContract: any, endereco: string) => {
  let autor = await credencialContract.methods.getUserInfoAddress(endereco).call()
  const ret = { nome: endereco, apelido: endereco, email: endereco }
  if (autor.nome == '')
    return ret;
  return autor;
}

export const loadUser = async (credencialContract: any, id: number) => {
  const ret = await credencialContract.methods.getUserInfo(id).call()
  console.log("Credencial", ret);
  return ret
}


export const loadListaCredencial = async (credencialContract: any) => {
  const data = await credencialContract.methods.getListaCredencial().call()
  console.log("Lista Credencial", data);
  return data;
}



export const loadSaldoSwap = async (account: string,
  web3: Web3,
  tokenContract: any,
  nftContract: any,
  contractSwap: any,
  addressContractSwap: string) => {

  let etherBalance = await web3.eth.getBalance(account);
  let tokenBalance = await tokenContract.methods.balanceOf(account).call();                          // SALDO carteira
  let tokenContractBalance = await tokenContract.methods.saldoContrato().call();                             // tokens restantes
  let aprovado = await tokenContract.methods.aprovadoFrom(account, addressContractSwap).call()
  let totalSupply = await tokenContract.methods.totalSupply().call()

  let balanceContract = await nftContract.methods.balanceContract().call()                           //saldo eth da exchange
  let nftBalance = await nftContract.methods.balanceOf(account).call();                              // SALDO NFT USER
  let nftBalanceNFT = await nftContract.methods.nextTokenId().call()

  let tokenNFTBalance = await nftContract.methods.balanceToken().call();                            // saldo token contrato nft
  let aprovadoNFT = await nftContract.methods.aprovado().call();

  let etherSwap = await contractSwap.methods.balanceContract().call()                           //saldo eth da exchange
  let tokenSwap = await contractSwap.methods.balanceToken().call()


  etherBalance = window.web3.utils.fromWei(etherBalance, ETHUnit)
  tokenBalance = window.web3.utils.fromWei(tokenBalance, ETHUnit)
  tokenContractBalance = window.web3.utils.fromWei(tokenContractBalance, ETHUnit)
  aprovado = window.web3.utils.fromWei(aprovado, ETHUnit)
  totalSupply = window.web3.utils.fromWei(totalSupply, ETHUnit)

  balanceContract = balanceContract
  nftBalance = nftBalance
  tokenNFTBalance = window.web3.utils.fromWei(tokenNFTBalance, ETHUnit)
  aprovadoNFT = window.web3.utils.fromWei(aprovadoNFT, ETHUnit)

  etherSwap = window.web3.utils.fromWei(etherSwap, ETHUnit)
  tokenSwap = window.web3.utils.fromWei(tokenSwap, ETHUnit)

  return [etherBalance, tokenBalance, tokenContractBalance, aprovado, totalSupply, balanceContract, nftBalance, nftBalanceNFT, tokenNFTBalance, aprovadoNFT, etherSwap, tokenSwap]
}

