import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import Content from './Content';
import Admin from './Admin';
import Mensagem, { estadoInicialMensagem, IMensagem } from './Mensagem';

import { loadExchange, loadPairs, loadToken } from './lib/loadContrats';
import { loadAccount, loadWeb3 } from './lib/web3';
import { loadAvailableTokens } from './lib/contracts';;
import { loadOrders,  priceChartSelector } from '../store/interactions/orders';
import { loadBalances } from '../store/interactions/contracts';
import { estadoInicialNFT, IEvents, inicialEvents, IProp } from './lib/type';
import Spinner from './Spinner';
import Stack from './Stack';
 

const Principal = ({nav, setDados }: any) => {
	const [carregado, setCarregado] = useState(false)
	const [account, setAccount] = useState<String>()
	const [dados, updateDados] = useState<IProp>(estadoInicialNFT);
	const [events, setEvents] = useState<IEvents>(inicialEvents);

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
		console.log('pairs adrres: ' )
		const [pairsContract]: any = await loadPairs(web3)
		const tokenPairs: any = await loadAvailableTokens(web3, pairsContract)
		const tokenName: string = await dados.token.methods.symbol().call()

		const [orders, filledOrders, myOrders, myFilledOrders] = await loadOrders(exchangeContract, dados.token, account)

		const [etherBalance, exchangeEtherBalance, tokenBalance, exchangeTokenBalance] = await loadBalances(web3, exchangeContract, dados.token, account);

		const priceChart: any = await priceChartSelector(filledOrders)

		dados.etherBalance = etherBalance
		dados.exchangeEtherBalance = exchangeEtherBalance
		dados.tokenBalance = tokenBalance
		dados.exchangeTokenBalance = exchangeTokenBalance

		dados.account = account
		dados.web3 = web3
		dados.exchange = exchangeContract
		dados.pairs = pairsContract
		dados.tokenName = tokenName;
		dados.tokenPairs = tokenPairs

		dados.orderBook = orders
		dados.myFilledOrders = myFilledOrders
		dados.myOpenOrders = myOrders
		dados.filledOrders = filledOrders

		dados.priceChart = priceChart
 
		updateDados(dados)
		setCarregado(true)
		let event: IEvents = { updateDados: updateDados, setResult: setResult, setShow: setShow,  setCarregado: setCarregado }
		setEvents(event)
	}


	return (
		<>
			{(dados.showAdmin) ? <Admin dados={dados} events={events} /> :<div> <Spinner type="table" /> Verificando Admin</div>}
			{nav.content === 'Dex' && carregado ? <Content dados={dados} events={events} /> : <div>  <Spinner /> Carregando plataforma</div> }
			{nav.content === 'Stack' &&   carregado === true? <Stack dados={dados} events={events} /> : null}

			<Mensagem msg={result.msg} desc={result.desc} gas={result.gas} show={show} setShow={setShow} setCarregado={result.setCarregado} data={dados} />
		</ >
	);
}
export default Principal;

