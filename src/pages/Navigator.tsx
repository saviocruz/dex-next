import React, { Component, useEffect, useState } from 'react';
import { Navbar, Nav } from 'react-bootstrap'
import Spinner from './Spinner'
import Identicon from 'identicon.js';

import { INav } from '.';


const showAdminPanel = (dados: any) => {

  if (dados.admin === true) {
    return (
      <div className="admin-panel text-white text-xm">
        <button
          className="btn btn-primary btn-block btn-sm btn-custom"
          onClick={() => (dados.admin = true)}>Admin</button>
      </div>

    )

  }

}

interface Props {
  nav: INav;
  setNav: any
}

const Navigator = ({ nav, setNav }: Props) => {
  const {web3, account, admin, carregado, staking,  } = nav
 
  var identiconOption = {
    foreground: [186, 39, 127, 255],               // rgba black
    background: [0, 0, 0, 255],         // rgba white
    margin: 0.2,                              // 20% margin
    size: 420,                                // 420px square
    format: 'svg',                            // use SVG instead of PNG
    hash: "0x"
  };

  return (

    <Navbar  variant="dark" collapseOnSelect expand="lg" style={{backgroundColor: "#4B0082"}}>
      <Navbar.Brand className="brand"  >
        <img
          alt="logo"
          src="/logo.svg"
          width="30"
          height="30"
          className="d-inline-block align-top brand"
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav"  />
      <Navbar.Collapse id="responsive-navbar-nav" >
        <Nav className="">
          <Nav.Link
            onClick={() => {
              nav.content = "Dex"
              setNav({ ...nav, content: "Dex" })
            }}> DEX</Nav.Link>

          <Nav.Link
            onClick={() => {
              nav.content = "Stake"
              setNav({ ...nav, content: "Stake" })
            }}>Staking Block</Nav.Link>

          <Nav.Link
            onClick={() => {
              nav.content = "StakeTime"
              setNav({ ...nav, content: "StakeTime" })
            }}>Staking Time</Nav.Link>

        </Nav>

        <div style={{ marginLeft: "60px", fontSize: "20px" }} className="text-white">
          Plataforma DEX experimental
        </div>

        <div style={{ marginLeft: "160px", fontSize: "12px" }} className="text-white">
          {carregado === true ? account : <Spinner type="tbl" />}
        </div>
      </Navbar.Collapse>


      <div>
        {carregado === true ? showAdminPanel(nav) : <Spinner type="tbl" />}
      </div>
    </Navbar >


  );
}





export default Navigator 
