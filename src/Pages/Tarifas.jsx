import React,  { useState, useEffect }  from 'react'
import {Container, Col, Row } from 'react-bootstrap/';
import '../Styles/Tarifas.css'
import { loadStripe } from '@stripe/stripe-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { getAuth,  onAuthStateChanged  } from "firebase/auth";


//imagenes
import fondo1 from '../assets/Fondo1.jpg'
import roco4 from '../assets/roco4.jpg'
import roco1 from '../assets/roco1.jpg'

const stripePromise = loadStripe('pk_test_51QcqgCQG9VO4iB056SAGDlNBtSlQz3ehdXSEumIduMFBOFwjRGZneW4jfghps0vfrk7S9c2KVCSnkp9sFMYJjxjS00oCVBOAwZ'); 
 
 
function Tarifas() {

  
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    const auth = getAuth();
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); 
      } else {
        setUserId(null); 
      }
    });
  
    return unsubscribe; 
  }, []);




  // Función para manejar el checkout
  const handleCheckout = async (priceId, name) => {
  if (!userId) {
    console.error('userId is missing');
    return;
  }

  // Enviar los datos de la compra al backend
  try {
    const response = await fetch('http://localhost:3001/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        userId, // El userId del usuario logueado
        priceId, // El priceId correspondiente al producto seleccionado
        name, // El nombre del curso o producto
      }),
    });

    if (!response.ok) {
      throw new Error('Error al crear la sesión de pago');
    }

    const session = await response.json();

    // Redirigir al usuario a Stripe Checkout
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({
      sessionId: session.id, // Usamos el ID de la sesión de Stripe
    });

    if (error) {
      console.error('Error al redirigir al checkout:', error);
    }
  } catch (error) {
    console.error('Error al enviar la solicitud al backend:', error);
  }
};

  

