import { ether, ETHER_ADDRESS, GREEN, RED, tokens } from '../../pages/lib/helpers';
import { loadBalances, updateForm } from "./contracts";
import moment from 'moment'
import { get, groupBy, reject, maxBy, minBy } from 'lodash'
import { IEvents, IProp } from '../../pages/lib/type';
import { IMensagem } from '../../pages/Mensagem';

export const loadAllOrders = async (exchange: any, token: any) => {
    // cacelled orders
  //  console.log("cancelledOrdersOnToken1")
    let bloc = 30
    const cancelStream = await exchange.getPastEvents('Cancel', { fromBlock: bloc, toBlock: 'latest' })
   // console.log("cancelledOrdersOnToken2")
    //format cancelled orders
    const cancelledOrders = cancelStream.map((event: any) => event.returnValues)
    let cancelledOrderCount = 0
    let cancelledOrdersOnToken: any = []
    cancelledOrders.forEach((element: any) => {
        if ((element._tokenGive === token.options.address) || (element._tokenGet === token.options.address)) {
            cancelledOrdersOnToken[cancelledOrderCount] = element
            cancelledOrderCount += 1
        }
    });
    console.log("cancelledOrdersOnToken")
    // filled orders
    const tradeStream = await exchange.getPastEvents('Trade', { fromBlock: bloc, toBlock: 'latest' })
    const filledOrders = tradeStream.map((event: any) => event.returnValues)
    let filledOrderCount = 0
    let filledOrdersOnToken: any = []
    filledOrders.forEach((element: any) => {
        if ((element._tokenGive === token.options.address) || (element._tokenGet === token.options.address)) {
            filledOrdersOnToken[filledOrderCount] = element
            filledOrderCount += +1
        }
    });
    console.log("filledOrdersOnToken")
    //all orders
    const orderStream = await exchange.getPastEvents('Order', { fromBlock: bloc, toBlock: 'latest' })
    const allOrders = orderStream.map((event: any) => event.returnValues)
    let allOrderCount = 0
    let allOrdersOnToken: any = []
    allOrders.forEach((element: any) => {
        if ((element._tokenGive == token.options.address) || (element._tokenGet == token.options.address)) {
            allOrdersOnToken[allOrderCount] = element
            allOrderCount += 1
        }
    });
    console.log("allOrdersOnToken")

    return [cancelledOrders, cancelledOrdersOnToken, filledOrders, filledOrdersOnToken, allOrders, allOrdersOnToken];
}

export const openOrders = (allOrders: any, filledOrders: any, cancelledOrders: any) => {
    const all = allOrders    // < --------------- CHECK 
    const filled = filledOrders
    const cancelled = cancelledOrders

    const openOrders = reject(all, (order: any) => {
        const orderFilled = filled.some((o: any) => o._id === order._id)
        const orderCancelled = cancelled.some((o: any) => o._id === order._id)
        return (orderFilled || orderCancelled)
    })

    return openOrders
}

export const orderBookSelector = (orders: any) => {
    // Decorate orders
    orders = decorateOrderBookOrders(orders)

    // Group orders by "orderType"
    orders = groupBy(orders, 'orderType')
    // Fetch buy orders
    const buyOrders = get(orders, 'buy', [])
    // Sort buy orders by token price
    console.log(orders)
    orders = {
        ...orders,
        buyOrders: buyOrders.sort((a: any, b: any) => a.tokenPrice - b.tokenPrice)
    }

    // Fetch sell orders
    const sellOrders = get(orders, 'sell', [])
    // Sort sell orders by token price
    orders = {
        ...orders,
        sellOrders: sellOrders.sort((a: any, b: any) => b.tokenPrice - a.tokenPrice)
    }
    return orders
}
export const myFilledOrdersSelector = (account: any, orders: any) => {
    // find our orders
    orders = orders.filter((o: any) => o._user === account || o._userFill === account)
    // sort by date ascending
    orders = orders.sort((a: any, b: any) => b._timestamp - a._timestamp)
    // decorate orders - add display attribute
    orders = decorateMyFilledOrders(orders, account)
    return orders
}

