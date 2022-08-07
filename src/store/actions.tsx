export function web3Loaded(connection: any){
    return {
        type: 'WEB3_LOADED',
        connection
    }
}

export function web3AccountLoaded(account: any){
    return {
        type: 'WEB3_ACCOUNT_LOADED',
        account
    }
}

export function pairsLoaded(pairs: any){
    return {
        type: 'PAIRS_LOADED',
        pairs
    }
}

export function availableTokensLoading(){
    return {
        type: 'AVAILABLE_TOKENS_LOADING'
    }
}

export function availableTokensLoaded(){
    return {
        type: 'AVAILABLE_TOKENS_LOADED'
    }
}

export function numberOfTokensLoaded(numberOfTokens: any){
    return {
        type: 'NUMBER_OF_TOKENS_LOADED',
        numberOfTokens
    }
}

export function tokenPairsLoaded(pairs: any){
    return {
        type: 'TOKEN_PAIRS_LOADED',
        pairs
    }
}

export function tokenLoaded(token: any, name: any){
    return {
        type: 'TOKEN_LOADED',
        token,
        name
    }
}

export function exchangeLoaded(exchange: any){
    return {
        type: 'EXCHANGE_LOADED',
        exchange
    }
}

export function cancelledOrdersLoaded(cancelledOrders: any){
    return {
        type: 'CANCELLED_ORDERS_LOADED',
        cancelledOrders
    }
}

export function ordersLoaded(orders: any){
    return {
        type: 'ORDERS_LOADED',
        orders
    }
}

export function tradesLoaded(trades: any){
    return {
        type: 'TRADES_LOADED',
        trades
    }
}

export function orderCancelling(){
    return {
        type: 'ORDER_CANCELLING',
    }
}

export function orderCancelled(order: any){
    return {
        type: 'ORDER_CANCELLED',
        order
    }
}

export function orderFilling(){
    return {
        type: 'ORDER_FILLING'
    }
}

export function orderFilled(order: any){
    return {
        type: 'ORDER_FILLED',
        order
    }
}

export function etherBalanceLoaded(balance: any){
    return {
        type: 'ETHER_BALANCE_LOADED',
        balance
    }
}

export function tokenBalanceLoaded(balance: any){
    return {
        type: 'TOKEN_BALANCE_LOADED',
        balance
    }
}

export function exchangeEtherBalanceLoaded(balance: any){
    return {
        type: 'EXCHANGE_ETHER_BALANCE_LOADED',
        balance
    }
}

export function exchangeTokenBalanceLoaded(balance: any){
    return {
        type: 'EXCHANGE_TOKEN_BALANCE_LOADED',
        balance
    }
}

export function balancesLoaded(){
    return {
        type: 'BALANCES_LOADED'
    }
}

export function balancesLoading(){
    return {
        type: 'BALANCES_LOADING'
    }
}
/*
export function etherDepositAmountChanged(amount: any){
    return {
        type: 'ETHER_DEPOSIT_AMOUNT_CHANGED',
        amount
    }
}

export function etherWithdrawAmountChanged(amount: any){
    return {
        type: 'ETHER_WITHDRAW_AMOUNT_CHANGED',
        amount
    }
}

export function tokenDepositAmountChanged(amount: any){
    return {
        type: 'TOKEN_DEPOSIT_AMOUNT_CHANGED',
        amount
    }
}

export function tokenWithdrawAmountChanged(amount: any){
    return {
        type: 'TOKEN_WITHDRAW_AMOUNT_CHANGED',
        amount
    }
}

export function buyOrderAmountChanged(amount: any) {
    return {
        type: 'BUY_ORDER_AMOUNT_CHANGED',
        amount
    }
}

export function buyOrderPriceChanged(price: any) {
    return {
        type: 'BUY_ORDER_PRICE_CHANGED',
        price
    }
}
*/
export function buyOrderMaking(){
    return {
        type: 'BUY_ORDER_MAKING'
    }
}

export function sellOrderAmountChanged(amount: any) {
    return {
        type: 'SELL_ORDER_AMOUNT_CHANGED',
        amount
    }
}

export function sellOrderPriceChanged(price: any) {
    return {
        type: 'SELL_ORDER_PRICE_CHANGED',
        price
    }
}

export function sellOrderMaking(){
    return {
        type: 'SELL_ORDER_MAKING'
    }
}

export function orderMade(order: any){
    return {
        type: 'ORDER_MADE',
        order
    }
}