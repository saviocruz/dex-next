import React, { Component, useEffect, useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { makeBuyOrder, makeSellOrder } from '../store/interactions/orders';
import OrderForm from './OrderForm';
import Spinner from './Spinner';
import { removeTrailingZeros } from './lib/helpers';
import { estadoInicialNFT, IEvents, IProp } from './lib/type';


const showForm = (props: IProp, events: IEvents ) => {
    const { tokenName, showBuyTotal, showSellTotal } = props;
    const [formInput, updateFormInput] = useState<IProp>(estadoInicialNFT)
    const [total, setTotal] = useState<number>(0)
 

    const buyAmountChanged = (e: any) => {
        formInput.buyAmount = e.target.value
        setTotal(formInput.buyPrice * formInput.buyAmount)
    };
    const buyPriceChanged = (e: any) => {
        formInput.buyPrice = e.target.value
        setTotal(formInput.buyPrice * formInput.buyAmount)
    };
    const sellAmountChanged = (e: any) => {
        formInput.sellAmount = e.target.value
        setTotal(formInput.sellPrice * formInput.sellAmount)
    };
    const sellPriceChanged = (e: any) => {
        formInput.sellPrice = e.target.value
        setTotal(formInput.sellPrice * formInput.sellAmount)
    };
    const buyOrderOnSubmit = async (e: any) => {
        e.preventDefault();
        await makeBuyOrder(formInput, props,  events );
    }

    const sellOrderOnSubmit = async (e: any) => {
        e.preventDefault();
        await makeSellOrder(formInput,  props, events);

    }
    return (
        <Tabs defaultActiveKey="buy" className="bg-transparent  text-white" id="tabBuy">
            <Tab className="bg-transparent " title="Compra" eventKey="buy">
                <OrderForm
                    onSubmit={buyOrderOnSubmit}
                    amountOnChange={buyAmountChanged}
                    priceOnChange={buyPriceChanged}
                    buttonText={"Ordem Compra"}
                    buyOrSell={"Compra"}
                    tokenName={tokenName}
                />
                {showBuyTotal ? <small>Total: {removeTrailingZeros(total.toFixed(18))} ETH</small> : null}
            </Tab>
            <Tab className="bg-transparent " title="Venda" eventKey="sell">
                <OrderForm
                    onSubmit={sellOrderOnSubmit}
                    amountOnChange={sellAmountChanged}
                    priceOnChange={sellPriceChanged}
                    buttonText={"Ordem Venda"}
                    buyOrSell={"Sell"}
                    tokenName={tokenName}
                />
                {showSellTotal ? <small>Total: {removeTrailingZeros((formInput?.sellAmount * formInput?.sellPrice).toFixed(18))} ETH</small> : null}
            </Tab>
        </Tabs>
    )
}
interface Props {
    dados: IProp;
    events: IEvents;
 
}

const NewOrder = ({ dados, events  }: Props) => {
    return (
        <div className="card bg-transparent text-white">
            <div className="card-header">
                Criar Ordem Limite
            </div>
            <div className="card-body">
                {showForm ? showForm(dados, events ) : <Spinner type="div" />}
            </div>
        </div>
    );
}

export default NewOrder;