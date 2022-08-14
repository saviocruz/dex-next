import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap'
import Spinner from './Spinner'
import Identicon from 'identicon.js';


import { IEvents, IProp } from './lib/type';
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
  dados: INav;
  setDados: any
}

const Navigator = ({ dados, setDados }: Props) => {
  const { account, admin, carregado } = dados

  var identiconOption = {
    foreground: [186, 39, 127, 255],               // rgba black
    background: [0, 0, 0, 255],         // rgba white
    margin: 0.2,                              // 20% margin
    size: 420,                                // 420px square
    format: 'svg',                            // use SVG instead of PNG
    hash: "0x"
  };

  return (

    <Navbar bg="transparent" variant="dark" collapseOnSelect expand="lg">
      <Navbar.Brand className="brand">
        <img
          alt="logo"
          src="/logo.svg"
          width="30"
          height="30"
          className="d-inline-block align-top brand"
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="">
          <Nav.Link

            onClick={() => {
              dados.content = "Dex"
              setDados({ ...dados, content: "Dex" })
            }}> DEX</Nav.Link>

          <Nav.Link
            onClick={() => {
              dados.content = "Stack"
              setDados({ ...dados, content: "Stack" })
            } }>Staking</Nav.Link>

          <Nav.Link
            onClick={() => alert('Nft')}>NFT</Nav.Link>
        </Nav>

        <div style={{ marginLeft: "60px", fontSize: "20px" }}>
          Plataforma DEX experimental
        </div>

        <div style={{ marginLeft: "160px", fontSize: "12px" }}>
          {carregado === true ? account : <Spinner type="table" />}
        </div>
      </Navbar.Collapse>


      <div>
        {carregado === true ? showAdminPanel(dados) : <Spinner type="table" />}
      </div>
    </Navbar>


  );
}





export default Navigator 
