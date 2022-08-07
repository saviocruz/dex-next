import React  from 'react';

/*
import Trades from './Trades';
 

 
import PriceChart from './PriceChart';
  */
import Balance from './Balance';
import { IEvents, IProp } from './lib/type';
import MyTransactions from './MyTransactions';
import NewOrder from './NewOrder';
import OrderBook from './OrderBook';


interface Props {
    dados: IProp;
    events: IEvents;
}
const Content = ({ dados, events }: Props) => {
    const {updateDados} = events
    return (
        <div  >
            <div  >
                <Balance dados={dados} />
                <NewOrder dados={dados} events={events}  />
            </div>
            {<OrderBook dados={dados} events={events} />}
            <div   >
                <MyTransactions dados={dados}  updateDados={events.updateDados}/>
                {/* <PriceChart />
                  {/*  */}
            </div>
            {/*  <Trades />*/}
        </div>
    );
}

export default Content;