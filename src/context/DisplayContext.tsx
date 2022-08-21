import React from "react";
export default React.createContext<IDContext>({} as IDContext);

export interface IDContext   {
 /// capturaArqivo: (event: any) => void;
 // uploadArquivo: (nft: INFT) => Promise<void>;
 // setDados(dados: any): void

  userDetails: any;
   refreshUserDetails: any; onInputNumberChange: any; isNonZeroNumber: any; toast: any;

}
 