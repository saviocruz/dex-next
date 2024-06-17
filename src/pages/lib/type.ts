
import { IMensagem } from "../Mensagem";


export interface INav {
  web3: any;
  account: string;
  staking: any;
  exchange: any;
  token: any;
  admin: boolean;
  carregado: boolean;
  content: string;
  showAdmin: boolean;
}
export const iniNav = {
  web3: {},
  account: "",
  staking: null,
  exchange: null,
  token: null,
  admin: false,
  carregado: false,
  content: "<Principal/> ",
  showAdmin: false
}


export interface IEvents{
  updateDados: (dados: IProp) => void;
  setResult: (msg: IMensagem) => void;
  setShow: (a: boolean) => void;
  setCarregado: (a: boolean) => void;
  setNav: (nav: INav) => void;
}

export const inicialEvents = {
  updateDados: (dados: IProp) => {},
  setResult: (msg: IMensagem)  =>   {},
  setShow:  (a: boolean) =>   {true},
  setCarregado:  (a: boolean) =>   {false},
  setNav:  (nav: INav) =>   {},
} 
export interface IProp {
  web3: any;
  exchange: any;
  token:  any;
  pairs: any;

  stacking: any;
  account: string;
  user: any;
  tokenName: any;
  tokenPairs: any;

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

 


  orderBook: any;
  filledOrders?: any;
  myFilledOrders?: any;
  myOpenOrders?: any;
  stacks: any;

  showOrderBook?: boolean;
  showMyFilledOrders: boolean;
  showMyOpenOrders: boolean;
  showBuyTotal: boolean; 
  showSellTotal: boolean;

  priceChart: any;

}

export const estadoInicialNFT = {
  web3: null,
  exchange: null,
  token: null,
  pairs: null,
  stacking: null,
  account: "",
  user: {admin: true },
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
  filledOrders: {},
  myFilledOrders: {},
  myOpenOrders: {},
  stacks: {},
  showMyFilledOrders: true,
  showMyOpenOrders: true,
  showBuyTotal: true,
  showSellTotal: true,
  tokenPairs: null,
  priceChart: null,

  showAdmin: false
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