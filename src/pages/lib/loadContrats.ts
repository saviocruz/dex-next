import MyERC20 from '../../abis/MyERC20.json'
import Pairs from '../../abis/Pairs.json';
import Exchange from '../../abis/Exchange.json'
import ERC20 from '../../abis/ERC20.json'
import Stacking from '../../abis/Stacking.json'
import StakerContract from '../../abis/Staker.json'

import { AbiItem } from 'web3-utils';
import Web3 from 'web3';

export const loadToken  = async (web3: Web3) => {
  try {
    let networkId = Object.keys(MyERC20.networks)[0] as keyof typeof MyERC20.networks;
    const data: any = MyERC20.networks[networkId];
    if (data) {
      const tokenContract = new web3.eth.Contract(MyERC20.abi  as unknown as AbiItem, data.address);
   //  const name = await token.methods.symbol().call();
      console.log('token adrres: ',data.address)
      return [tokenContract, data.address];
    }
  }
  catch (err) {
    window.alert("Token não publicado neste rede.");
  }
  return null;
}

export const loadTokenAddress  = async (web3: Web3, address: string) => {
  try {
      
      const tokenContract = new web3.eth.Contract(ERC20.abi  as unknown as AbiItem,  address);
      const tokenName = await tokenContract.methods.symbol().call();
      console.log('token adrres: ',address)
      return [tokenContract, address, tokenName];
   
  }
  catch (err) {
    window.alert("Token não publicado neste rede.");
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
    const data: any = Pairs.networks[networkId];
    
    if (data) {
      const pairsContract = new web3.eth.Contract(Pairs.abi  as unknown as AbiItem, data.address);
      console.log('pairs adrres: ',data.address)
      return [pairsContract, data.address];
    }
  }
  catch (err) {
    window.alert("Contrato de pares não publicado neste rede.");
  }
  return null;
}

export const loadExchange = async (web3: Web3) => {
  try {
    let networkId = Object.keys(Exchange.networks)[0] as keyof typeof Exchange.networks;
    const data: any = Exchange.networks[networkId];
    if (data) {
      const exchangeContract = new web3.eth.Contract(Exchange.abi as unknown as AbiItem, data.address);
      console.log('exchange: ', data.address)
      return [exchangeContract, data.address];
    }
  }
  catch (err) {
    window.alert("Contrato Exchange não encontrado ");
  }
  return null;
}


export const loadStacking = async (web3: Web3) => {
  try {
    let networkId = Object.keys(Stacking.networks)[0] as keyof typeof Stacking.networks;
    const data: any = Stacking.networks[networkId];
    if (data) {
      const stackingContract: any = new web3.eth.Contract(Stacking.abi as unknown as AbiItem, data.address);
      console.log('Stacking: ', data.address)
      return [stackingContract, data.address];
    }
  }
  catch (err) {
    window.alert("Contrato Market não encontrado ");
  }
  return null;
}


export const loadStakerContract  = async (web3: Web3) => {
  try {
    let networkId = Object.keys(StakerContract.networks)[0] as keyof typeof StakerContract.networks;
    const data: any = StakerContract.networks[networkId];
    if (data) {
      const tokenContract = new web3.eth.Contract(StakerContract.abi  as unknown as AbiItem, data.address);
   //  const name = await token.methods.symbol().call();
      console.log('StakerContract adrres: ',data.address)
      return [tokenContract, data.address];
    }
  }
  catch (err) {
    window.alert("Contrato não publicado neste rede.");
  }
  return null;
}