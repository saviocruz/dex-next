import Web3 from "web3";

export const tokenLogo = '../eth-logo.png'
export const ethLogo = '../token-logo.png'




export const tokensLogo = () => {
 
  return [ethLogo, tokenLogo];
}

export const tokens = (n: any, wei: any, web3: Web3) => ether(web3, wei)
export const ether = (web3: any, wei: any) => {
    if (wei) {
        //  console.log('Amount passed : ',(wei))
        //  console.log('Conveted : ',web3.utils.toWei(wei.toString(),'ether'))

        return (web3.utils.fromWei(wei.toString(), 'ether')) // 18 decimal places

    }
}