import React from "react";
export default React.createContext<IDContext>({} as IDContext);

export interface IDContext   {

  userDetails: any;
   refreshUserDetails: any; onInputNumberChange: any; isNonZeroNumber: any; toast: any;

}
 