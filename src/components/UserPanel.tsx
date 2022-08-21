import React, {useContext, useState} from "react";
import BlockchainContext from "../context/BlockchainContext";

import DisplayContext from "../context/DisplayContext";

import TimeLeftField from "./UserPanel/TimeLeftField";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';



export default function UserPanel() {
    const blockchainContext = useContext(BlockchainContext);
    const displayContext = useContext(DisplayContext);
    const { web3, accounts, stakerContract, depositTokenContract } = blockchainContext;
    const {userDetails, refreshUserDetails, onInputNumberChange, isNonZeroNumber, toast} = displayContext;

    const [inputStake, setInputStake] = useState('');
    const [inputUnstake, setInputUnstake] = useState('');

    async function deposit() {
        if (!isNonZeroNumber(inputStake)) {
            toast.error('No amount entered.');
            return;
        }
        if (parseFloat(inputStake) > parseFloat(userDetails["depositTokenBalance"])) {
            console.log(typeof inputStake);
            toast.error("Not enough balance.");
            return;
        }
        toast.dismiss();
        let amount = web3.utils.toWei(inputStake.toString());
        try {
            toast.info('Approve a transação 1 of 2 (aprovar)...', {position: 'top-left', autoClose: false});
            await depositTokenContract.methods.approve(stakerContract.options.address, amount.toString()).send({ from: accounts[0] });
            toast.dismiss();
            toast.info('Approve a transação 2 of 2 (staking)...', {position: 'top-left', autoClose: false});
            await stakerContract.methods.deposit(amount).send({ from: accounts[0] });
        } finally {
            toast.dismiss();
        }
        setInputStake("");
        await refreshUserDetails();
    }
    
      
    async function withdraw() {
        if (!isNonZeroNumber(inputUnstake)) {
            toast.error('No amount entered.');
            return;
        }
        if (parseFloat(inputUnstake) > parseFloat(userDetails["deposited"])) {
            toast.error("Can't unstake more than staked.");
            return;
        }
        toast.dismiss();
        let amount = web3.utils.toWei(inputUnstake.toString());
        toast.info('Confirme a transação...', {position: 'top-left', autoClose: false});
        try {
            await stakerContract.methods.withdraw(amount).send({ from: accounts[0] });
        } finally {
            toast.dismiss();
        }
        setInputUnstake("");
        await refreshUserDetails();
    }
    
    async function claim() {
        toast.dismiss();
        toast.info('Confirme a transação...', {position: 'top-left', autoClose: false});
        try {
            await stakerContract.methods.claim().send({ from: accounts[0] });
        } finally {
            toast.dismiss();
        }
        await refreshUserDetails();
    }

    function numberToFixed(n) {
        if (n === undefined)
            return n;
        return parseFloat(n).toFixed(6);
    }
    

    const CardKeyValue = (props: any) => (
        <>
        <div className="card-key-value">
            <div>
            {props.label}
            </div>
            <div>
            {props.value}
            </div>
        </div><hr/>
        </>
    );

    const RewardsPhaseFinished = (props: any) => (
        <>
        <div className="two-line-label">
            <div>Período de recompensa de staking concluído.</div>
            <div>Por favor, volte mais tarde para a próxima fase.</div>
        </div><hr/>
        </>
    );

    const RewardsPhaseActive = (props: any) => (
        <>
            <TimeLeftField />
            <CardKeyValue label="Ganho global por dia" value={numberToFixed(userDetails["rewardPerDay"])} />
        </>
    );

    return (
        <>
            <Container className="square inner-container">
                <br/>
                {isNonZeroNumber(userDetails["rewardPerDay"])? <RewardsPhaseActive /> : <RewardsPhaseFinished/>}
                <CardKeyValue label="Saldo stake" value={numberToFixed(userDetails["deposited"])} />
                <CardKeyValue label="Saldo pendente" value={numberToFixed(userDetails["pending"])} />
                

                <br/><br/>
                <div className="label-above-button">
                    Saldo {userDetails["depSymbol"]} restante para stake: {userDetails["depositTokenBalance"]}
                </div>
                <div className="input-button-container">
                    <div>
                        <Form.Control placeholder="Amount" value={inputStake} onChange={(e) => {onInputNumberChange(e, setInputStake)}}/>
                    </div>
                    <div>
                        <OverlayTrigger
                        placement="right"
                        overlay={userDetails["pending"] > 0 ? <Tooltip >Will also claim pending rewards</Tooltip> : <></>}>
                            <Button onClick={deposit} >Stake</Button>
                        </OverlayTrigger>
                    </div>
                </div><br/>

                <div className="label-above-button">
                    {userDetails["depSymbol"]} staked: {userDetails["deposited"]}
                </div>
                <div className="input-button-container">
                    <div>
                        <Form.Control placeholder="Amount" value={inputUnstake} onChange={(e) => {onInputNumberChange(e, setInputUnstake)}}/>
                    </div>
                    <div>
                        <OverlayTrigger
                        placement="right"
                        overlay={userDetails["pending"] > 0 ? <Tooltip >Will also claim pending rewards</Tooltip> : <></>}>
                            <Button onClick={withdraw} >Unstake</Button>
                        </OverlayTrigger>
                    </div>
                </div><br/>

                <div className="label-above-button">
                    Pendente {userDetails["rewSymbol"]} ganhos: {userDetails["pending"]}
                </div>
                <div className="button-stretch">
                    <Button onClick={claim} >Resgatar ganhos</Button>
                </div>
                <br/>
                </Container>
        </>
    )
}