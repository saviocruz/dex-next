import React from 'react';
import { loadBalances } from '../store/interactions/contracts';

/*
import Trades from './Trades';
 

 
import PriceChart from './PriceChart';
  */
import Balance from './Balance';
import { IEvents, IProp } from './lib/type';
import MyTransactions from './MyTransactions';
import Navbar from './Navbar';
import NewOrder from './NewOrder';
import OrderBook from './OrderBook';
import PriceChart from './PriceChart';
import Trades from './Trades';
import Admin from './Admin';
import Spinner from './Spinner';


interface Props {
    dados: IProp;
    events: IEvents;
}
const Content = ({ dados, events }: Props) => {
    const { updateDados } = events

    const atualiza = async (dados: IProp) => {
        const [etherBalance, exchangeEtherBalance, tokenBalance, exchangeTokenBalance] = await loadBalances(dados.web3, dados.exchange, dados.token, dados.account);
        dados.tokenBalance = tokenBalance;
        dados.exchangeTokenBalance = exchangeTokenBalance;
        updateDados({ ...dados, [tokenBalance]: tokenBalance })
        updateDados({ ...dados, [exchangeTokenBalance]: exchangeTokenBalance })
        console.log(dados)
    }

    return (
        <div>

        <div className="exchange" >

            <div className="vertical-split">
                <Navbar dados={dados} events={events} />
                <Balance dados={dados} events={events} />
                <NewOrder dados={dados} events={events} />
            </div>
            <div style={{ minWidth: "470px" }} className="vertical-split">
                <OrderBook dados={dados} events={events} />
            </div>
            <div className="vertical-split">
                <MyTransactions dados={dados} events={events} />
                <PriceChart dados={dados} events={events} />
            </div>
            <div className="vertical-split">
            <Trades dados={dados} events={events} />
            </div>
        </div>
        </div>
    );
}

export default Content;