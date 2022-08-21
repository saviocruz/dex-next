import React, {useContext, useState} from "react";

import BlockchainContext from "../context/BlockchainContext";
import DisplayContext from "../context/DisplayContext";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';

export default function AdminPanel() {
    const blockchainContext = useContext(BlockchainContext);
    const displayContext = useContext(DisplayContext);
    const { web3, accounts, stakerContract, rewardTokenContract } = blockchainContext;
    const {userDetails, refreshUserDetails, onInputNumberChange, isNonZeroNumber, toast} = displayContext;

    const [inputAdminRewards, setInputAdminRewards] = useState('');
    const [inputAdminDuration, setInputAdminDuration] = useState('');

    async function addRewards() {
        if (userDetails["daysLeft"] !== 0.) {
            toast.info("Can't add rewards in middle of campaign. Please wait for campaign to finish.");
            return;
        }
        if (!(isNonZeroNumber(inputAdminRewards) && isNonZeroNumber(inputAdminDuration))) {
            toast.info('Please add missing input.');
            return;
        }
        if (parseFloat(inputAdminRewards) > parseFloat(userDetails["rewardTokenBalance"])) {
            toast.error("Not enough balance.");
            return;
        }
        toast.dismiss();
        let amount = web3.utils.toWei(inputAdminRewards);
        let days = inputAdminDuration;
        try {
            toast.info('Approve a transação 1 of 2 (aprovar)...', {position: 'top-left', autoClose: false});
            await rewardTokenContract.methods.approve(stakerContract.options.address, amount.toString()).send({ from: accounts[0] });
            toast.dismiss();
            toast.info('Approve a transaçao 2 of 2 (add stake)...', {position: 'top-left', autoClose: false});
            await stakerContract.methods.addRewards(amount.toString(), days).send({ from: accounts[0] });
        } finally {
            toast.dismiss();
        }
        
        await refreshUserDetails();
    }

    return (
        <>
            <Container className="square inner-container">
                <br/>
                Admin :: Adicione {userDetails["rewSymbol"]} Ganhos
                <hr/>

                <br/>Quantidadade<br/>
                <div className="label-above-button">
                  Saldo {userDetails["rewSymbol"]} restante para transferir: {userDetails["rewardTokenBalance"]}
                </div>
                <div className="input-button-container">
                    <Form.Control key="a1" placeholder="quantidade" value={inputAdminRewards} onChange={(e) => {onInputNumberChange(e, setInputAdminRewards)}}/>
                </div>         
                <br/><hr/>

                <br/>Duração (em dias)<br/>
                <div className="input-button-container">
                    <Form.Control placeholder="dias" value={inputAdminDuration} onChange={(e) => {onInputNumberChange(e, setInputAdminDuration)}}/>
                </div>
                <br/><hr/>

                <div className="button-stretch">
                    <br/><Button onClick={addRewards} variant="secondary">Adiciona</Button><br/>
                </div>
                <br/>
            </Container>
        </>
    )
}