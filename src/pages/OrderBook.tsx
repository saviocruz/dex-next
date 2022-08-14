import React, { useState } from 'react';

import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';

import Spinner from './Spinner';
import { fillOrder } from '../store/interactions/orders';
import { IEvents, IProp } from './lib/type';
import { equal } from 'assert';


const renderOrder = (order: any, dados: IProp, events: IEvents, carregado: boolean, setCarregado: any) => {
    const { account } = dados;

    //events.setCarregado = setCarregado
    // events = { ...events, setCarregado: setCarregado }
 
        return (
            <OverlayTrigger key={order._id}
                overlay={
                    <Tooltip id={order._id}>
                        {`${order._user}`}
                    </Tooltip>
                } >
                <tr key={order._id} className="order-book-order" title={order._id} >

                    <td>{order._id}</td>
                    <td>{order.tokenAmount}</td>

                    <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
                    <td>{order.etherAmount}</td>

                    <td style={{ fontSize: "12px" }}> {order.formattedTimestamp}</td>

                    <td>{carregado && order._user !== account && (
                        <Button className='btn btn-sm' onClick={(e) => {
                            setCarregado(false)
                            fillOrder(order, dados, events, setCarregado)
                        }
                        }>{order.orderFillAction}</Button>
                    )}
                    </td>
                </tr>
            </OverlayTrigger>
        )
 
}

const showOrderBook = (dados: any, events: IEvents) => {

    const { orderBook, tokenName, token } = dados;
    const { account } = dados;
    const [carregado, setCarregado] = useState<boolean>(true)


    return (
        <tbody key={token.options.address}>
            {orderBook.sellOrders.map((order: any) => renderOrder(order, dados, events, carregado, setCarregado))}
            <tr>
                <th>OrderID</th>
                <th>{tokenName}</th>
                <th title='Preço'>{tokenName}/ETH</th>
                <th>ETH</th>
                <th>Data/hora</th>
                <th>Opçao</th>
            </tr>
            {orderBook.buyOrders.map((order: any) => renderOrder(order, dados, events, carregado, setCarregado))}


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
                        {showOrderBook(dados, events)}
                    </table>
                </div>
            </div>
        </div>
    );

}


export default OrderBook;
