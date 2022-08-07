import React  from 'react';

import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';

import Spinner from './Spinner';
import { fillOrder} from '../store/interactions/orders';
import { IEvents, IProp } from './lib/type';

 
const renderOrder = (order: any, dados: IProp, events: IEvents) => {
    const { exchange, token, account, web3 } = dados;
    return (
        <OverlayTrigger key={order._id}
            overlay={
                <Tooltip id={order._id}>
                    {`Dono da ordem ${order._user}`}
                </Tooltip>
            } >
            <tr key={order._id} className="order-book-order" >
                <td>{order._id}</td>
                <td>{order.tokenAmount}</td>

                <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
                <td>{order.etherAmount}</td>

                <td> {order.formattedTimestamp}</td>
                <td>{order.filled}</td>
                <td><Button onClick={(e) => fillOrder(  order, dados, events)}>{order.orderFillAction}</Button></td>
            </tr>
        </OverlayTrigger>
    )
}

const showOrderBook = (dados: any,events: IEvents) => {
    //fetch key from props using ES6
    const { orderBook, tokenName, token } = dados;
    //console.log(orderBook)
    return (
        <tbody key={token.options.address}>
            {orderBook.sellOrders.map((order: any) => renderOrder(order, dados, events))}
            <tr>
                <th>#ID</th>
                <th>{tokenName}</th>
                <th title='Preço'>{tokenName}/ETH</th>
                <th>ETH</th>
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
        <div  >
            <div className="card bg-dark text-white">
                <div className="card-header">
                    Livro de Ordens
                </div>
                <div className="card-body order-book">
                    <table className="table table-dark table-sm small">
                        {showOrderBook ? showOrderBook(dados, events) : <Spinner type="table" />}
                    </table>
                </div>
            </div>
        </div>
    );

}


export default OrderBook;
