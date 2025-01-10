import React, { useState, useEffect } from 'react';
import { Container, Button, Col, Row, } from 'react-bootstrap/';
import Mapa from '../components/Mapa'
import '../Styles/Primero.css'
import { Link } from "react-router-dom";

//imagenes
import fondo1 from '../assets/Fondo1.jpg'
import icono7 from '../assets/icono7.png'
import icono8 from '../assets/icono8.png'
import icono9 from '../assets/icono9.png'


function Primero() {
  return (
     <Container fluid className="seccion-primero">
          <Row className="primero-container">
          <img className="background-primero" src={fondo1}/>
          <h1> 3, 2, 1... ¡Empezamos! </h1>
          </Row>

          <Row className="primero-presentacion">
          <h3> ¿Es tu primer día de escalada en nuestro roco? </h3>
          <h4> ¡Encantados de conocerte! </h4>
          <p> Te recomendamos que te registres en nuestra web. No tardarás nada y prometemos no enviarte peromociones todas las semanas... nuestra mejor publi es que vengas a vernos. Además, ¡Podrás ver contenido exclusivo para nuestros socios, participar en competiciones, y muchas cosas más!</p>
          <Link to="/login" > 
            <Button variant="primary" className="primero-btn">
              Quiero registrarme 
            </Button>
          </Link>
          </Row>

          <Row className="primero-presentacion">
          <h3> ¿Todo el mundo puede escalar? </h3>
          <h4> ¡Por supuesto! Échale un vistazo a nuestros consejos </h4>
          <p>¿Quieres descubrir la escalada? Pues ese es el único requisito. No importa que seas mayor o peque, deportista o no. Cuéntanos por qué has llegado hasta aquí y te enseñaremos a pasarlo bien escalando a través de un plan que se adapte a tus necesidades y expectativas.</p>
          <a href="#consejos-container" style={{ textDecoration: 'none' }}>
            <Button variant="primary" className="primero-btn">
                Ver consejos
              </Button>
          </a>
          </Row>

          <Row className="primero-mapa">
            <div className="donde-container">
            <h5> ¿Donde estamos? </h5>
            <h6> Seguro que más cerca de lo que pensabas: </h6>
            <p> Ven a visitarnos en la Calle de los Pintores 7 (CP 28923) en Alcorcón, Madrid</p>
            
            {/* Contenedor para el mapa con estilo CSS */}
            <div className="mapa-container">
                <Mapa />
            </div>
            </div>
          </Row>


          <Row id="consejos-container" className="consejos-container">
          <Col xs={4} md={4} className="col3-primero">
            <div className="info-primero">
              <img className="icono-primero" src={icono8} alt="Icono" />
              <h5>¿Qué me pongo para escalar?</h5>
              <p>No te hará falta ropa técnica ni nada por el estilo, así que ven como quieras, pero ten en cuenta que vamos a estirarnos, saltar y jugar un montón, así que evita las prendas que limiten el movimiento o resulten incómodas. </p>

            <p>Y un consejo para empezar: usa pantalón o mallas largas (así evitaremos algunos raspones feos).</p>
            </div>
          </Col>

          <Col xs={4} md={4} className="col3-primero">
            <div className="info-primero">
              <img className="icono-primero" src={icono9} alt="Icono" />
              <h5>¿Necesito material?</h5>
              <p>Lo básico para empezar a escalar son unos pies de gato (zapatillas especiales con suela adherente) y arnés (elemento de seguridad con cinturón perneras al que irá unida la cuerda o la cinta del autoseguro) si queremos escalar vías. Si no tienes, no te preocupes que en nuestro centro lo ponemos a tu disposición. Pregunta en recepción. </p>
            </div>
          </Col>

          <Col xs={4} md={4} className="col3-primero">
            <div className="info-primero">
              <img className="icono-primero" src={icono7} alt="Icono" />
              <h5>¿Como funcionan las cosas?</h5>
              <p>La dificultad aumenta con los códigos de color de los recorridos, como las estaciones Los puntos de salida están marcados con cinta adhesiva. El objetivo del juego es tocar la presa más alta permaneciendo en el mismo color. Las presas blancas sirven para desescalar los bloques y caer desde una altura inferior. El magnesio liquido ayuda a agarrarse mejor a las presas.</p>
            </div>
          </Col>
        </Row>

        

          
    </Container>
  )
}

export default Primero