export const myTotalOpenOrdersSelector = (account: any, orders: any) => {
    // filter orders created by current account

    orders = orders.filter((o: any) => o._user === account)
    // orders = decorateOrder(orders)
    orders = decorateFilledOrders(orders)
    orders = decorateOrderBookOrders(orders)
    return orders
}

const decorateOrderBookOrders = (orders: any) => {
    return (
        orders.map((order: any) => {
            order = decorateOrderBookOrder(order)
            order = decorateOrder(order)
            return (order)
        })
    )
}

const decorateOrder = (order: any) => {
    let etherAmount
    let tokenAmount

    if (order._tokenGive === ETHER_ADDRESS) {
        etherAmount = order._amountGive
        tokenAmount = order._amountGet
    } else {
        etherAmount = order._amountGet
        tokenAmount = order._amountGive
    }

    // Calculate token price to 5 decimal places
    const precision = 100000
    let tokenPrice = (etherAmount / tokenAmount)
    tokenPrice = Math.round(tokenPrice * precision) / precision

    return ({
        ...order,
        etherAmount: ether(etherAmount),
        tokenAmount: tokens(tokenAmount),
        tokenPrice,
        formattedTimestamp: moment.unix(order._timestamp).format('D/M H:mm:ss')
    })
}

const decorateOrderBookOrder = (order: any) => {
    const orderType = order._tokenGive === ETHER_ADDRESS ? 'buy' : 'sell'
    return ({
        ...order,
        orderType,
        orderTypeClass: (orderType === 'buy' ? GREEN : RED),
        orderFillAction: orderType === 'buy' ? 'Vende' : 'Compra'
    })
}

const decorateFilledOrders = (orders: any) => {
    // Track previous order to compare history
    let previousOrder = orders[0]
    return (
        orders.map((order: any) => {
            order = decorateOrder(order)
            order = decorateFilledOrder(order, previousOrder)
            previousOrder = order // Update the previous order once it's decorated
            return order
        })
    )
}

const decorateFilledOrder = (order: any, previousOrder: any) => {
    return ({
        ...order,
        tokenPriceClass: tokenPriceClass(order.tokenPrice, order._id, previousOrder)

    })
}

const tokenPriceClass = (tokenPrice: number, orderId: number, previousOrder: any) => {
    // Show green price if only one order exists
    // console.log(previousOrder)
    if (previousOrder._id === orderId) {
        return GREEN
    }

    // Show green price if order price higher than previous order
    // Show red price if order price lower than previous order
    if (previousOrder.tokenPrice <= tokenPrice) {
        return GREEN // success
    } else {
        return RED // danger
    }
}


//My Transactions
export const decorateMyFilledOrders = (orders: any, account: any) => {
    return (
        orders.map((order: any) => {
            order = decorateOrder(order)
            order = decorateMyFilledOrder(order, account)
            return (order)
        })
    )
}
//decorate orders depending on if they are buy or sell
const decorateMyFilledOrder = (order: any, account: any) => {
    const myOrder = order._user === account

    let orderType
    if (myOrder) {
        orderType = order._tokenGive === ETHER_ADDRESS ? 'buy' : 'sell'
    } else {
        orderType = order._tokenGive === ETHER_ADDRESS ? 'sell' : 'buy'
    }

    return ({
        ...order,
        orderType,
        orderTypeClass: (orderType === 'buy' ? GREEN : RED),
        orderSign: (orderType === 'buy' ? '+' : '-')
    })
}
export const decorateMyOpenOrders = (orders: any, account: any) => {
    return (
        orders.map((order: any) => {
            order = decorateOrder(order)
            order = decorateMyOpenOrder(order, account)
            return (order)
        })
    )
}

const decorateMyOpenOrder = (order: any, account: any) => {
    let orderType = order._tokenGive === ETHER_ADDRESS ? 'buy' : 'sell'

    return ({
        ...order,
        orderType,
        orderTypeClass: (orderType === 'buy' ? GREEN : RED)
    })
}

