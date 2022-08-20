import React, { Component, useEffect, useState } from 'react'
 
import Spinner from './Spinner'
 
 
import { IEvents, IProp } from './lib/type'
import {  getResult, stackToken, unStackToken } from '../store/interactions/stacking'
 
const showStack = (dados: IProp, events: IEvents, stacking: any, stacks:any, stackAmount:any, setStackAmount: any) => {
    const {web3,  myOpenOrders, exchange, token, account } = dados
    
    return (
        <div className="container text-center" >
           

            {stacks.map((stack: any, index: number) => {
                return (
                    <div
                        key={index}
                        className="text-white text-right stacking-pool"
                    >
                        <div className="stacking-head">
                            <h6> {stack.name} ({stack.symbol}) </h6>
                        </div>
                        <div className="stacking-cardbg">

                            <table className="table bg-transparent text-white table-sm small">
                                <tbody>
                                    <tr>
                                        <td>You have {web3.utils.fromWei(stack.stacked, 'ether')} ({stack.symbol}) Staked</td>
                                    </tr>
                                    <tr>
                                        <td>Pool Supply : {web3.utils.fromWei(stack.supply, 'ether')} ({stack.symbol}) </td>
                                    </tr>
                                </tbody>
                            </table>

                            <form onSubmit={(event) => {
                                event.preventDefault()
                                stackToken(stacking, stack.tokenStack, account, stackAmount, index, web3, events)
                            }}>
                                <div className="stack-form">
                                    <div className="stack-pending">{parseFloat(web3.utils.fromWei(stack.pending, 'kwei')).toFixed(3)}</div>
 
                                    <div className="stack-input">
                                        <input
                                            type="number"
                                            min="0.000000000000000001"
                                            step="0.000000000000000001"
                                            placeholder="Amount to stake"
                                            onChange={(e) => setStackAmount( (e.target.value))}
                                            className="form-control form-control-sm "
                                            required
                                        />
                                    </div>

                                    <br />
                                </div>

                                <div className="stack-control">
                                    <div className="stack-btn">
                                        <button type="submit" className="btn btn-primary btn-block btn-sm btn-custom ">Stake</button>
                                    </div>
                                    <div className="stack-btn">
                                        <button className="btn btn-primary btn-block btn-sm btn-custom "
                                            onClick={(event) => {
                                                event.preventDefault()
                                                unStackToken(stacking, account, stackAmount, index, web3)
                                            }
                                            }>Unstake</button>
                                    </div>
                                    <div className="stack-btn">
                                    <button className="btn btn-primary btn-block btn-sm btn-custom "
                                            onClick={(event) => {
                                                event.preventDefault()
                                                getResult(stacking, account, index, web3)
                                            }
                                            }>supply</button>
</div>
                                </div>

                            </form>
                        </div>
                    </div>
                )
            }

            )}


        </div>
    )

}


interface Props {
    dados: IProp;
    events: IEvents;
}



const Stack = ({ dados, events }: Props) => {

    const [myOrders, setMyOrders] = useState<any>();
  //  const [stacking, setStacking] = useState<any>();
     const [stackAmount, setStackAmount] = useState<number>(0);
     const { web3, account, stacks , stacking} = dados;
    useEffect(() => {
        loadWallet()
    }, [])
 

    async function loadWallet() {
        //   console.log(dados)
        

      // let stacking = await loadStacking(web3)
     //   console.log(stacking)
       //  const stacking: any = await loadStackData(dados.stacks,  account)
     //   console.log(stack)
      //  let stackAmount =0 
    //    setStacking(stacking)
       //  setStackAmount(stackAmount)
        
/*
        const [exchangeContract]: any = await loadExchange(web3)
        const [tokenContract]: any = await loadToken(web3)

        const [cancelledOrders, cancelledOrdersOnToken, filledOrders, filledOrdersOnToken, allOrders, allOrdersOnToken]: any =
            await loadAllOrders(exchangeContract, tokenContract);

        let orders: any = openOrders(allOrders, filledOrders, cancelledOrders);
        const myOrdes: any = myTotalOpenOrdersSelector(account, orders);
        setMyOrders(myOrdes)
*/
    }
    
    return (
        <div>
            { true ? showStack(dados, events, dados.stacking, dados.stacks, stackAmount, setStackAmount ) : <Spinner />}

        </div>
    )

}
/*
function mapStateToProps(state) {
    return {
        account: accountSelector(state),
        stacking: stackingSelector(state),
        stacks: stacksSelector(state),
        stackAmount: stackAmountSelector(state),
        web3: web3Selector(state)
    }
   
} */
export default Stack