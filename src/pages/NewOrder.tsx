import React, { useEffect, useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { makeBuyOrder, makeSellOrder } from '../store/interactions/orders';
import OrderForm from './OrderForm';
import Spinner from './Spinner';
import { removeTrailingZeros } from './lib/helpers';
import { estadoInicialNFT, IEvents, IProp } from './lib/type';


const showForm = (props: IProp, events: IEvents, ultimoPreco: number, setUltimoPreco: any) => {
    const { tokenName, showBuyTotal, showSellTotal } = props;
    const [formInput, updateFormInput] = useState<IProp>(estadoInicialNFT)
    const [total, setTotal] = useState<number>(0)
    const [carregado, setCarregado] = useState<boolean>(true)
    formInput.buyPrice = ultimoPreco;
    events.setCarregado = setCarregado
    events = {...events, setCarregado: setCarregado}

    async function loadWallet() {
        const { orderBook } = props;
        const lastItem = orderBook.buyOrders[0]
        let preco: number = lastItem?._amountGive / lastItem?._amountGet
        console.log(preco)
        setUltimoPreco(preco.toFixed(4))
        return preco
    }
    const buyAmountChanged = (e: any) => {
        e.preventDefault();
        formInput.buyAmount = e.target.value
        setTotal(formInput.buyPrice * formInput.buyAmount)
        loadWallet() 
    };
    const buyPriceChanged = (e: any) => {
        e.preventDefault();
        formInput.buyPrice = e.target.value
         ultimoPreco = e.target.value
        setUltimoPreco(ultimoPreco)
        setTotal(formInput.buyPrice * formInput.buyAmount)
    };
    const sellAmountChanged = (e: any) => {
        e.preventDefault();
        formInput.sellAmount = e.target.value
        setTotal(formInput.sellPrice * formInput.sellAmount)
        loadWallet() 
    };
    const sellPriceChanged = (e: any) => {
        e.preventDefault();
        formInput.sellPrice = e.target.value
       // ultimoPreco = e.target.value
        setUltimoPreco(e.target.value)
        setTotal(formInput.sellPrice * formInput.sellAmount)
    };
    const buyOrderOnSubmit = async (e: any) => {
        e.preventDefault();
        setCarregado(false)
       // ultimoPreco = e.target.value
        //setUltimoPreco(e.target.value)
        await makeBuyOrder(formInput, props, events);
        setTotal(formInput.sellPrice * formInput.sellAmount)
    }

    const sellOrderOnSubmit = async (e: any) => {
        e.preventDefault();
        setCarregado(false)
        await makeSellOrder(formInput, props, events);

    }
    if (!carregado) {
      //  loadWallet()
        return <Spinner type="tbl" />

    }
    else {

        return (
            <Tabs defaultActiveKey="buy" className="bg-transparent" id="tabBuy">
                <Tab className="bg-transparent " title="Compra" eventKey="buy">
                    <OrderForm
                        onSubmit={buyOrderOnSubmit}
                        amountOnChange={buyAmountChanged}
                        priceOnChange={buyPriceChanged}
                        buttonText={"Ordem Compra"}
                        buyOrSell={"Compra"}
                        ultimoPreco={ultimoPreco}
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
                        buyOrSell={"Venda"}
                        tokenName={tokenName}
                        ultimoPreco={ultimoPreco}
                    />
                    {showSellTotal ? <small>Total: {removeTrailingZeros((formInput?.sellAmount * formInput?.sellPrice).toFixed(18))} ETH</small> : null}
                </Tab>
            </Tabs>
        )
    }
}
interface Props {
    dados: IProp;
    events: IEvents;
}

const NewOrder = ({ dados, events }: Props) => {
    const [ultimoPreco, setUltimoPreco] = useState<number>(0)
    return (
        <div className="card bg-transparent">
            <div className="card-header">
                Criar Ordem Limite
            </div>
            <div className="card-body">
                {showForm ? showForm(dados, events, ultimoPreco, setUltimoPreco) : <Spinner type="div" />}
            </div>
        </div>
    );
}

export default NewOrder;