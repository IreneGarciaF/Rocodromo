import React, { useState, useEffect } from 'react';
import { Container, Button, Col, Row } from 'react-bootstrap/';
import '../Styles/Inicio.css';
import { useNavigate, Link } from "react-router-dom";

// Importaciones de Firebase
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase-config';

// Assets
import fondo1 from '../assets/Fondo1.jpg';
import video1 from '../assets/arkose1.mp4';
import icono1 from '../assets/icono1.png';
import icono2 from '../assets/icono2.png'
import icono3 from '../assets/icono3.png'
import icono4 from '../assets/icono4.png'
import icono5 from '../assets/icono5.png'
import icono6 from '../assets/icono6.png'

function Inicio() {
  const [user, setUser] = useState(null);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ email: '', password: '', confirmPassword: '' });
  const [validPwd, setValidPwd] = useState(false);
  const [validMatch, setValidMatch] = useState(false);
  const navigate = useNavigate();

  // Verifica el estado de autenticación al cambiar el estado del usuario
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);  // El usuario está autenticado
      } else {
        setUser(null);  // El usuario no está autenticado
      }
    });
  
    return () => unsubscribe();
  }, []);
  
  
  // Maneja los cambios en el formulario de login
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  // Maneja el envío del formulario de login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginData.email, loginData.password);
      console.log("Usuario autenticado:", userCredential.user);
      navigate("/dashboard");  // Redirige a la página del dashboard
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
    }
  };

  // Maneja los cambios en el formulario de registro
  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
    if (name === "password" || name === "confirmPassword") {
      setValidMatch(registerData.password === registerData.confirmPassword);
    }
  };

  // Maneja el envío del formulario de registro
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validPwd || !validMatch) {
      console.log("Las contraseñas no son válidas o no coinciden.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, registerData.email, registerData.password);
      console.log("Usuario registrado:", userCredential.user);
      navigate("/dashboard");  // Redirige a la página del dashboard
    } catch (error) {
      console.error("Error al registrar usuario:", error.message);
    }
  };

  return (
    <div>
      <Container fluid className="seccion-inicio">
        <Row className="background-container">
          <img className="background-header" src={fondo1} alt="Fondo" />
        </Row>
        <Row>
          <div className="intro-inicio">
            <Col xs={6} md={6} className="col1-intro">
              <h4> ¿Pensando en escalar? </h4>
              <h3> ¡Desafía tus límites! </h3>
              <p>Te invitamos a descubrir una experiencia de escalada única en un entorno lleno de retos y amistad. Nuestro rocódromo cuenta con instalaciones de primera y una comunidad apasionada, ideal tanto para principiantes como para expertos. Únete a nosotros para mejorar, divertirte y superar tus propios límites rodeado de amigos.</p>
              <Link to="/tarifas">
                <Button variant="primary" className="info-btn">
                  ¡Quiero ir a probar!
                </Button>
              </Link>
            </Col>
            <Col xs={6} md={6} className="col2-intro">
              <video className="video-intro" autoPlay loop muted>
                <source src={video1} type="video/mp4" />
                Tu navegador no soporta el formato de video.
              </video>
            </Col>
          </div>
        </Row>


        <Row>
          <div className="tarjetas-container">
          <Col xs={4} md={4} className="col3-inicio">
          <Link to="/primero" className="card-link">
            <div className="recuadro-inicio">
              <img className="icono-img" src={icono1} alt="Icono" />
              <h5>Mi primer día</h5>
              <p>Descubre que puedes hacer en nuestro roco</p>
            </div>
            </Link>
          </Col>

          <Col xs={4} md={4} className="col4-inicio">
          <Link to="/galeria" className="card-link">
            <div className="recuadro-inicio">
              <img className="icono-img" src={icono2} alt="Icono" />
              <h5>Instalaciones</h5>
              <p>¡Echa un vistazo y conócenos!</p>
            </div>
            </Link>
          </Col>

          <Col xs={4} md={4} className="col5-inicio">
          <Link to="/tarifas" className="card-link">
            <div className="recuadro-inicio">
              <img className="icono-img" src={icono3} alt="Icono" />
              <h5>Ven a visitarnos</h5>
              <p>Todo tipo de entradas y actividades.</p>
            </div>
            </Link>
          </Col>
          </div>
        </Row>

        <Row>
        <div className="tarjetas-container">
          <Col xs={4} md={4} className="col3-inicio">
          <Link to="/contacto" className="card-link">
            <div className="recuadro-inicio">
              <img className="icono-img" src={icono5} alt="Icono" />
              <h5>Contacto</h5>
              <p>¿Necesitas algo?</p>
            </div>
            </Link>
          </Col>

          <Col xs={4} md={4} className="col4-inicio">
          <Link to="https://www.thecrag.com/es/home" target="_blank" rel="noopener noreferrer" className="card-link">
            <div className="recuadro-inicio">
              <img className="icono-img" src={icono6} alt="Icono" />
              <h5>Foro</h5>
              <p>Un foro de escaladores para escaladores</p>
            </div>
            </Link>
          </Col>

          <Col xs={4} md={4} className="col5-inicio">
          <Link to="/usuarios" className="card-link">
            <div className="recuadro-inicio">
              <img className="icono-img" src={icono4} alt="Icono" />
              <h5>Zona de socios</h5>
              <p>¡Registrate y participa!</p>
            </div>
            </Link>
          </Col>
          </div>
        </Row>

      </Container>
    </div>
  );
}

export default Inicio;
