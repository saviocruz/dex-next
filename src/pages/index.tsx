import Head from 'next/head'
import styles from '../styles/Home.module.css'
import 'bootstrap/dist/css/bootstrap.css';
import Principal from './Principal'
import Navigator from './Navigator';
import { useEffect, useState } from 'react';
import { loadAccount, loadWeb3 } from './lib/web3';
import Web3 from 'web3';
import { isAdmin } from './lib/contracts';
import { loadExchange } from './lib/loadContrats';
import { Spinner } from 'react-bootstrap';

export interface INav {
  account: string;
  admin: boolean;
  carregado: boolean;
}
const nav = {
  account: "",
  admin: false,
  carregado: false,
}

const Home = () => {
  const [account, setAccount] = useState<String>()
  const [admin, setAdmin] = useState<boolean>(false)
  const [carregado, setCarregado] = useState<boolean>(false)
  const [dados, setDados] = useState<INav>(nav)
  useEffect(() => {
    loadWallet()

  }, [])

  async function loadWallet() {
    const web3: Web3 = loadWeb3()

    const account: any = await loadAccount(web3)
    const [exchange]: any = await loadExchange(web3)
    let admin = await isAdmin(exchange, account[0])
 
    setDados ({  account: account[0],
            admin: admin,
            carregado: true,})
  

  }

  return (

    <div >
      <main  >
        <Navigator dados={dados} />
    
        {dados.carregado === true?  <Principal />  : <Spinner animation={'border'}   />}
      </main>
      

    </div>
  )
}

export default Home
