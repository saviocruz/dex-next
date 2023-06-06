import React, { useEffect, useState } from 'react';

import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';

import { fillOrder } from '../store/interactions/orders';
import { IEvents, IProp } from './lib/type';


const renderOrder = (order: any, dados: IProp, events: IEvents, carregado: boolean, setCarregado: any, orderID: number, setOrderID: any) => {
 
        return (
            <OverlayTrigger key={order._id}
                overlay={
                    <Tooltip id={order._id}>
                        {order._user.substring(0, 8)}...{order._user ? order._user.substring(order._user.length - 4, order._user.length) : undefined}
                    </Tooltip>
                } >
                <tr key={order._id} className="order-book-order" title={order._id} >

                    <td>{order._id}</td>
                    <td>{order.tokenAmount}</td>

                    <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
                    <td>{order.etherAmount}</td>

                    <td style={{ fontSize: "12px" }}> {order.formattedTimestamp}</td>

                    <td>{ order._user !== dados.account && order._id !== orderID && (
                        <Button className='btn btn-sm' onClick={(e) => {
                            setCarregado(false)
                            setOrderID(order._id )
                            fillOrder(order, dados, events, setCarregado, setOrderID)
                        }
                        }>{order.orderFillAction}</Button>
                        )}
                        {  (order._id === orderID ) &&  !carregado && (
                            <div>...</div>
                        )}
                    </td>
                </tr>
            </OverlayTrigger>
        )
 
}

const showOrderBook = (dados: any, events: IEvents) => {

    const { orderBook, tokenName, token } = dados;
    const [carregado, setCarregado] = useState<boolean>(true)
    const [orderID, setOrderID] = useState<number>(0)

    return (
        <tbody key={token.options.address}>
            {orderBook.sellOrders.map((order: any) => renderOrder(order, dados, events, carregado, setCarregado,orderID, setOrderID))}
            <tr>
                <th>ID</th>
                <th>{tokenName}</th>
                <th title='Preço'>{tokenName}/ETH</th>
                <th>ETH</th>
                <th>Data/hora</th>
                <th>Opçao</th>
            </tr>
            {orderBook.buyOrders.map((order: any) => renderOrder(order, dados, events, carregado, setCarregado, orderID, setOrderID))}


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
