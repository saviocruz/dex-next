import React from "react";
export default React.createContext<IBlockContext>({} as IBlockContext);



export interface IBlockContext   {
  /// capturaArqivo: (event: any) => void;
  // uploadArquivo: (nft: INFT) => Promise<void>;
  // setDados(dados: any): void
  web3: any; accounts: any; stakerContract: any; rewardTokenContract: any; depositTokenContract: any;
 
 
 }

