import React from 'react';
 

const tableRow = (tokenName: any, walletAmount: any, exchangeAmount: any) => {
    return (
        <tr>
            <th>{tokenName}</th>
            <th>{walletAmount.toString()}</th>
            <th>{exchangeAmount.toString()}</th>
        </tr>
    )
}

const tableHead = () => {
    return (
        <thead>
            <tr>
                <th>Token</th>
                <th>Carteira</th>
                <th>Exchange</th>
            </tr>
        </thead>
    );
}
 
const BalanceTable = (props: any ) => {
        const {hasHead, tokenName, walletAmount, exchangeAmount} = props;
        return (
            <table className="table table-dark table-sm small">
                {(hasHead) ? tableHead() : null}
                <tbody>
                    {tableRow(tokenName, walletAmount, exchangeAmount)}
                </tbody>
            </table>
        );
 
}

 
export default  BalanceTable;