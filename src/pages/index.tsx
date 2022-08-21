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
import Stack from './Stack';
import StakeTime from './StakeTime';


export interface INav {
  web3: any;
  account: string;
  staking: any;
  exchange: any;
  token: any;
  admin: boolean;
  carregado: boolean;
  content: string;
}
const iniNav = {
  web3: {},
  account: "",
  staking: null,
  exchange: null,
  token: null,
  admin: false,
  carregado: false,
  content: "<Principal/> "
}

const Home = () => {
  const [account, setAccount] = useState<String>()

  const [nav, setNav] = useState<INav>(iniNav)
  useEffect(() => {
    loadWallet()

  }, [])

  async function loadWallet() {
    const web3: Web3 = loadWeb3()

    const account: any = await loadAccount(web3)
    const [exchange]: any = await loadExchange(web3)
    let admin = await isAdmin(exchange, account[0])
    setNav({ ...nav, account: account[0] })
    setNav({ ...nav, admin: admin })
    setNav({ ...nav, carregado: true })
    setNav({ ...nav, content: "Dex" })
    setNav({
      web3: web3,
      account: account[0],
      token: null,
      exchange: null,
      staking: null,
      admin: admin,
      carregado: true,
      content: "Dex"
    })
  }


  return (
    <div >
      <main  >
        <Navigator nav={nav} setNav={setNav} />
        {nav.content === 'Dex' && nav.carregado === true ? <Principal nav={nav} setNav={setNav} /> : null}
        {nav.content === 'Stake' && nav.carregado === true ? <Stack nav={nav} setNav={setNav} /> : null}
        {nav.content === 'StakeTime' && nav.carregado === true ? <StakeTime nav={nav} setNav={setNav} /> : null}

      </main>
    </div>


  )
}

export default Home
