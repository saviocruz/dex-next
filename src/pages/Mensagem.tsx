import React, {  useEffect, useState } from 'react';
import { Button, Modal } from 'react-bootstrap';

export interface IMensagem {
    msg: string;
    desc: string;
    gas:  number;
    show: boolean;
    setShow: any;
}

export const estadoInicialMensagem= {
    msg: '',
    desc: '',
    gas:  0,
    show: false,
    setShow: null
  };

const Mensagem = ( result: IMensagem  ) => {
 
    const {show , setShow } = result

    const handleClose = () =>  setShow(false);

    return (
        <div>
            
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{result?.msg}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{result?.desc}</Modal.Body>
            <Modal.Body>{result?.gas}</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    OK
                </Button>
            </Modal.Footer>
        </Modal>
    </div>
    );
}



export default Mensagem;