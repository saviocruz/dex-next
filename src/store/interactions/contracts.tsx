import { ETHER_ADDRESS } from '../../pages/lib/helpers';
import { loadToken, loadExchange } from '../../pages/lib/loadContrats';
import Web3 from 'web3';

import { ETHUnit } from '../../pages/lib/helpers';
import ERC20 from '../../abis/ERC20.json'
import { IEvents, IMsg, IProp, IPropBalance, msgInicial } from '../../pages/lib/type';
import { IMensagem } from '../../pages/Mensagem';
import { gerarMensagem } from './orders';

export const loadPairs = async (web3: Web3) => {
    try {
        const pairs: any = loadPairs(web3)
        return pairs;
    }
    catch (err) {
        window.alert("Pairs not deployed to the current network");
    }
    return null;
}

export const loadTokenName = async (web3: Web3) => {
    try {
        const token: any = loadToken(web3)
        const name = await token.methods.symbol().call();
        return name;
    }
    catch (err) {
        window.alert("Token not deployed to current network");
    }
    return null;
}

export const loadExchangeLoad = async (web3: Web3) => {
    try {
        const exchange: any = loadExchange(web3)
        //  dispatch(exchangeLoaded(exchange));
        console.log("Exchange", exchange)
        return exchange;
    }
    catch (err) {
        window.alert("Exchange not deployed to current network");
    }
    return null;
}

export const loadEtherBalances = async (web3: Web3, exchange: any, account: string) => {
    //ether balance
    // console.log(account)
    const etherBalance = await web3.eth.getBalance(account);
    //balance of account on the smart contract
    const exchangeEtherBalance = await exchange.methods.balanceOf(ETHER_ADDRESS, account).call();
    return [etherBalance, exchangeEtherBalance]
}

export const loadTokenBalances = async (web3: Web3, exchange: any, token: any, account: string) => {
    //token balance
    const tokenBalance = await token.methods.balanceOf(account).call();
    //token balance of account on the smart contract
    const exchangeTokenBalance = await exchange.methods.balanceOf(token.options.address, account).call();
    return [tokenBalance, exchangeTokenBalance]
}

export const loadBalances = async (web3: Web3, exchange: any, token: any, account: string) => {

    const [etherBalance, exchangeEtherBalance] = await loadEtherBalances(web3, exchange, account);
    const [tokenBalance, exchangeTokenBalance] = await loadTokenBalances(web3, exchange, token, account)
    parseFloat(web3.utils.fromWei(etherBalance, ETHUnit))

    return [parseFloat(web3.utils.fromWei(etherBalance, ETHUnit)), parseFloat(web3.utils.fromWei(exchangeEtherBalance, ETHUnit)),
    parseFloat(web3.utils.fromWei(tokenBalance, ETHUnit)), parseFloat(web3.utils.fromWei(exchangeTokenBalance, ETHUnit))]
}

export function updateForm(hash: any, props: any) {
    // console.log(hash)
    props.etherBalance = hash[0]
    props.exchangeEtherBalance = hash[1]
    props.tokenBalance = hash[2]
    props.exchangeTokenBalance = hash[3]
    //console.log(props)
    return props;
}

export const registerToken = async (pairs: any, exchange: any, account: string, address: string) => {
    await pairs.methods.add(address).send({ from: account });

    //  await exchange.methods.registerToken(address).send({ from: account })
}

export const queryRegisterToken = async (web3: any, address: any) => {

    if (address.length < 42 || address.length > 42) {
        console.log('NOT A VALID ADDRESS')
    } else {

        let token = new web3.eth.Contract(ERC20.abi, address);
        console.log(token)
        let rTokenSymbol = ''
        let rTokenName = ''
        let rTokentotalSupply = ''
        let rTokenDecimals = ''
        try {
            rTokenSymbol = await token.methods.symbol().call()
                .then((ret: any) => {
                    console.log(ret)
                    return ret
                })
            rTokenName = await token.methods.name().call()
            rTokentotalSupply = await token.methods.totalSupply().call()
            rTokenDecimals = await token.methods.decimals().call()
        }
        catch (err: any) {
            window.alert("Este endereço não pertence a um token ERC20");
            return;
        }

        console.log(rTokenName)
        const data = {
            name: rTokenName,
            symbol: rTokenSymbol,
            totalSupply: rTokentotalSupply,
            decimals: rTokenDecimals,
            address: address
        }
        console.log('TOKEN TO REGISTER : ', data)

        return data
    }
}
export function atualiza(dados: IProp, formInput: any, events: IEvents, setCarregado: any) {
    const { web3, exchange, token, account } = dados;
    loadBalances(web3, exchange, token, account)
        .then((hash: any) => {
            dados = updateForm(hash, dados)
            gerarMensagem('Operação completada com sucesso.',
                'Valor operação ' + formInput.etherDepositAmount + ' Ether',
                dados,
                events, setCarregado)
        })
}