export const initSelect = (data: any) => {
    return data.map((item: any) => ({
        ...item,
        selected: false
    }));
}



export const loadCanceledOrders = async (exchange: any, token: any) => {
    try {
        // Cancelled
        const listaOrders = await exchange.methods.orders(0).call();
        console.log(listaOrders)
        let cancelledOrders = listaOrders.map((event: any) => event.returnValues);
        cancelledOrders = cancelledOrders.filter(function (order: any) {
            if ((order._tokenGive === ETHER_ADDRESS || order._tokenGive === token.address)
                && (order._tokenGet === ETHER_ADDRESS || order._tokenGet === token.address)) {
                return true
            }
            return false;
        });
        return [cancelledOrders]
    }
    catch (err) {
        console.log(err);
    }
}

export const cancelOrder = ( order: any,   dados: IProp, events: IEvents, setCarregado: any) => {
    const { exchange, token , account } = dados


    console.log(events)
    exchange.methods.cancelOrder(order._id).send({ from:   account })
        //only dispatch the redux action once the hash has come back from the blockchain
        .on('transactionHash', (hash: any) => {
            console.log('transactionHash cancelOrder', hash)
        })
        .on('receipt', (hash: any) => {
            console.log('receipt cancelOrder', hash.transactionHash)
        })
        .on('error', (error: any) => {
            console.log(error);
            setCarregado(true)
            window.alert("There was an error");

        })
        .then(async (hash: any) => {
            console.log('then cancelOrder', hash)
            const [orders, filledOrders, myOrders, myFilledOrders] = await loadOrders(exchange, token, account);
            dados.orderBook = orders
            dados.myOpenOrders = myOrders
            dados.filledOrders = filledOrders
            dados.myFilledOrders = myFilledOrders
            gerarMensagem('Operação completada',
                'A ordem foi cancelada.',
                dados, events, setCarregado)

           //  updateDados(props)
        })
}
export const fillOrder = (order: any, dados: IProp, events: IEvents, setCarregado: any,   setOrderID: any) => {

    const { exchange, token, web3, account, tokenName, exchangeEtherBalance, exchangeTokenBalance } = dados
    console.log(order)
    let amount = order._amountGet / (10 ** 18)
    let amountGive = order._amountGive / (10 ** 18)
    console.log('AMOUNT GET BY SELLER:', amount)
    console.log('AMOUNT PAYED BY BUYER:', amountGive)
    //let feeAmount = (amount * feePercent) / 100
    let balance

    // check the balance
    if (order._tokenGet === ETHER_ADDRESS) {
        balance = exchangeEtherBalance

    } else {
        balance = exchangeTokenBalance
    }
    console.log('SELLER GET : ', order._tokenGet)
    console.log('BUYER PAYES : ', order._tokenGive)
    console.log('BALANCE : ', balance)
    // console.log('AMOUNT : ',amount)
    // console.log('FEE AMOUNT : ',feeAmount)
    console.log('EVAL : ', amount > balance && order._tokenGet === ETHER_ADDRESS)

    if (amount > balance && order._tokenGet === ETHER_ADDRESS) {
        gerarMensagem('Insuficient Balance',
            'Not enough Ether in your account to fill the order. Please deposit some Ether. Your curently have ' + balance + ' Ether on the exchange.',
            dados, events, setCarregado)
    } else if (amount > balance && order._tokenGet !== ETHER_ADDRESS) {
        gerarMensagem('Insuficient Balance', 'Not enough ' + tokenName + ' in your account to fill the order. Please deposit some ' + tokenName + '. Your curently have ' + balance + ' ' + tokenName + ' on the exchange.', dados, events, setCarregado)
    } else {
        exchange.methods.fillOrder(order._id).send({ from: account })
            //only dispatch the redux action once the hash has come back from the blockchain
            .on('transactionHash', (hash: any) => {
                console.log("transactionHash fillOrder")

            })
            .on('receipt', (hash: any) => {
                console.log("receipt fillOrder")
            })
            .on('error', (error: any) => {
                console.log(error);
                events.setCarregado(true)
                setOrderID(0)
                window.alert("There was an error");
            })

            .then(async (hash: any) => {
                console.log('then fillOrder', hash.transactionHash)
                //gerarMensagem('Ordem enviada', 'Aguarde confirmação: Foram enviados ' + amount, dados, events)
                atualiza(dados, amount, events, setCarregado)
               // setOrderID(0)

            })
    }
}

