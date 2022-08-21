import React, { useState, useEffect } from "react";
//import connectToWallet from "./getWeb3";

import StakerContract from "../abis/Staker.json";
import ERC20ABI from "./ERC20ABI.json";
import BlockchainContext from "../context/BlockchainContext";
import DisplayContext from "../context/DisplayContext";

import NavBar from "../components/NavBar";
import AdminPanel from "../components/AdminPanel";
import UserPanel from "../components/UserPanel";

import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner'
import { AbiItem } from 'web3-utils';



import { loadAccount} from "./lib/web3";
import { loadStakerContract } from "./lib/loadContrats";
import { INav } from ".";


interface Props {
  nav: INav;
  setNav: any;
}

const StackTime = ({ nav, setNav }: Props) => {
  const { web3 } = nav
  const [accounts, setAccounts] = useState<any>();
  const [stakerContract, setStakerContract] = useState<any | undefined>(undefined);
  const [depositTokenContract, setDepositTokenContract] = useState<any | undefined>(undefined);
  const [rewardTokenContract, setRewardTokenContract] = useState<any | undefined>(undefined);

  const [userDetails, setUserDetails] = useState({});
  const [owner, setOwner] = useState<string>();

  const [isGlobalLoading, setIsGlobalLoading] = useState(true);
  const [isConnectingToWallet, setIsConnectingToWallet] = useState(false);

  useEffect(() => {
    loadWallet()


  }, []);

  async function loadWallet() {
    setIsGlobalLoading(false);


    const account: any = await loadAccount(web3)
    setAccounts(account)
    
    initConnection()
    const load = async () => {
      await refreshUserDetails();
    }

    if (typeof  web3 !== 'undefined'
      && typeof accounts !== 'undefined'
      && typeof stakerContract !== 'undefined'
      && typeof depositTokenContract !== 'undefined'
      && typeof rewardTokenContract !== 'undefined') {
      load();
    }

  }


  async function initConnection() {
    try {
      // Get network provider and web3 instance.
      setIsConnectingToWallet(true);

      setIsGlobalLoading(true);
      // Use web3 to get the user's accounts.
      const accounts: any = await loadAccount(web3);
      console.log(accounts[0])
      const [instance]: any = await loadStakerContract(web3)
 
      const depositTokenAddr = await instance.methods.depositToken().call();
      const depositContract = new web3.eth.Contract(ERC20ABI as unknown as AbiItem, depositTokenAddr);

      console.log(depositTokenAddr)
     // console.log(depositContract)

      const rewardTokenAddr = await instance.methods.rewardToken().call({ from: accounts[0] });
      console.log(rewardTokenAddr)

      const rewardContract = new web3.eth.Contract(ERC20ABI as unknown as AbiItem, rewardTokenAddr);

      setOwner(await instance.methods.owner().call({ from: accounts[0] }));
      setAccounts(accounts);
      setStakerContract(instance);
      setDepositTokenContract(depositContract);
      setRewardTokenContract(rewardContract);
      ///console.log(depositContract)

      window.ethereum.on('accountsChanged', function (_accounts: any) {
        if (_accounts.length === 0) {
          setAccounts(null);
          //setWeb3(undefined);
        }
        else {
          setAccounts(_accounts);
        }
      });

    } catch (error: any) {
      // Catch any errors for any of the above operations.
      console.error(error);
      if (error.code === 4001) {
        // User denied access to wallet
        return;
      }
      if (error.toString().includes("This contract object doesn't have address set yet")) {
        toast.error("Error: can't load contract. Are you on the right network?");
        console.error(error);
        return;
      }
      alert("Error: can't load web3 connection. Please check console.");
      console.error(error);

    } finally {
      setIsGlobalLoading(false);
      setIsConnectingToWallet(false);
    }
  }


   

  async function refreshUserDetails( ) {
    setIsGlobalLoading(true);
    let res = await stakerContract.methods.getFrontendView().call({ from: accounts[0] });
    let depBalance = await depositTokenContract.methods.balanceOf(accounts[0]).call({ from: accounts[0] });
    let rewardBalance = await rewardTokenContract.methods.balanceOf(accounts[0]).call({ from: accounts[0] });
    let depSymbol = await depositTokenContract.methods.symbol().call({ from: accounts[0] });
    let rewSymbol = await rewardTokenContract.methods.symbol().call({ from: accounts[0] });

    let parsed = {
      rewardPerDay: (res["_rewardPerSecond"] * 24 * 60 * 60 / (10 ** 18))
      , daysLeft: (res["_secondsLeft"] / 60 / 60 / 24)
      , deposited: web3.utils.fromWei(res["_deposited"])
      , pending: web3.utils.fromWei(res["_pending"])
      , depositTokenBalance: web3.utils.fromWei(depBalance)
      , rewardTokenBalance: web3.utils.fromWei(rewardBalance)
      , depSymbol: depSymbol
      , rewSymbol: rewSymbol
    }

    setUserDetails(parsed);
    setIsGlobalLoading(false);
  }

  function onInputNumberChange(e: any, f: any) {
    const re = new RegExp('^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$')
    if (e.target.value === '' || re.test(e.target.value)) {
      f(e.target.value);
    }
  }

  function isNonZeroNumber(_input: any) {
    return _input !== undefined && _input !== "" && parseFloat(_input) !== 0.0;
  }

  const MainView = () => (
    <>
      <br />
      <div style={{ display: 'flex' }}>
        <UserPanel />
        {(accounts && accounts[0].toLowerCase() === owner?.toLowerCase()) ? <AdminPanel /> : undefined}
      </div>
    </>
  );

  const MainViewOrConnectView = (web3: any) => (
    <>
      {web3 ? <MainView /> : <div><br /><Button onClick={initConnection} disabled={isConnectingToWallet} >Connect</Button></div>}
    </>
  )

  const LoadingView = () => (
    <>
      <br />
      Carregando...
      <br /><br />
      <Spinner animation="border" variant="light" />
    </>
  )

  return (
    <div className="outerApp">
      <BlockchainContext.Provider value={{ web3, accounts, stakerContract, rewardTokenContract, depositTokenContract }}>
        <DisplayContext.Provider value={{ userDetails, refreshUserDetails, onInputNumberChange, isNonZeroNumber, toast }}>
          <NavBar />
          <div className="App">
            {isGlobalLoading ? <LoadingView /> : <MainViewOrConnectView web3={web3} />}
          </div>
        </DisplayContext.Provider>
      </BlockchainContext.Provider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        transition={Slide}
      />
    </div>

  )
}

export default StackTime;