export const depositEther = async (dados: IProp, formInput: IPropBalance, events: IEvents, setCarregado: any) => {
    const { web3, exchange, token, account } = dados;
  //  const {  setCarregado } = events

    const amount = web3.utils.toWei(formInput.etherDepositAmount.toString(), 'ether')

    let balanceWei = await web3.eth.getBalance(account);
    let balance: number = parseFloat(web3.utils.fromWei(balanceWei, 'ether'))
    // valida saldo 
    if (formInput.etherDepositAmount > balance) {
        gerarMensagem('Esta conta não possui ETH suficientes.',
            'Solicitado: ' + formInput.etherDepositAmount.toString() + '\n Saldo: ' + balance + ' Ether',
            dados,
            events, setCarregado)
    }
    exchange.methods.depositEther().send({ from: account, value: amount })
        .on('transactionHash', (hash: any) => {
            console.log('transactionHash depositEther ', hash)
            setCarregado(true)
        })
        .on('receipt', (hash: any) => {
            console.log('receipt depositEther ', hash.transactionHash);
        })
        .on('error', (err: any) => {
            console.log(err);
            setCarregado(true)
            window.alert("Ororreu um erro ao executar depósito");
        })
        .then((hash: any) => {
            console.log('then depositEther: ', hash.transactionHash);
            atualiza(dados, formInput, events, setCarregado);
        })
}

export const withdrawEther = async (dados: IProp, formInput: IPropBalance, events: IEvents, myTotalOpenOrders: any, setCarregado: any) => {
    const { web3, exchange, token, account } = dados;
   // const {  setCarregado } = events
     let balance = await exchange.methods.balanceOf(ETHER_ADDRESS, account).call()
    balance = web3.utils.fromWei(balance, 'ether')
    console.log('TOTAL OPEN ORDERS : ', myTotalOpenOrders)
    // Check if there is open orders for the token
    let totalEtherInOrder = 0
    let totalToWithdraw
    var asOpenOrders

    myTotalOpenOrders.forEach((order: any) => {
        // he ass sell orders for token
        if (order._tokenGive === ETHER_ADDRESS) {
            asOpenOrders = true
            // add order amount to total
            console.log(order)
            totalEtherInOrder += order.etherAmount
            //console.log('TOTAL ETHER IN ORDERS', totalEtherInOrder)
            // console.log('DECIMALS : ', decimals)
        }
    });

    totalToWithdraw = balance - totalEtherInOrder
    //console.log('BALANCE : ', balance)
    //console.log('AMOUNT : ', formInput.etherWithdrawAmount)
    if (formInput.etherWithdrawAmount > totalToWithdraw) {
        // console.log('TOTAL TO WITHDRAW :', totalToWithdraw)
        if (asOpenOrders === true) {
            //console.log(asOpenOrders)
            gerarMensagem('Você possui ordens abertas',
                'Você tem  ' + totalEtherInOrder + ' Ether em ordens abertas. Dimimiua o valor de resgate ou cancela sua(s) ordem(ns). Somente ' + totalToWithdraw + ' Ether avaliados para resgate.',
                dados,
                events, setCarregado)
        } else {
            gerarMensagem('Insuficient Balance',
                'You dont have this amount of Ether in your account. You have ' + balance + ' Ether',
                dados,
                events,setCarregado)
        }

    } else {
        const amount = web3.utils.toWei(formInput.etherWithdrawAmount.toString(), 'ether');

        exchange.methods.withdrawEther(amount).send({ from: account })
            .on('transactionHash', (hash: string) => {
                console.log('transactionHash withdrawEther ', hash);
                setCarregado(true)
            })
            .on('receipt', (hash: string) => {
                console.log('receipt withdrawEther', hash);
            })
            .on('error', (err: any) => {
                console.log(err);
                setCarregado(true)
                window.alert("error withdrawing");
            })
            .then((hash: any) => {
                console.log('then withdrawEther', hash);
                return atualiza(dados, formInput, events, setCarregado);
            });
    }
}