export const makeBuyOrder = async (formInput: any, dados: IProp, events: IEvents) => {
    const { exchange, token, web3, account } = dados
    const { setCarregado } = events
    const tokenGet = token.options.address;
    console.log(token.options.address)
    const amountGet = web3.utils.toWei(formInput.buyAmount, 'ether');
    const tokenGive = ETHER_ADDRESS;
    const amountGive = web3.utils.toWei((formInput.buyAmount * formInput.buyPrice).toFixed(18), 'ether');

    let decimals = await token.methods.decimals().call()
    let balance = await exchange.methods.balanceOf(ETHER_ADDRESS, account).call() / (10 ** decimals)
    console.log(balance)
    console.log(formInput.buyAmount * formInput.buyPrice)
    if ((formInput.buyAmount * formInput.buyPrice) > balance) {
        gerarMensagem('Saldo insuficiente',
            'Não há Ether suficiente em sua conta para executar a ordem. Deposite um pouco de Ether ou use uma quantia menor.'
            + ' Você tem atualmente ' + balance + ' Ether em sua conta.'
            , dados, events, setCarregado)
    } else {
        console.log(tokenGet, amountGet, tokenGive, amountGive)
       let ret = await exchange.methods.makeOrder(tokenGet, amountGet, tokenGive, amountGive).send({ from: account })
      

            .on('transactionHash', (hash: any) => {
                console.log('transactionHash makeBuyOrder', hash)
            })
            console.log(ret)
           /* .on('error', (error: any) => {
                console.log(error);
                setCarregado(true)
                window.alert('Ocorreu um erro na ordem de compra');
            })
            .then(async (hash: any) => {
                console.log('then makeBuyOrder', hash.transactionHash) */
     //   await atualiza(dados, formInput.buyAmount, events, setCarregado)

           // })

    }
}

export const makeSellOrder = async (formInput: any, dados: IProp, events: IEvents) => {
    const { exchange, token, web3, account } = dados
    const { setCarregado } = events
    const tokenGet = ETHER_ADDRESS;
    const amountGet = web3.utils.toWei((formInput.sellAmount * formInput.sellPrice).toFixed(18), 'ether');
    const tokenGive = token.options.address;
    const amountGive = web3.utils.toWei(formInput.sellAmount, 'ether');

    let decimals = await token.methods.decimals().call()
    let balance = await exchange.methods.balanceOf(token.options.address, account).call() / (10 ** decimals)
    const symbol = await token.methods.symbol().call()
    if (formInput.sellAmount > balance) {
        gerarMensagem('Saldo insuficiente',
            'Não há token suficiente em sua conta para executar a ordem. Deposite um pouco de Ether ou use uma quantia menor.'
            + ' Você tem atualmente ' + balance + ' token em sua conta.'
            , dados, events, setCarregado)

    } else {
        exchange.methods.makeOrder(tokenGet, amountGet, tokenGive, amountGive).send({ from: account })
            .on('transactionHash', (hash: any) => {
                console.log('transactionHash makeBuyOrder', hash)
            })
            .on('error', (error: any) => {
                console.log(error);
                setCarregado(true)
                window.alert('Ocorreu um erro na ordem de venda');
            })
            .on('receipt', (hash: any) => {
                console.log('receipt makeBuyOrder', hash.transactionHash)
            })
            .then(async (hash: any) => {
                console.log('then makeBuyOrder', hash)
                console.log(hash)
                atualiza(dados, formInput.sellAmount, events, setCarregado)
            });

    }
}


