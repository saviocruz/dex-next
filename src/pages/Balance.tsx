import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Button } from 'react-bootstrap';
import Spinner from './Spinner';

import { depositEther, withdrawEther, depositToken, withdrawToken, } from '../store/interactions/contracts';
import BalanceForm from './BalanceForm';
import BalanceTable from './BalanceTable';
import { loadAllOrders, myTotalOpenOrdersSelector, openOrders } from '../store/interactions/orders';
import { loadExchange, loadToken } from './lib/loadContrats';
import { estadoInicial, IPropBalance, IProp, IEvents } from './lib/type';

const showForm = (props: IProp, myOrders: any, events: IEvents) => {

    const [formInput, updateFormInput] = useState<IPropBalance>(estadoInicial)
    const [carregado, setCarregado] = useState<boolean>(true)
    const { etherBalance, tokenBalance, exchangeEtherBalance, exchangeTokenBalance, tokenName, } = props;

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
        events.setCarregado = setCarregado
        events = {...events, setCarregado: setCarregado}
        await depositEther(props, formInput, events )

    }

    const depositTokenSubmit = async (e: any) => {
        e.preventDefault();
        setCarregado(false)
        events.setCarregado = setCarregado
        events = {...events, setCarregado: setCarregado}
        await depositToken(props, formInput, events);
    }

    const withdrawEtherSubmit = async (e: any) => {
        e.preventDefault();
        setCarregado(false)
        events.setCarregado = setCarregado
        events = {...events, setCarregado: setCarregado}
        await withdrawEther(props, formInput, events, myOrders);
    }

    const withdrawTokenSubmit = async (e: any) => {
        e.preventDefault();
        setCarregado(false)
        events.setCarregado = setCarregado
        events = {...events, setCarregado: setCarregado}
        await withdrawToken(props, formInput, events, myOrders);
    }

    if (!carregado) {
        return <Spinner />
    }
    else {


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
                            value={formInput.etherDepositAmount}
                        />
                        <BalanceTable hasHead={true} tokenName={tokenName} walletAmount={tokenBalance} exchangeAmount={exchangeTokenBalance} />
                        <BalanceForm
                            onSubmit={depositTokenSubmit}
                            placeHolder={tokenName}
                            onChange={depositTokenChange}
                            buttonText={"Depositar"}
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
                            value={formInput.etherWithdrawAmount}
                        />
                        <BalanceTable hasHead={true} tokenName={tokenName} walletAmount={tokenBalance} exchangeAmount={exchangeTokenBalance} />
                        <BalanceForm
                            onSubmit={withdrawTokenSubmit}
                            placeHolder={`Quantidade  ${tokenName}`}
                            onChange={withdrawTokenChange}
                            buttonText={"Resgatar"}
                            value={formInput.tokenWithdrawAmount}
                        />
                    </Tab>
                </Tabs>
            </div>
        )
    }
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
        //   console.log(dados)
        const { web3, account } = dados;

        const [exchangeContract]: any = await loadExchange(web3)
        const [tokenContract]: any = await loadToken(web3)

        const [cancelledOrders, cancelledOrdersOnToken, filledOrders, filledOrdersOnToken, allOrders, allOrdersOnToken]: any =
            await loadAllOrders(exchangeContract, tokenContract);

        let orders: any = openOrders(allOrders, filledOrders, cancelledOrders);
        const myOrdes: any = myTotalOpenOrdersSelector(account, orders);
        setMyOrders(myOrdes)

    }

    return (
        <div className="card  bg-transparent text-white">
            <div className="card-header">
                Saldos da Plataforma
            </div>
            <div className="card-body">
                {showForm(dados, myOrders, events)}
            </div>
        </div>
    );

}



export default Balance;