export interface IEvents{
  updateDados: any;
  setResult: any;
  setShow: any;
}

export interface inicialEvents{
  updateDados: {},
  setResult: {}
  setShow: {}
} 
export interface IProp {
  web3: any;
  exchange: any;
  token:  any;
  pairs: any;
  account: string;
  tokenName: any;

  etherBalance: number;
  tokenBalance: number
  exchangeEtherBalance: number
  exchangeTokenBalance: number,

  etherDepositAmount?: number;
  etherWithdrawAmount?: number;
  tokenDepositAmount?: number;
  tokenWithdrawAmount?: number;

  buyAmount: number;
  buyPrice: number;
  sellAmount: number;
  sellPrice: number;

  showOrderBook?: boolean;
  orderBook: any;
  myFilledOrders: any;
  myOpenOrders: any;
  showMyFilledOrders: boolean;
  showMyOpenOrders: boolean;
  //buyOrder: any; 
  //sellOrder: any; 
  showBuyTotal: boolean; 
  showSellTotal: boolean;
  tokenPairs: any;
}

export const estadoInicialNFT = {
  web3: null,
  exchange: null,
  token: null,
  pairs: null,
  account: "",
  tokenName: "",
  etherBalance: 0,
  tokenBalance: 0,
  exchangeEtherBalance: 0,
  exchangeTokenBalance: 0,
  etherDepositAmount: 0,
  etherWithdrawAmount: 0,
  tokenDepositAmount: 0,
  tokenWithdrawAmount: 0,
  buyAmount: 0,
  buyPrice: 0,
  sellAmount: 0,
  sellPrice: 0,
  showOrderBook: false,
  orderBook:  {sellOrders: [],  buyOrders:[], canceledOrders:[]},
  myFilledOrders: {},
  myOpenOrders: {},
  showMyFilledOrders: true,
  showMyOpenOrders: true,
  buyOrder: {}, sellOrder: {}, showBuyTotal: true, showSellTotal: true,
  tokenPairs: null
};

export interface IPropBalance {
  etherDepositAmount: number;
  etherWithdrawAmount: number;
  tokenDepositAmount: number;
  tokenWithdrawAmount: number;
  showOrderBook?: boolean;
  orderBook: any;
  gas: number;
}

export const estadoInicial = {
  etherDepositAmount: 0,
  etherWithdrawAmount: 0,
  tokenDepositAmount: 0,
  tokenWithdrawAmount: 0,
  showOrderBook: true,
  orderBook: true,
  gas: 0,
};

export interface IMsg {
  msg: string;
  desc: string, 
  data?: any
}

export const msgInicial = {
  msg: "",
  desc: "", 
  data: null
}