export async function loadOrders(exchangeContract: any, tokenContract: any, account: string) {
    const [cancelledOrders, cancelledOrdersOnToken, filledOrders, filledOrdersOnToken, allOrders, allOrdersOnToken]: any =
        await loadAllOrders(exchangeContract, tokenContract);
   // console.log(tokenContract)
    // BUSCA TODAS ORDENS ABERTAS
    let orders: any = openOrders(allOrdersOnToken, filledOrdersOnToken, cancelledOrdersOnToken);
    orders = await orderBookSelector(orders);	// buyOrders //sellOrders
    console.log(orders)
    let myOrders: any = openOrders(allOrdersOnToken, filledOrdersOnToken, cancelledOrdersOnToken);
    myOrders = myTotalOpenOrdersSelector(account, myOrders);

    let myFilledOrders: any = myFilledOrdersSelector(account, filledOrdersOnToken);

    let filledOrdersDec = decorateFilledOrders(filledOrdersOnToken);
    return [orders, filledOrdersDec, myOrders, myFilledOrders, cancelledOrdersOnToken, filledOrdersOnToken, allOrdersOnToken]
}

export function gerarMensagem(msg: string, desc: string, dados: IProp, events: IEvents, setCarregado: any) {
    const { setResult, setShow } = events;

    const result: IMensagem = {
        msg: msg,
        desc: desc,
        gas: 0,
        show: true,
        setShow: setShow,
        setCarregado: setCarregado,
        data: dados
    }
    setResult(result)
    setShow(true)
}

function atualiza(dados: any, amount: any, events: IEvents, setCarregado: any) {
    const { web3, exchange, token, account } = dados;
    loadOrders(exchange, token, account)
        .then((orders: any) => {
            dados.orderBook = orders[0]
            dados.filledOrders = orders[1]
            dados.myOpenOrders = orders[2]
            dados.myFilledOrders = orders[3]
            // events.updateDados(dados)
            console.log(orders)
            loadBalances(web3, exchange, token, account)
                .then((balance: any) => {
                    dados.etherBalance = balance[0]
                    dados.exchangeEtherBalance = balance[1]
                    dados.tokenBalance = balance[2]
                    dados.exchangeTokenBalance = balance[3]
                    
                     priceChartSelector(orders[1])
                     .then((priceChart: any) => {
                        console.log(priceChart)
                         dados.priceChart = priceChart
                        gerarMensagem('Operação completada com sucesso.',
                            'Valor operação ' + amount + ' Ether',
                            dados,
                            events, setCarregado)
                    })
 
                })
        });


}


export  const priceChartSelector =  async (filledOrders: any) => {
    filledOrders = filledOrders.sort((a: any, b: any) => a._timestamp - b._timestamp)
    let orders = filledOrders

    // Decorate orders - add display attributes
    orders = orders.map((o: any) => decorateOrder(o))
    // Get last 2 order for final price & price change
    let secondLastOrder, lastOrder
    [secondLastOrder, lastOrder] = orders.slice(orders.length - 2, orders.length)
    // get last order price
    const lastPrice = get(lastOrder, 'tokenPrice', 0)
    // get second last order price
    const secondLastPrice = get(secondLastOrder, 'tokenPrice', 0)

    return ({
        lastPrice,
        lastPriceChange: (lastPrice >= secondLastPrice ? '+' : '-'),
        series: [{
            data: buildGraphData(orders) || null
        }]
    })
}


const buildGraphData = (orders: any) => {
    // Group the orders by hour for the graph
    orders = groupBy(orders, (o) => moment.unix(o._timestamp).startOf('hour').format())
    // Get each hour where data exists
    const hours = Object.keys(orders)
    // Build the graph series
    const graphData = hours.map((hour) => {
        // Fetch all the orders from current hour
        const group = orders[hour]
        // Calculate price values - open, high, low, close
        const open = group[0] // first order
        const high: any = maxBy(group, 'tokenPrice') // high price
        const low: any = minBy(group, 'tokenPrice') // low price
        const close = group[group.length - 1] // last order

        return ({
            x: new Date(hour),
            y: [open.tokenPrice, high.tokenPrice, low.tokenPrice, close.tokenPrice]
        })
    })
    console.log('GRAPH DATA : ', graphData)
    return graphData
}
