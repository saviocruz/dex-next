import React from 'react'

import Spinner from './Spinner'
import { Tabs, Tab } from 'react-bootstrap'
import { cancelOrder } from '../store/interactions/orders'
import { IProp } from './lib/type'

const showMyFilledOrders = (props: IProp) => {
  
  const { myFilledOrders, account } = props
   return (
    <tbody>
      {myFilledOrders.map((order: any) => {
        return (
          <tr key={order._id} >
            <td className={`text-${order.orderTypeClass}`}>
              {order._user === account && (<span>D </span> )}
              {order._userFill === account && (<span>P </span> )}
              {order._id}
            </td>
            
            <td className={`text-${order.orderTypeClass}`}>{order.orderSign}{order.tokenAmount}</td>
            <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
            <td className="text-muted">{order.formattedTimestamp}</td>
            <td className="text-muted">
              <span title={order._user}> D </span>
              <span title={order._userFill}> P </span>
            </td>

          </tr>
        )
      })}
    </tbody>
  )
}

const showMyOpenOrders = (props: IProp, updateDados: any) => {
  const { myOpenOrders,  exchange, token, account } = props
 
  return (
    <tbody>
      {myOpenOrders.map((order: any) => {
        return (
          <tr key={order._id} title={order._user}>
            <td className={`text-${order.orderTypeClass}`}>{order._id}</td>
            <td className={`text-${order.orderTypeClass}`}>{order.tokenAmount}</td>
            <td className={`text-${order.orderTypeClass}`}>{order.tokenPrice}</td>
            <td className="text-muted">{order.formattedTimestamp}</td>
            <td style={{color: "black"}}
              className="cancel-order"
              onClick={(e) => {
                cancelOrder(exchange, token, order, account, props, updateDados)
              }}
            >&#8864;</td>
          </tr>
        )
      })}
    </tbody>
  )
}


interface Props {
  dados: IProp;
  updateDados: any;
}

const MyTransactions = ({ dados, updateDados }: Props) => {

  return (
    <div className="card bg-transparent text-white">
      <div className="card-header">
        Minhas Transações
      </div>
      <div className="card-body">
        <Tabs defaultActiveKey="trades" className="text-white tabs">
          <Tab eventKey="trades" title="Trade" className="bg-transparent tabs">
            <table className="table bg-transparent text-white table-sm small">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>
                    {dados.tokenName}
                  </th>
                  <th>{dados.tokenName}/ETH</th>
                  <th>Time</th>
                </tr>
              </thead> 
              {dados.showMyFilledOrders ? showMyFilledOrders(dados) : <Spinner type="table" />}
            </table>
          </Tab>
          <Tab eventKey="orders" title="Orders" className="text-white tabs">
            <table className="table bg-transparent text-white table-sm small">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Amount</th>
                  <th>{dados.tokenName}/ETH</th>
                  <th>Cancel</th>
                </tr>
              </thead>
              {showMyOpenOrders ? showMyOpenOrders(dados, updateDados) : <Spinner type="table" />}
            </table>
          </Tab>
        </Tabs>
      </div>
    </div>
  )

}

/*
function mapStateToProps(state) {
  const myOpenOrdersLoaded = myOpenOrdersLoadedSelector(state)
  const orderCancelling = orderCancellingSelector(state)

  return {
    myFilledOrders: myFilledOrdersSelector(state),
    showMyFilledOrders: myFilledOrdersLoadedSelector(state),
    myOpenOrders: myOpenOrdersSelector(state),
    showMyOpenOrders: myOpenOrdersLoaded && !orderCancelling,
    exchange: exchangeSelector(state),
    account: accountSelector(state),
    symbol: tokenSymbolLoadedSelector(state),


  }
}
*/
export default  MyTransactions;










