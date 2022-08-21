import { ETHER_ADDRESS } from '../../pages/lib/helpers';
import { loadToken, loadExchange, loadStacking } from '../../pages/lib/loadContrats';
import Web3 from 'web3';

import { ETHUnit } from '../../pages/lib/helpers';
import ERC20 from '../../abis/ERC20.json'
import { IEvents, IMsg, IProp, IPropBalance, msgInicial } from '../../pages/lib/type';
import { IMensagem } from '../../pages/Mensagem';
import { gerarMensagem } from './orders';
import { INav } from '../../pages';
import { AbiItem } from 'web3-utils';


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
    data[i]['saldo'] = await stacking.methods.getERCBalance(data[i].tokenStack, account).call()
    data[i]['saldoid'] = await tokenx.methods.balanceOf(account).call()
    data[i]['saldoPool'] = await stacking.methods.getERCBalance(tokenx.options.address, stacking.options.address).call()
  }

  // dispatch(stacks(data))
  return data
}

///// STACKING

export const stackToken = async (dados: INav, token: any, amount: any, id: any, setStakes: any) => {
  const { web3, account, staking } = dados
  console.log('stackToken: ', amount)
  const tokenx = new web3.eth.Contract(ERC20.abi as unknown as AbiItem, token)
  amount = web3.utils.toWei(amount.toString(), 'ether')
  await tokenx.methods.approve(staking.options.address, amount).send({ from: account })
    .on('transactionHash', async (hash: any) => {
      console.log('IS APPROVED')
    }).then(async () => {
      await staking.methods.deposit(amount, id).send({ from: account })
        .on('transactionHash', async (hash: any) => {
          console.log('transactionHash stackToken', hash)
        }).then(async () => {
          loadStackData(web3, staking, account)
            .then((balance: any) => {
              setStakes(balance)
              console.log(balance)
            })
        })
    })
}


export const unStackToken = async (nav: INav, token: any, amount: any, id: any, setStakes: any) => {
  const { web3, account, staking } = nav
  console.log('unStackToken')
  console.log(amount)
  amount = web3.utils.toWei(amount, 'ether')
  await staking.methods.withdraw(amount, id).send({ from: account })
    .on('transactionHash', async (hash: any) => {
      console.log('WITHDRAWED')
    }).then(async () => {
      loadStackData(web3, staking, account)
        .then((balance: any) => {
          setStakes(balance)
          console.log(balance)
        })
    })
}


export const getResult = async (stacking: any, account: any, id: any, web3: any) => {
  console.log('START')
  let ret1 = await stacking.methods.pendingIDT(id).call({ from: account })
  let ret2 = await stacking.methods.getMultiplierView(id).call({ from: account })
  let ret3 = await stacking.methods.getWithdraw(id).call({ from: account })
  let ret4 = await stacking.methods.update(id).call({ from: account })
  let ret = await stacking.methods.getIdtReward(id).call()
  console.log(ret, ret1, ret2, ret3, ret4)


}