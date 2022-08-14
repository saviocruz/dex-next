import React, { useEffect, useState } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { makeBuyOrder, makeSellOrder } from '../store/interactions/orders';
import OrderForm from './OrderForm';
import Spinner from './Spinner';
import { removeTrailingZeros } from './lib/helpers';
import { estadoInicialNFT, IEvents, IProp } from './lib/type';


const showForm = (props: IProp, events: IEvents, ultimoPreco: number ) => {
    const { tokenName, showBuyTotal, showSellTotal } = props;
    const [formInput, updateFormInput] = useState<IProp>(estadoInicialNFT)
    const [total, setTotal] = useState<number>(0)
    const [carregado, setCarregado] = useState<boolean>(true)
    
  //  events.setCarregado = setCarregado
   // events = {...events, setCarregado: setCarregado}

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
        setCarregado(false)
        await makeBuyOrder(formInput, props,  events, setCarregado );
        setTotal(formInput.sellPrice * formInput.sellAmount)
    }

    const sellOrderOnSubmit = async (e: any) => {
        e.preventDefault();
        setCarregado(false)
        await makeSellOrder(formInput,  props, events, setCarregado);

    }
    if (!carregado) {
         
        return   <Spinner />  
        
    }
    else {

    return (
        <Tabs defaultActiveKey="buy" className="bg-transparent  text-white" id="tabBuy">
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
                    buyOrSell={"Sell"}
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
const NewOrder = ({ dados, events  }: Props) => {
    const [ultimoPreco, setUltimoPreco] = useState<number>(0)
    useEffect(() => {
        let preco = loadWallet()
        
        
    }, [])

    async function loadWallet() {
        const {orderBook } = dados;
        const lastItem = orderBook.buyOrders[0]
        let preco: number = lastItem._amountGive / lastItem._amountGet
        console.log(preco)
        setUltimoPreco(preco)
        return preco
    }

    return (
        <div className="card bg-transparent text-white">
            <div className="card-header">
                Criar Ordem Limite
            </div>
            <div className="card-body">
                {showForm ? showForm(dados, events, ultimoPreco ) : <Spinner type="div" />}
            </div>
        </div>
    );
}

export default NewOrder;