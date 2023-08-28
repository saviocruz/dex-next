import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Button } from 'react-bootstrap';
import Spinner from './Spinner';

import { depositEther, withdrawEther, depositToken, withdrawToken, loadBalances, } from '../store/interactions/contracts';
import BalanceForm from './BalanceForm';
import BalanceTable from './BalanceTable';
import { loadAllOrders, loadOrders, myTotalOpenOrdersSelector, openOrders, priceChartSelector } from '../store/interactions/orders';
import { loadExchange, loadToken } from './lib/loadContrats';
import { estadoInicial, IPropBalance, IProp, IEvents } from './lib/type';

const showForm = (props: IProp, myOrders: any, events: IEvents) => {

    const [formInput, updateFormInput] = useState<IPropBalance>(estadoInicial)
    const [carregado, setCarregado] = useState<boolean>(true)
    const { etherBalance, tokenBalance, exchangeEtherBalance, exchangeTokenBalance, tokenName, } = props;
    events.setCarregado = setCarregado
    events = { ...events, setCarregado: setCarregado }

    const depositEtherChange = (e: any) => {
        formInput.etherDepositAmount = e.target.value
        updateFormInput({ ...formInput, etherDepositAmount: e.target.value })
    };
    const depositTokenChange = (e: any) => {
        formInput.tokenDepositAmount = e.target.value
        updateFormInput({ ...formInput, tokenDepositAmount: e.target.value })

    };
    const withdrawEtherChange = (e: any) => {
        formInput.etherWithdrawAmount = e.target.value
        updateFormInput({ ...formInput, etherWithdrawAmount: e.target.value })
    };
    const withdrawTokenChange = (e: any) => {
        formInput.tokenWithdrawAmount = e.target.value
        updateFormInput({ ...formInput, tokenWithdrawAmount: e.target.value })
    };

    const depositEtherSubmit = async (e: any) => {
        e.preventDefault();
        setCarregado(false)

        await depositEther(props, formInput, events)

    }

    const depositTokenSubmit = async (e: any) => {
        e.preventDefault();
        setCarregado(false)
        //    events.setCarregado = setCarregado
        //  events = { ...events, setCarregado: setCarregado }
        await depositToken(props, formInput, events);
    }

    const withdrawEtherSubmit = async (e: any) => {
        e.preventDefault();
        setCarregado(false)
        //  events.setCarregado = setCarregado
        //  events = { ...events, setCarregado: setCarregado }
        await withdrawEther(props, formInput, events, myOrders);
    }

    const withdrawTokenSubmit = async (e: any) => {
        e.preventDefault();
        setCarregado(false)
        //   events = { ...events, setCarregado: setCarregado }
        await withdrawToken(props, formInput, events, myOrders);
    }



    return (
        <div>
            <Tabs defaultActiveKey={"deposit"} id="deposit" className=" text-white">
                <Tab eventKey={"deposit"} title={"Deposita"} className={"bg-transparent"} >
                    <BalanceTable hasHead={true} tokenName={"ETH"} walletAmount={etherBalance} exchangeAmount={exchangeEtherBalance} />
                    <BalanceForm
                        onSubmit={depositEtherSubmit}
                        placeHolder={`ETH`}
                        onChange={depositEtherChange}
                        buttonText={"Depositar"}
                        balance={etherBalance > 0 && carregado}
                        value={formInput.etherDepositAmount}
                    />

                    <BalanceTable hasHead={true} tokenName={tokenName} walletAmount={tokenBalance} exchangeAmount={exchangeTokenBalance} />

                    <BalanceForm
                        onSubmit={depositTokenSubmit}
                        placeHolder={tokenName}
                        onChange={depositTokenChange}
                        buttonText={"Depositar"}
                        balance={tokenBalance > 0 && carregado}
                        value={formInput.tokenDepositAmount}
                    />

                </Tab>
                <Tab eventKey={"withdraw"} title={"Resgata"} className={"bg-transparent"}>
                    <BalanceTable hasHead={true} tokenName={"ETH"} walletAmount={etherBalance} exchangeAmount={exchangeEtherBalance} />

                    <BalanceForm
                        onSubmit={withdrawEtherSubmit}
                        placeHolder={"Quantidade ETH"}
                        onChange={withdrawEtherChange}
                        buttonText={"Resgatar"}
                        balance={exchangeEtherBalance > 0 && carregado}
                        value={formInput.etherWithdrawAmount}
                    />

                    <BalanceTable hasHead={true} tokenName={tokenName} walletAmount={tokenBalance} exchangeAmount={exchangeTokenBalance} />

                    <BalanceForm
                        onSubmit={withdrawTokenSubmit}
                        placeHolder={`Quantidade  ${tokenName}`}
                        onChange={withdrawTokenChange}
                        buttonText={"Resgatar"}
                        balance={exchangeTokenBalance > 0 && carregado}
                        value={formInput.tokenWithdrawAmount}
                    />

                </Tab>
            </Tabs>
        </div>
    )
}

interface Props {
    dados: IProp;
    events: IEvents;
}

const Balance = ({ dados, events }: Props) => {
    const [myOrders, setMyOrders] = useState<any>();

    useEffect(() => {
        loadWallet()
    }, [])

    async function loadWallet() {
        const { web3, account, exchange, token } = dados;
        console.log(token)
        const [orders, filledOrders, myOrders, myFilledOrders, cancelledOrdersOnToken, filledOrdersOnToken, allOrdersOnToken] =
            await loadOrders(exchange, token, account)

        dados.orderBook = orders
        dados.myFilledOrders = myFilledOrders
        dados.myOpenOrders = myOrders
        dados.filledOrders = filledOrders

        const priceChart: any = await priceChartSelector(filledOrders)

        let _orders: any = openOrders(allOrdersOnToken, filledOrdersOnToken, cancelledOrdersOnToken);
        const myOrdes: any = myTotalOpenOrdersSelector(account, _orders);
        setMyOrders(myOrdes)
        console.log(myOrdes)
        const [etherBalance, exchangeEtherBalance, tokenBalance, exchangeTokenBalance] = await loadBalances(web3, exchange, dados.token, account);

        dados.etherBalance = etherBalance
        dados.exchangeEtherBalance = exchangeEtherBalance
        dados.tokenBalance = tokenBalance
        dados.exchangeTokenBalance = exchangeTokenBalance
        dados.priceChart = priceChart

        events.updateDados({ ...dados, myFilledOrders: myFilledOrders })
        events.updateDados({ ...dados, filledOrders: filledOrders })
        events.updateDados({ ...dados, myOpenOrders: myOrders })

        events.updateDados({ ...dados, etherBalance: etherBalance })
        events.updateDados({ ...dados, exchangeEtherBalance: exchangeEtherBalance })
        console.log(dados)

    }

    return (
        <div className="card  bg-transparent text-white">
            <div className="card-header">
                Saldos da Plataforma
            </div>
            <div className="card-body">
                {(showForm(dados, dados.myOpenOrders, events))}
            </div>
        </div>
    );

}



export default Balance;