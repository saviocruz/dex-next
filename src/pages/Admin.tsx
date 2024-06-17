import React, { Component, useState } from 'react';
import { queryRegisterToken, registerToken } from '../store/interactions/contracts';

import { IProp, IEvents, INav, iniNav } from './lib/type';


const showData = (dados: IProp, rtoken: any) => {
    const { token } = dados

    return (

        <div className="col-12 col-sm-auto pl-sm-0 admin">
            <table className="table table-sm small"> 
                <tbody>
                    <tr>
                        <td className="text-right">Name:</td>
                        <td className="text-left">{rtoken?.name}</td>
                    </tr>
                    <tr>
                        <td className="text-right">Symbol:</td>
                        <td className="text-left">{rtoken?.symbol}</td>
                    </tr>
                    <tr>
                        <td className="text-right">Total Supply:</td>
                        <td className="text-left">{rtoken?.decimals > 0 ? rtoken?.totalSupply / (10 ** rtoken?.decimals) : 0}</td>
                    </tr>
                    <tr>
                        <td className="text-right">View on Etherscan:</td>
                        <td className="text-left"><a target="_blank" rel="noopener noreferrer" href={`https://etherscan.io/address/${rtoken?.address}`}>{rtoken?.address}</a></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )

}
interface Props {
    dados: IProp;
    events: IEvents;

}

const Admin = ({ dados, events}: Props) => {
    const [rtoken, setRtoken] = useState<any>()
    let navLocal: INav =iniNav
    navLocal.showAdmin = false;
    const buyOrderOnSubmit = async (e: any) => {
        e.preventDefault();
        let data: any = await queryRegisterToken(dados.web3, e.target.value);
        setRtoken(data)
    }

    return (
        <div className='popup'>  
            <div className='popupinner container '>
                <h4 className="underline">Administration Panel</h4>
                <h6>Token Registration</h6>
                {true ?
                    showData(dados, rtoken) : null}
                <div className='admin'>
                    <form className="row" onSubmit={(event) => {
                        event.preventDefault()
                        registerToken(dados.pairs, dados.exchange, dados.account, rtoken.address)


                    }}>
                        <div className="col-12 col-sm pr-sm-2">
                            <input
                                type="text"
                                min="42"
                                max="42"
                                placeholder='Contract Address'
                                // we check token info
                                onChange={(e: any) => buyOrderOnSubmit(e)}
                                className="form-control form-control-sm bg-transparent"
                                required
                            />
                        </div>
                        <div className="col-12 col-sm-auto pl-sm-0">
                            <button type="submit" className="btn btn-primary btn-block btn-sm btn-custom">Register Token</button>
                        </div>
                    </form>
     
              Admin
                    <button
                        className="btn btn-primary btn-block btn-sm btn-custom"
                        onClick={() => {events.setNav({...navLocal,showAdmin:false})}}  >Fechar</button>
                </div>
 
        </div>
        </div>
    )
}



/*
  function mapStateToProps(state){
     const showit = rTokenLoadedSelector(state)
      return { 
       rtokenLoaded: showit,   
       rtoken: rTokenSelector(state),
       exchange: exchangeSelector(state),
       account: accountSelector(state),
       web3: web3Selector(state),
      }
    }
    */
export default Admin;