export const depositToken = async (dados: IProp, formInput: IPropBalance, events: any, setCarregado: any) => {
    const { web3, exchange, token, tokenName, account } = dados;
   // const {  setCarregado } = events
    const amount = web3.utils.toWei(formInput.tokenDepositAmount.toString(), 'ether');
    const saldo = await token.methods.balanceOf(account).call()
    let balance: number = parseFloat(web3.utils.fromWei(saldo, 'ether'))

    if (formInput.tokenDepositAmount > balance) {
        gerarMensagem('Esta conta não possui ' + tokenName + ' suficiente.',
            'Solicitado: ' + formInput.tokenDepositAmount.toString() + '\n Saldo: ' + balance + ' ' + tokenName,
            dados,
            events, setCarregado)
    }
    else {
        token.methods.approve(exchange.options.address, amount).send({ from: account })
            .on('transactionHash', (hash: any) => {
                console.log('transactionHash approved', hash);
            })
            .on('error', (err: any) => {
                console.log(err);
                setCarregado(true)
                window.alert("Erro ao APROVAR token");
            })
            .then((hash: any) => {
                exchange.methods.depositToken(token.options.address, amount).send({ from: account })
                    .on('transactionHash', (hash: any) => {
                        console.log('transactionHash depositToken ', hash)
                        setCarregado(true)
                    })
                    .on('error', (err: any) => {
                        console.log(err);
                        setCarregado(true)
                        window.alert("Erro ao executar token");
                    })
                    .then((hash: any) => {
                        console.log(hash);
                        formInput.gas = hash.gasUsed;
                        atualiza(dados, formInput, events, setCarregado);
                    });
            });
    }

}

export const withdrawToken = async (dados: IProp, formInput: IPropBalance, events: any, myTotalOpenOrders: any, setCarregado: any) => {
    const { web3, exchange, token, account, tokenName } = dados;
    const { setShow, setResult } = events
    let balance = await exchange.methods.balanceOf(token.options.address, account).call()
    //let decimals =await token.methods.decimals().call()
    balance = web3.utils.fromWei(balance, 'ether')
    // Check if there is open orders for the token
    let totalTokensInOrder = 0
    let totalToWithdraw
    var asOpenOrders

    myTotalOpenOrders.forEach((order: any) => {
        // he ass sell orders for token
        if (order._tokenGive === token.options.address) {
            asOpenOrders = true
            // add order amount to total
            totalTokensInOrder += parseInt(order.tokenAmount)
            console.log('TOTAL TOKEN IN ORDERS', totalTokensInOrder)
            //console.log(typeof(asOpenOrders))
        }
    });
    //console.log(orders)
    totalToWithdraw = balance - totalTokensInOrder
    // console.log('AMOUNT : ', amount)
    console.log('TOTAL DISPONIVEL : ', totalToWithdraw)
    let retorno: IMsg = msgInicial
    if (formInput.tokenWithdrawAmount > totalToWithdraw) {
        if (asOpenOrders === true) {
            gerarMensagem('Você possui ordens abertas',
                'Voce tem  ' + totalTokensInOrder + ' ' + tokenName + ' em ordens abertas. ' +
                ' Diminua a quantidade de resgate ou cancele as ordens. Possui ' + totalToWithdraw +
                ' ' + tokenName + ' disponível para resgate.',
                dados,
                events, setCarregado)
        } else {
            gerarMensagem('Insuficient Balancex',
                'You dont have this amount of ' + tokenName + ' in your account. You have ' + balance + ' ' + tokenName,
                dados,
                events, setCarregado)
        }

    } else {
        const amount = web3.utils.toWei(formInput.tokenWithdrawAmount.toString(), 'ether');

        exchange.methods.withdrawToken(token.options.address, amount).send({ from: account })
            .on('transactionHash', (hash: any) => {
                console.log('transactionHash withdrawToken', hash);
                setCarregado(true)
            })
            .on('receipt', (hash: any) => {
                console.log('receipt withdrawToken');
                //  loadTokenBalances(web3, exchange, token, account);
            })
            .on('error', (err: any) => {
                console.log(err);
                setCarregado(true)
                window.alert("error withdrawToken");
            })
            .then((hash: any) => {
                console.log('then withdrawToken', hash);
                return atualiza(dados, formInput, events, setCarregado);
            });
    }

}

