import React, { useEffect, useState } from 'react'
import Spinner from './Spinner'

import { getResult, loadStackData, stackToken, unStackToken } from '../store/interactions/stacking'
import { loadStacking } from './lib/loadContrats'
import { INav } from './lib/type'
 

const showStack = (nav: INav, stackes: any, setStackes: any, stackAmount: any, setStackAmount: any) => {
    const { web3,  staking, account } = nav
    return (
        <div className="container text-center" >

            {stackes?.map((stack: any, index: number) => {
                return (
                    <div
                        key={index}
                        className="text-right stacking-pool"
                    >
                        <div className="stacking-head">
                            <h6> {stack.name} ({stack.symbol}) </h6>
                        </div>
                        <div className="stacking-cardbg">

                            <table className="table bg-transparent   table-sm small">
                                <tbody>
                                    <tr>
                                        <td> Token {web3.utils.fromWei(stack.saldo, 'ether')} ({stack.symbol}) </td>
                                    </tr>
                                    <tr>
                                        <td> Ganhos {web3.utils.fromWei(stack.saldoid, 'ether')}   ID</td>
                                    </tr>
                                    <tr>
                                        <td> Pool {web3.utils.fromWei(stack.saldoPool, 'ether')}  ID</td>
                                    </tr>
                                    <tr>
                                        <td>Staked {web3.utils.fromWei(stack.stacked, 'ether')} ({stack.symbol})</td>
                                    </tr>
                                    <tr>
                                        <td>Pool Total : {web3.utils.fromWei(stack.supply, 'ether')} ({stack.symbol}) </td>
                                    </tr>
                                </tbody>
                            </table>

                            <form onSubmit={(event) => {
                                event.preventDefault()
                                stackToken(nav, stack.tokenStack, stackAmount, index-1, setStackes)
                            }}>
                                <div className="stack-form">
                                    <div className="stack-pending">{parseFloat(web3.utils.fromWei(stack.pending, 'kwei')).toFixed(3)}</div>

                                    <div className="stack-input">
                                        <input
                                            type="number"
                                            min="0.000000000000000001"
                                            step="0.000000000000000001"
                                            placeholder="Amount to stake"
                                            onChange={(e) => setStackAmount((e.target.value))}
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
                                                unStackToken(nav, stack.tokenStack, stackAmount, index, setStackes)
                                            }
                                            }>Unstake</button>
                                    </div>
                                    <div className="stack-btn">
                                        <button className="btn btn-primary btn-block btn-sm btn-custom "
                                            onClick={(event) => {
                                                event.preventDefault()
                                                getResult( staking, account, index, web3)
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
    nav: INav;
    setNav: any;
}

const Stack = ({ nav, setNav }: Props) => {

    //  const [stacking, setStacking] = useState<any>();
    const [stackAmount, setStackAmount] = useState<number>(0);
    const { web3, account } = nav;
    const [stakes, setStakes] = useState<any>()

    useEffect(() => {
        loadWallet()
    }, [])

    async function loadWallet() {
       // const { web3, account } = nav;
        const [staking]: any = await loadStacking(web3)
        const stacks: any = await loadStackData(web3, staking, account)
        console.log(stacks)
        nav.staking = staking
        setNav({...nav, staking: staking})
        setStakes(stacks)
        console.log(stacks)
    }

    return (
        <div>
            {stakes?.length > 0 ? showStack(nav, stakes, setStakes, stackAmount, setStackAmount) : <Spinner type="tbl"/>}
        </div>
    )

}

export default Stack