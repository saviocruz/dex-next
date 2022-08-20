import React from 'react';
import {Dropdown} from 'react-bootstrap';

import {  loadBalances, updateForm } from '../store/interactions/contracts';
import { loadOrders } from '../store/interactions/orders';
import { loadTokenAddress } from './lib/loadContrats';

import { IEvents, IProp } from './lib/type';

const selectPairToken = async (tokenAddress: any, dados: IProp, updateDados: any) => {
    const {web3,  exchange , account } = dados
    const [token]: any = await loadTokenAddress(web3, tokenAddress[0]);
    
    console.log(token)
    if (!token) {
        alert('Token not loaded, please load a network with token');
    }
 
    const [orders, filledOrders, myOrders, myFilledOrders] = await loadOrders(exchange, token, account )

    const [etherBalance, exchangeEtherBalance, tokenBalance, exchangeTokenBalance] = await loadBalances(web3, exchange , token , account);
    dados.tokenName = tokenAddress[1]
    dados.token = token

    dados.orderBook = orders
    dados.myFilledOrders = myFilledOrders
    dados.myOpenOrders = myOrders
    dados.filledOrders = filledOrders

    console.log(etherBalance, exchangeEtherBalance, tokenBalance, exchangeTokenBalance) 
    
    
    dados = updateForm([etherBalance, exchangeEtherBalance, tokenBalance, exchangeTokenBalance] , dados)
     updateDados({...dados, etherBalance: etherBalance}) 
    updateDados({...dados, tokenBalance: tokenBalance}) 
    updateDados({...dados, exchangeTokenBalance: exchangeTokenBalance}) 

     console.log(dados)
}

const renderMenuItem = (token: any, dados: any, updateDados: any, key: any) => {
    const {web3, exchange, account} = dados;
    return (
        <Dropdown.Item key={key} onClick={(e) => selectPairToken(token,  dados, updateDados)} >{token[1]}/ETH</Dropdown.Item>
    )
}

interface Props {
    dados: IProp;
    events: IEvents;
}
const Navbar = ({ dados, events }: Props) => {

        return (
          
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item" title='{dados.account}'>
                    <Dropdown>
                        <Dropdown.Toggle size="sm" id="dropdown-basic">
                            {dados.tokenName}/ETH
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {dados.tokenPairs?.map((token: any, key: any) => renderMenuItem(token,  dados, events.updateDados, key))}
                        </Dropdown.Menu>
                    </Dropdown>
                    </li>
                    
                </ul>
            </nav>
          
        );
  
}
 

export default  Navbar;
 