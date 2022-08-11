import React from 'react'
import { IEvents, IProp   } from './lib/type'
import Spinner from './Spinner'

const showFilledOrders = (filledOrders: any) => {
    console.log(filledOrders)
    return (
        <tbody>
            {filledOrders.map((order: any) => {
                return (
                    <tr className={`order-${order._id}`} key={order._id}>
                        <td className="text-muted">{order._id}</td> 
                        <td className="text-muted">{order.tokenAmount}</td> 
                        <td className={`text-${order.tokenPriceClass}`}>{order.tokenPrice}</td>
                        <td className="text-muted">{order.formattedTimestamp}</td>
                    </tr>
                )
            })}
        </tbody>
    )

}


interface Props {
    dados: IProp;
    events: IEvents;
}

const Trades = ({ dados, events }: Props) => {
    const { tokenName, filledOrders } = dados

    return (
        <div className="vertical">
            <div className="card bg-transparent text-white">
                <div className="card-header">
                    Trades
                </div>
                <div className="card-body">
                    <table className="table bg-transparent  table-sm small">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>{tokenName}</th>
                                <th>{tokenName}/ETH</th>
                                <th>Time</th>
                            </tr>
                        </thead>
                        {showFilledOrders(filledOrders)  }

                    </table>
                </div>
            </div>
        </div>

    )
}

export default Trades;