// Función para manejar la suscripción
const handleCheckoutSubscription = async (priceId, name) => {
  const stripe = await stripePromise;

  // Verifica que userId esté disponible
  if (!userId) {
    console.error('userId is missing');
    return;
  }

  // Verifica que priceId y name estén definidos
  if (!priceId || !name) {
    console.error('priceId or name is missing');
    return;
  }

  try {
    // Enviar los datos al backend para crear la sesión de suscripción
    const response = await fetch('http://localhost:3001/create-checkout-session-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId, // El userId del usuario logueado
        priceId, // El priceId correspondiente al plan de suscripción
        name, // El nombre del producto o plan de suscripción
      }),
    });

    // Verifica si la respuesta no es OK
    if (!response.ok) {
      const errorData = await response.json(); // Asegúrate de que la respuesta esté en formato JSON
      alert(errorData.error);  // Mostrar el mensaje de error del backend
      return;  // Evitar continuar si hay un error
    }

    const session = await response.json();

    // Redirigir al usuario a Stripe Checkout
    const { error } = await stripe.redirectToCheckout({
      sessionId: session.id, // Usamos el ID de la sesión de Stripe
    });

    if (error) {
      console.error('Error al redirigir al checkout:', error);
    }
  } catch (error) {
    console.error('Error al enviar la solicitud al backend:', error);
    alert('Error al comunicarse con el servidor. Por favor, inténtalo de nuevo más tarde.');
  }
};
 

  return (
    <div>
    <Container fluid className="seccion-tarifas">
      <Row className="tarifas-container">
      <img className="background-tarifas" src={fondo1}/>
      <h2> Ven a escalar con nosotros </h2>
      <h6> Encuentra el abono que más se adapta a ti</h6>
      </Row>

      <Row className="tarifas-intro">
        <h3> Tarifas de acceso para adultos, abonos y clases dirigidas </h3>
        <div className="imagen-centro">
            <img src={roco4} alt="Imagen de escalada" />
        </div>
      </Row>

      <Row className="tarifas-row">
        <Col xs={6} md={6} className="col1-tarifas">
         <div className="tarifa-card">
          <div className="tarifa-item">
          <h4>Entradas de día</h4>
          <h5> 1 día para adultos </h5>
          <p>Válido durante todo el día hasta que tus brazos no puedan más.</p>
          </div>
          <div 
            className="precios" 
            onClick={() => handleCheckout('price_1QcqlcQG9VO4iB05PdHXTAeM', 'Entrada de día para adultos')}
          >
            <span className="precio">13,50 €</span>
            <FontAwesomeIcon icon={faPaperPlane} className="icono-flecha" />
          </div>

          <div className="tarifa-item">
          <h5> Happy hour </h5>
          <p>También depende de lo que tus brazos te respondan, pero debes entrar entre las 15:00 y las 17:00 </p>
          </div>
          <div 
            className="precios" 
            onClick={() => handleCheckout('price_1QcqnUQG9VO4iB054FkIspJX', 'Entrada Happy Hour Adultos')}
          >
            <span className="precio">11 €</span>
            <FontAwesomeIcon icon={faPaperPlane} className="icono-flecha" />
          </div>


          <div className="tarifa-item">
          <h5> Pack 10 entradas para adultos </h5>
          <p>Sin fecha de caducidad, puedes usarlo cuando te de la gana.</p>
          </div>
          <div 
            className="precios" 
            onClick={() => handleCheckout('price_1Qcqo7QG9VO4iB052aKk01J3', 'Pack 10 entradas de día Adultos')}
          >
            <span className="precio">100 €</span>
            <FontAwesomeIcon icon={faPaperPlane} className="icono-flecha" />
          </div>
        </div>
        </Col>

        <Col xs={6} md={6} className="col1-tarifas">
         <div className="tarifa-card">
          <div className="tarifa-item">
          <h4>Abonos</h4>
          <h5> Abono mensual </h5>
          <p>Ven cuando quieras, las veces que quieras, así no te echamos de menos</p>
          </div>
          <div 
            className="precios" 
            onClick={() => handleCheckoutSubscription('price_1QdTYXQG9VO4iB05mz8t4Agd', 'Abono mensual adultos')}
          >
            <span className="precio">48 €</span>
            <FontAwesomeIcon icon={faPaperPlane} className="icono-flecha" />
          </div>

          <div className="tarifa-item">
          <h5> Abono anual </h5>
          <p>También puedes venir todo lo que quieras, pero por menos dinero </p>
          </div>
          <div 
            className="precios" 
            onClick={() => handleCheckoutSubscription('price_1QdTZZQG9VO4iB056p4UPEdk', 'Abono anual adultos')}
          >
            <span className="precio">420 €</span>
            <FontAwesomeIcon icon={faPaperPlane} className="icono-flecha" />
          </div>

          <div className="tarifa-item1">
          <h4>Clases dirigidas</h4>
          <h5> Uno o dos días por semana </h5>
          <p>Si quieres que tu progreso como escalador despegue, ven a preguntarnos los horarios de las clases</p>
          </div>
        </div>
        </Col>

        </Row>

        <Row className="tarifas-intro">
        <h3> El rocódromo para los más pequeños </h3>
        <p>Los menores de 16 años deberán estar siempre acompañados de un adulto.</p>
        <div className="imagen-centro">
            <img src={roco1} alt="Imagen de escalada" />
        </div>
      </Row>

      <Row className="tarifas-row">
        <Col xs={6} md={6} className="col1-tarifas">
         <div className="tarifa-card">
          <div className="tarifa-item">
          <h4>Entradas de día</h4>
          <h5> 1 día para niños </h5>
          <p>Los más peques pueden venir a divertirse a cualquier hora.</p>
          </div>
          <div 
            className="precios" 
            onClick={() => handleCheckout('price_1QcqmcQG9VO4iB05GhGi9Gy7', '1 Entrada de día Niños')}
          >
            <span className="precio">10 €</span>
            <FontAwesomeIcon icon={faPaperPlane} className="icono-flecha" />
          </div>

          <div className="tarifa-item">
          <h5> Pack 10 entradas para niños </h5>
          <p> Como para los mayores, sin fecha de caducidad, pueden venir a cansarse en cualquier momento. </p>
          </div>
          <div 
            className="precios" 
            onClick={() => handleCheckout('price_1QcqoxQG9VO4iB05OEgxk82Z', 'Pack 10 entradas Niños')}
          >
            <span className="precio">80 €</span>
            <FontAwesomeIcon icon={faPaperPlane} className="icono-flecha" />
          </div>
        </div>
        </Col>

        <Col xs={6} md={6} className="col1-tarifas">
         <div className="tarifa-card">
         <div className="tarifa-item">
         <h4>Diversión escalando</h4>
          <h5> Grupos y celebraciones </h5>
          <p>¿Tienes un evento especial o un cumpleaños? ¡Pregúntanos y ven a celebrarlo con nosotros!</p>
          </div>
          
          <div className="tarifa-item1">
          <h4>Clases dirigidas</h4>
          <h5> Uno o dos días por semana </h5>
          <p>Clases en gurpo para después del cole, venid a preguntarnos los horarios de las clases</p>
          </div>
        </div>
        </Col>

        </Row>
      </Container>
    </div>
  )
}

export default Tarifas
