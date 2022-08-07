import React, { useEffect, useState } from 'react';

import Web3 from 'web3';
import { loadExchange, loadPairs, loadToken } from './lib/loadContrats';
import { loadAccount, loadWeb3 } from './lib/web3';
 
import Content  from './Content';
import Navbar  from './Navbar';

import { loadAvailableTokens   } from   './lib/contracts';;
import { loadAllOrders, loadOrders, myFilledOrdersSelector, myTotalOpenOrdersSelector, openOrders, orderBookSelector } from '../store/interactions/orders';
import { loadBalances } from '../store/interactions/contracts';
import { estadoInicialNFT, IEvents, IProp } from './lib/type';
import Mensagem, { estadoInicialMensagem, IMensagem } from './Mensagem';
import Admin from './Admin';

const Principal = () => {
	const [carregado, setCarregado] = useState(false)
	const [account, setAccount] = useState<String>()
	const [dados, updateDados] = useState<IProp>(estadoInicialNFT);
	const [events, setEvents] = useState<IEvents>();

	const [result, setResult] = useState<IMensagem>(estadoInicialMensagem);
	const [show, setShow] = useState(false);

	useEffect(() => {
		loadWallet()
		window.ethereum.on('accountsChanged', function (account: any) {
      window.location.reload();
    })
    window.ethereum.on('networkChanged', function (account: any) {
      window.location.reload();
    })
	}, [])

	async function loadWallet() {
		const web3: Web3 = loadWeb3()

		const account: any = await loadAccount(web3)
		setAccount(account[0])
		const [tokenContract]: any = await loadToken(web3)
		dados.token = tokenContract
		loadNFTs(account[0])
	}

	
	async function loadNFTs(account: any) {
		const web3: Web3 = loadWeb3()
 
		const [exchangeContract]: any = await loadExchange(web3)
		//const [tokenContract]: any = await loadToken(web3)
		const [pairsContract]: any = await loadPairs(web3)
		const tokenPairs: any = await loadAvailableTokens(web3, pairsContract)
		const tokenName: string = await    dados.token.methods.symbol().call() 
	 
		const [orders, myOrders, myFilledOrders] = await loadOrders(exchangeContract, dados.token, account )
	//	console.log(myFilledOrders)
	//	console.log(dados.token)
		const [etherBalance, exchangeEtherBalance, tokenBalance, exchangeTokenBalance] = await loadBalances(web3, exchangeContract, dados.token , account);

		dados.etherBalance = etherBalance 
		dados.exchangeEtherBalance = exchangeEtherBalance 
		dados.tokenBalance = tokenBalance  
		dados.exchangeTokenBalance = exchangeTokenBalance 

		dados.account = account  
		dados.web3 = web3
		dados.exchange = exchangeContract
		//dados.token = tokenContract
		dados.pairs = pairsContract
		dados.tokenName = tokenName;

		dados.orderBook = orders
		dados.myFilledOrders = myFilledOrders
		dados.myOpenOrders = myOrders

		dados.tokenPairs = tokenPairs
		updateDados(dados)
		setCarregado(true)
		let event = {updateDados: updateDados,setResult: setResult, setShow: setShow }
		setEvents(event)
	}

	const atualiza = async (dados: IProp) =>{
		 
		const [etherBalance, exchangeEtherBalance, tokenBalance, exchangeTokenBalance] =  await loadBalances(dados.web3, dados.exchange , dados.token , dados.account);
		dados.tokenBalance = tokenBalance;
    dados.exchangeTokenBalance = exchangeTokenBalance;
    updateDados({...dados,[tokenBalance]: tokenBalance} ) 
    updateDados({...dados,[exchangeTokenBalance]: exchangeTokenBalance} ) 
		console.log(dados)
	}
	return (
		<div>
			<Navbar dados={dados} updateDados={atualiza} />
			<Admin dados={dados} events={events} />
			{carregado ? <Content dados={dados}  events={events}/> : <div className="content">Carregando plataforma</div>}

			<Mensagem msg={result.msg} desc={result.desc} gas={result.gas} show={show}  setShow={setShow}/>
		</div>
	);  
} 
export default Principal;
 
