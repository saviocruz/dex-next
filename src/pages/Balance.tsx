import React, {  useEffect, useState } from 'react';
import { Tabs, Tab, Button } from 'react-bootstrap';
import Spinner from './Spinner';

import { loadBalances, depositEther, withdrawEther, depositToken, withdrawToken, loadEtherBalances, atualiza } from '../store/interactions/contracts';
import BalanceForm from './BalanceForm';
import BalanceTable from './BalanceTable';
import { Modal } from 'react-bootstrap';
import { loadAllOrders, myTotalOpenOrdersSelector, openOrders } from '../store/interactions/orders';
import { loadExchange, loadToken } from './lib/loadContrats';
import { estadoInicial, IPropBalance, IProp } from './lib/type';

const showForm = (props: IProp, myOrders: any )=> {
    const [formInput, updateFormInput] = useState<IPropBalance>(estadoInicial)
    const [show, setShow] = useState(false);
    const [result, setResult] = useState<any>();

    const { etherBalance, tokenBalance, exchangeEtherBalance, exchangeTokenBalance,  tokenName, } = props;

    const depositEtherChange = (e: any) => { 
            formInput.etherDepositAmount = e.target.value 
    };
    const depositTokenChange = (e: any) => { formInput.tokenDepositAmount = e.target.value };
    const withdrawEtherChange = (e: any) => { formInput.etherWithdrawAmount = e.target.value };
    const withdrawTokenChange = (e: any) => { formInput.tokenWithdrawAmount = e.target.value };

    const handleClose = () => setShow(false);

    const depositEtherSubmit = async (e: any) => {
        e.preventDefault();
        await depositEther(props,  formInput,  setShow, setResult)
    } 

    const depositTokenSubmit = async(e: any) => {
        e.preventDefault();
        await depositToken(props,  formInput ,   setShow, setResult);
    }

    const withdrawEtherSubmit = async(e: any) => {
        e.preventDefault();
        await  withdrawEther(props, formInput , setShow, setResult, myOrders);
    }

    const withdrawTokenSubmit = async(e: any) => {
        e.preventDefault();
        await withdrawToken(props,  formInput , setShow, setResult, myOrders);
    }

    return (
        <div>
            <Tabs defaultActiveKey={"deposit"} className={"bg-dark text-white"} id="deposit">
                <Tab eventKey={"deposit"} title={"Depositar"} className={"bg-dark"} >
                    <BalanceTable hasHead={true} tokenName={"ETH"} walletAmount={etherBalance} exchangeAmount={exchangeEtherBalance} />
                    <BalanceForm
                        onSubmit={depositEtherSubmit}
                        placeHolder={ `Quantidade  ${tokenName}`   }
                       
                        onChange={depositEtherChange}
                        buttonText={"Depositar"}
                    />
                    <BalanceTable hasHead={true} tokenName={tokenName} walletAmount={tokenBalance} exchangeAmount={exchangeTokenBalance} />
                    <BalanceForm
                        onSubmit={depositTokenSubmit}
                        placeHolder={"Quantidade Token"}
                        onChange={depositTokenChange}
                        buttonText={"Depositar"}
                    />
                </Tab>
                <Tab eventKey={"withdraw"} title={"Resgatar"} className={"bg-dark"}>
                    <BalanceTable hasHead={true} tokenName={"ETH"} walletAmount={etherBalance} exchangeAmount={exchangeEtherBalance} />
                    <BalanceForm
                        onSubmit={withdrawEtherSubmit}
                        placeHolder={"Quantidade ETH"}
                        onChange={withdrawEtherChange}
                        buttonText={"Resgatar"}
                    />
                    <BalanceTable hasHead={true} tokenName={tokenName} walletAmount={tokenBalance} exchangeAmount={exchangeTokenBalance} />
                    <BalanceForm
                        onSubmit={withdrawTokenSubmit}
                        placeHolder={`Quantidade  ${tokenName}`  }
                        onChange={withdrawTokenChange}
                        buttonText={"Resgatar"}
                    />
                </Tab>
            </Tabs>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{result?.msg}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{result?.desc}</Modal.Body>
                <Modal.Body>{result?.gas}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        OK
                    </Button>
                
                </Modal.Footer>
            </Modal>
        </div>
    )
}

interface Props {
    dados: IProp;
}

const Balance = ({ dados }: Props) => {
	const [myOrders, setMyOrders] = useState<any>();

    useEffect(() => {
		loadWallet()
	}, [])

	async function loadWallet() {
		//   console.log(dados)
        const { etherBalance, tokenBalance, exchangeEtherBalance, exchangeTokenBalance, 
            web3, exchange, tokenName, account, orderBook
        } = dados; 
    
        const [exchangeContract]: any = await loadExchange(web3)
        const [tokenContract]: any =await   loadToken(web3)
    
        const [cancelledOrders, cancelledOrdersOnToken, filledOrders, filledOrdersOnToken, allOrders, allOrdersOnToken]: any =
                await  loadAllOrders(exchangeContract, tokenContract); 
    
        let  orders: any =  openOrders(allOrders, filledOrders, cancelledOrders);
        const myOrdes: any = myTotalOpenOrdersSelector(account, orders);
        setMyOrders(myOrdes)
      //  console.log(myOrdes) 
	}

    return (
        <div className="card bg-dark text-white">
            <div className="card-header">
                Saldos da Plataforma
            </div> 
            <div className="card-body">
                {showForm ? showForm(dados, myOrders) : <Spinner />}
            </div>
        </div>
    );

}



export default Balance;