import React from 'react';

export default function({type='table'}){
    if(type === 'table') {
        return (<div className="spinner-border text-light text-center"></div>);
    }
    if(type === 'tbl') {
        return (<span className="text-center"><tr><td><img className="spinner" alt="Loading..." src="./logo.svg"></img></td></tr></span>)
    }
    return (<div className="spinner-border text-light text-center"></div>);
}