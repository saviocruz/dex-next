import React  from 'react';

import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';

import Spinner from './Spinner';
import { fillOrder} from '../store/interactions/orders';
import { IEvents, IProp } from './lib/type';

 
const renderOrder = (order: any, dados: IProp, events: IEvents) => {
    const {account} = dados;
    return (
        <OverlayTrigger key={order._id}
            overlay={
                <Tooltip id={order._id}>
                    {`${order._user}`}
                </Tooltip>
            } >
            <tr key={order._id} className="order-book-order" title={order._id} >
                
                <td>{order.tokenAmount}</td>

                <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
                <td>{order.etherAmount}</td>

                <td style={{fontSize: "12px"}}> {order.formattedTimestamp}</td>
             
                <td>{order._user !== account && ( <Button className='btn btn-sm' onClick={(e) => fillOrder(  order, dados, events)}>{order.orderFillAction}</Button>)}
                   </td>
            </tr>
        </OverlayTrigger>
    )
}

const showOrderBook = (dados: any, events: IEvents) => {
    //fetch key from props using ES6
    const { orderBook, tokenName, token } = dados;
    //console.log(orderBook)
    return (
        <tbody key={token.options.address}>
            {orderBook.sellOrders.map((order: any) => renderOrder(order, dados, events))}
            <tr>
                <th>{tokenName}</th>
                <th title='Preço'>{tokenName}/ETH</th>
                <th>ETH</th>
                <th>Data/hora</th>
                <th>Opçao</th>
            </tr>
            {orderBook.buyOrders.map((order: any) => renderOrder(order, dados, events))}


        </tbody>
    );
}

interface Props {
    dados: IProp;
    events: IEvents;
}

const OrderBook = ({ dados, events }: Props) => {

    return (
        <div className="vertical">
            <div className="card bg-transparent text-white">
                <div className="card-header">
                    Livro de Ordens
                </div>
                <div className="card-body order-book">
                    <table className="table bg-transparent text-white table-sm small">
                        {showOrderBook ? showOrderBook(dados, events) : <Spinner type="table" />}
                    </table>
                </div>
            </div>
        </div>
    );

}


export default OrderBook;
