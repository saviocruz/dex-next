import { ETHER_ADDRESS } from '../../pages/lib/helpers';
import { loadToken, loadExchange } from '../../pages/lib/loadContrats';
import Web3 from 'web3';

import { ETHUnit } from '../../pages/lib/helpers';
import ERC20 from '../../abis/ERC20.json'
import { IEvents, IMsg, IProp, IPropBalance, msgInicial } from '../../pages/lib/type';
import { IMensagem } from '../../pages/Mensagem';
import { gerarMensagem } from './orders';


//// LOADING STACKS

export const loadStackData = async (stacking: any,  account: string) => {
    const len = await stacking.methods.poolLength().call()
    console.log(len)
    let data = []
    let i = 0
    for (i = 0; i < len; i++) {
      data[i] = await stacking.methods.poolInfo(i).call()
      data[i]['supply'] = await stacking.methods.getERCBalance(data[i].tokenStack, stacking.options.address).call()
      data[i]['name'] = await stacking.methods.getERCname(data[i].tokenStack).call()
      data[i]['symbol'] = await stacking.methods.getERCsymbol(data[i].tokenStack).call()
      data[i]['stacked'] = await stacking.methods.stackingBalanceOf(i, account).call()
      data[i]['pending'] = await stacking.methods.pendingIDT(i).call({ from: account })
    }
   // dispatch(stacks(data))
    return data
  }
  
  ///// STACKING
  
  export const stackToken = async (stacking: any, token: any, account: any, amount: any, id: any, web3: any) => {
    console.log('START')
    const tokenx = new web3.eth.Contract(ERC20.abi, token)
    amount = web3.utils.toWei(amount, 'ether')
    await tokenx.methods.approve(stacking.options.address, amount).send({ from: account })
      .on('transactionHash', async (hash: any) => {
        console.log('IS APPROVED')
      }).then(async () => {
        await stacking.methods.deposit(amount, id).send({ from: account })
          .on('transactionHash', async (hash: any) => {
            console.log('DEPOSITED')
          }).then(async () => {
            await loadStackData(stacking, account)
          })
  
      })
  
  }
  
  export const unStackToken = async (stacking: any, account: any, amount: any, id: any, web3: any) => {
    amount = web3.utils.toWei(amount, 'ether')
    await stacking.methods.withdraw(amount, id).send({ from: account })
      .on('transactionHash', async (hash: any) => {
        console.log('WITHDRAWED')
      }).then(async () => {
        await loadStackData(stacking, account)
      })
  }
  