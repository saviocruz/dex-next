import React  from 'react';


const BalanceForm = (props: any) => {
  
        const {onSubmit, placeHolder, onChange, buttonText, value} =  props;
        return (
            <form className="row" onSubmit={onSubmit}>
                <div className="col-12 col-sm pr-sm-2">
                    <input type="number" 
                        step="any"
                        min="0"
                        placeholder={placeHolder} 
                        onChange={onChange}
                        value={value ||""}
                        className="form-control form-control-sm bg-transparent text-white"
                        required />
                </div>
                <div className="col-12 col-sm-auto pl-sm-0">
                    <button type="submit" className="btn btn-primary btn-block btn-sm">{buttonText}</button>
                </div>
            </form>
        );
  
}

 
export default   BalanceForm;