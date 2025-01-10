import React  from 'react';
import {Container, Row, Button } from 'react-bootstrap/';
import '../Styles/Success.css'
import {  Link } from "react-router-dom";

import fondo1 from '../assets/fondo1.jpg'

function Cancel() {
  return (
    <div>
     <Container fluid className="seccion-success">
      <Row className="success-container">
      <img className="background-success" src={fondo1}/>
      <h2> UPS... </h2>
      </Row>

      <Row className="compra-container">

      <h1>Algo ha fallado</h1>
     
        <div>
          <h1> Parece que algo ha ido mal con la compra de tus entradas </h1>
          <h5>Vuelve a intentarlo:</h5> 
          
          <Link to="/tarifas">
                <Button variant="primary" className="success-btn">
                  Comprar
                </Button>
          </Link>
        </div>
      
      </Row>
      </Container>
    </div>
  )
}

export default Cancel
