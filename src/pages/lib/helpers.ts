export const ETHER_ADDRESS = "0x0000000000000000000000000000000000000000";
export const GREEN = "success";
export const RED = "danger";
export const DECIMALS = (10**18);
export const ETHUnit: string | any | undefined = 'ether'

//calculate without importing web3
export const tokens = (wei: number) => {
    if(wei) {
        return (wei / DECIMALS);
    }
}

export const ether = tokens;

export const formatBalance = (balance : any) => {
    const precision = 100; //2 dm
    balance = ether(balance);
    balance = Math.round(balance * precision) / precision;
    return balance;
}

export const removeTrailingZeros = (numbero: string) => {
    numbero = numbero.replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/,'$1');
    return numbero;
}