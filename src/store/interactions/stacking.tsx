import { ETHER_ADDRESS } from '../../pages/lib/helpers';
import { loadToken, loadExchange } from '../../pages/lib/loadContrats';
import Web3 from 'web3';

import { ETHUnit } from '../../pages/lib/helpers';
import ERC20 from '../../abis/ERC20.json'
import { IEvents, IMsg, IProp, IPropBalance, msgInicial } from '../../pages/lib/type';
import { IMensagem } from '../../pages/Mensagem';
import { gerarMensagem } from './orders';


//// LOADING STACKS

export const loadStackData = async (web3: any, stacking: any, account: string) => {
  const len = await stacking.methods.poolLength().call()
  const total: any = await stacking.methods.idt().call()
  const tokenx = new web3.eth.Contract(ERC20.abi, total)
  const last = await tokenx.methods.balanceOf(account).call()
  const last1 = await tokenx.methods.balanceOf(stacking.options.address).call()

  //  const lpsupply = await stacking.methods.getLPSupply(0).call()
  //console.log(len)
  console.log(total)
  console.log(last)
  console.log(last1)



  let data = []
  let i = 0
  for (i = 0; i < len; i++) {
    data[i] = await stacking.methods.poolInfo(i).call()
    data[i]['supply'] = await stacking.methods.getERCBalance(data[i].tokenStack, stacking.options.address).call()
    data[i]['name'] = await stacking.methods.getERCname(data[i].tokenStack).call()
    data[i]['symbol'] = await stacking.methods.getERCsymbol(data[i].tokenStack).call()
    data[i]['stacked'] = await stacking.methods.stackingBalanceOf(i, account).call()
    data[i]['pending'] = await stacking.methods.pendingIDT(i).call({ from: account })
    data[i]['saldo'] = await stacking.methods.getERCBalance(tokenx.options.address, account).call()
    data[i]['saldoStaking'] = await stacking.methods.getERCBalance(tokenx.options.address, stacking.options.address).call()
  }

  // dispatch(stacks(data))
  return data
}

///// STACKING

export const stackToken = async (stacking: any, token: any, account: any, amount: any, id: any, web3: any, events: any) => {
  console.log('START')
  console.log(amount)
  const tokenx = new web3.eth.Contract(ERC20.abi, token)
  amount = web3.utils.toWei(amount.toString(), 'ether')
  await tokenx.methods.approve(stacking.options.address, amount).send({ from: account })
    .on('transactionHash', async (hash: any) => {
      console.log('IS APPROVED')
    }).then(async () => {
      await stacking.methods.deposit(amount, id).send({ from: account })
        .on('transactionHash', async (hash: any) => {
          console.log('DEPOSITED')
        }).then(async () => {
          await loadStackData(web3, stacking, account)
        })

    })

}

export const getResult = async (stacking: any, account: any, id: any, web3: any) => {
  console.log('START')
  let ret1 = await stacking.methods.pendingIDT(id).call({ from: account })
  let ret2 = await stacking.methods.getMultiplierView(id).call({ from: account })
  let ret = await stacking.methods.getIdtReward(id).call()
  console.log(ret, ret1, ret2)


}

export const unStackToken = async (stacking: any, account: any, amount: any, id: any, web3: any) => {
  amount = web3.utils.toWei(amount, 'ether')
  await stacking.methods.withdraw(amount, id).send({ from: account })
    .on('transactionHash', async (hash: any) => {
      console.log('WITHDRAWED')
    }).then(async () => {
      // await loadStackData(stacking, account)
    })
}
