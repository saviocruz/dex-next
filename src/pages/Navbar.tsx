import React from 'react';
import {Dropdown} from 'react-bootstrap';
 
//import {loadAccount, loadWeb3} from   './lib/web3';
//import {  loadPairs, exchangeSelector} from '../store/interactions/contracts'; 
import {  loadBalances, updateForm } from '../store/interactions/contracts';
import { loadAllOrders, loadOrders, myTotalOpenOrdersSelector, openOrders, orderBookSelector } from '../store/interactions/orders';
import { loadToken, loadPairs, loadExchange, loadTokenAddress } from './lib/loadContrats';
import {loadTokenName,} from '../store/interactions/contracts'; 

import { IProp } from './lib/type';

const selectPairToken = async (tokenAddress: any, web3: any, exchange: any, account: any, dados: IProp, updateDados: any) => {
    const [token]: any = await loadTokenAddress(web3, tokenAddress[0]);
    console.log(token)
    if (!token) {
        alert('Token not loaded, please load a network with token');
    }
 
    const [orders, myOrders, myFilledOrders] = await loadOrders(exchange, token, account )

    const [etherBalance, exchangeEtherBalance, tokenBalance, exchangeTokenBalance] = await loadBalances(web3, exchange , token , account);
    dados.tokenName = tokenAddress[1]
    dados.token = token

    dados.myOpenOrders = myOrders;
    dados.orderBook = orders;
    dados.myFilledOrders = myFilledOrders;
    console.log(dados) 
    
    let hash = [etherBalance, exchangeEtherBalance, tokenBalance, exchangeTokenBalance]
    dados = updateForm(hash, dados)
    updateDados(dados) 
}

const renderMenuItem = (token: any, props: any, updateDados: any, key: any) => {
    const {web3, exchange, account} = props;
    return (
        <Dropdown.Item key={key} onClick={(e) => selectPairToken(token, web3, exchange, account, props, updateDados)} >{token[1]}/ETH</Dropdown.Item>
    )
}

interface Props {
    dados: IProp;
    updateDados: any;
}
const Navbar = ({ dados, updateDados }: Props) => {
 
 
        return (
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
                <a className="navbar-brand" href="/#">Dex</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                    <Dropdown>
                        <Dropdown.Toggle size="sm" id="dropdown-basic">
                            {dados.tokenName}/ETH
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {dados.tokenPairs?.map((token: any, key: anny) => renderMenuItem(token,  dados, updateDados, key))}

                        </Dropdown.Menu>
                    </Dropdown>
                    </li>
                    <li className="nav-item">
                        <a 
                            className="nav-link small"
                            href={'https://etherscan.io/address/' +  dados.account}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            { dados.account}
                        </a>
                    </li>
                </ul>
            </nav>
        );
  
}
 

export default  Navbar;
 