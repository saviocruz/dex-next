import React  from 'react';

const OrderForm = (props: any) => {

    const { onSubmit,
        amountOnChange,
        priceOnChange,
        buttonText,
        buyOrSell,
        tokenName,
        ultimoPreco
    } = props;   
    return (
        <form onSubmit={onSubmit}>
            <div className="form-group small">
                <label>Quantidade {`${buyOrSell}  (${tokenName})`}</label>
                <div className="input-group">
                    <input type="number"
                        step="any"
                        min="0"
                        placeholder="quantidade"
                        onChange={amountOnChange}
                        className="form-control form-control-sm bg-transparent "
                        required />
                </div>
            </div>
            <div className="form-group small">
                <label>{` Preço ${buyOrSell}`}</label>
                <div className="input-group">
                    <input type="text"
                        step="any"
                        min="0"
                        placeholder="preço"
                        onChange={priceOnChange}
                        value={ultimoPreco}
                        className="form-control form-control-sm bg-transparent"
                        required />
                </div>
            </div>
            <button type="submit" className="btn btn-primary btn-sm btn-block">{buttonText}</button>
        </form>
    );

}

export default OrderForm;