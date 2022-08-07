import MyERC20 from '../../abis/MyERC20.json'
import Pairs from '../../abis/Pairs.json';
import Exchange from '../../abis/Exchange.json'
import ERC20 from '../../abis/ERC20.json'
import IERC20 from '../../abis/IERC20.json'

import { AbiItem } from 'web3-utils';
import Web3 from 'web3';

export const loadToken  = async (web3: Web3) => {
  try {
    let networkId = Object.keys(MyERC20.networks)[0] as keyof typeof MyERC20.networks;
    const data = MyERC20.networks[networkId];
    if (data) {
      const tokenContract = new web3.eth.Contract(MyERC20.abi  as unknown as AbiItem, data.address);
   //  const name = await token.methods.symbol().call();
      console.log('token adrres: ',data.address)
      return [tokenContract, data.address];
    }
  }
  catch (err) {
    window.alert("Token not deployed to current network");
  }
  return null;
}

export const loadTokenAddress  = async (web3: Web3, address: string) => {
  try {
    let networkId = Object.keys(ERC20.networks)[0] as keyof typeof ERC20.networks;
    const data = ERC20.networks[networkId];
    console.log(data)
    if (data) {
      const tokenContract = new web3.eth.Contract(IERC20.abi  as unknown as AbiItem,  address);
      const tokenName = await tokenContract.methods.symbol().call();
      console.log('token adrres: ',address)
      return [tokenContract, address, tokenName];
    }
  }
  catch (err) {
    window.alert("Token not deployed to current network");
  }
  return null;
}

export const loadSaldo = async (account: string, _spender: string) => {
  const [tokenContract]: any = await loadToken(window.web3);
  let aprovado = await tokenContract.methods.aprovadoFrom(account, _spender).call()
  let tokenBalance = await tokenContract.methods.balanceOf(account).call()
  return [aprovado, tokenBalance]
}

export const loadPairs  = async (web3: Web3) => {
  try {
    let networkId = Object.keys(Pairs.networks)[0] as keyof typeof Pairs.networks;
    const data = Pairs.networks[networkId];
    if (data) {
      const pairsContract = new web3.eth.Contract(Pairs.abi  as unknown as AbiItem, data.address);
      console.log('pairs adrres: ',data.address)
      return [pairsContract, data.address];
    }
  }
  catch (err) {
    window.alert("Token not deployed to current network");
  }
  return null;
}

export const loadExchange = async (web3: Web3) => {
  try {
    let networkId = Object.keys(Exchange.networks)[0] as keyof typeof Exchange.networks;
    const data = Exchange.networks[networkId];
    if (data) {
      const exchangeContract: any = new web3.eth.Contract(Exchange.abi as unknown as AbiItem, data.address);
      console.log('exchange: ', data.address)
      return [exchangeContract, data.address];
    }
  }
  catch (err) {
    window.alert("Contrato Market não encontrado ");
  }
  return null;
}
