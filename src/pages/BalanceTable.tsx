import React from 'react';
 

const tableRow = (tokenName: any, walletAmount: any, exchangeAmount: any) => {
    return (
        <tr>
            <th>{tokenName}</th>
            <th>{walletAmount}</th>
            <th>{exchangeAmount}</th>
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
            <table className="table bg-transparent text-white "> 
                {(hasHead) ? tableHead() : null}
                <tbody>
                    {tableRow(tokenName, walletAmount, exchangeAmount)}
                </tbody>
            </table>
        );
 
}

 
export default  BalanceTable;