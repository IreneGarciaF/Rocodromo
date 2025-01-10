import React, { useState, useEffect } from 'react';
import '../Styles/Header.css';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase-config';  // Importa auth
import { signOut } from 'firebase/auth';

// Imágenes y Bootstrap
import logo from '../assets/logo.png';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';

function Header() {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState(""); // Estado para el nombre del usuario
  const navigate = useNavigate();

  // Función de manejo de cierre de sesión
  const handleLogout = async () => {
    try {
      await signOut(auth); // Cierra sesión en Firebase
      console.log("Sesión cerrada correctamente.");
      setUser(null); // Limpia el estado de usuario
      setUserName(""); // Limpia el nombre
      navigate("/"); // Redirige al inicio
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("Estado de autenticación:", user);

      if (user) {
        setUser(user); // Establece el usuario autenticado
        console.log("Usuario autenticado:", user);

        // Obtener el nombre del usuario desde Firestore (si existe)
        const getUserName = async () => {
          try {
            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              setUserName(userSnap.data().name); // Si existe el nombre, asignarlo
            } else {
              setUserName("Usuario"); // Si no hay nombre, usar "Usuario"
            }
          } catch (error) {
            console.error("Error al obtener el nombre:", error);
            setUserName("Usuario");
          }
        };

        getUserName(); // Ejecutar la función
      } else {
        setUser(null); // Limpiar el estado si no hay usuario
        setUserName(""); // Limpiar el nombre
      }
    });

    return () => unsubscribe(); // Limpiar la suscripción cuando el componente se desmonte
  }, []);

  return (
    <>
      <Navbar bg="light" className="navbar">
        <Container fluid className="cabecera">
          <div className="logo-container">
            <Navbar className="logo" href="#">
              <img className="logo-img" src={logo} alt="Logo" />
              <Navbar.Brand href="#home">Rocódromo</Navbar.Brand>
            </Navbar>
          </div>
          <div className="container-header">
            {user && (
              <Nav className="welcome">
                <span className="welcome-message">Bienvenido, {userName || user.email}</span>
              </Nav>
            )}

            <Nav className="Enlaces">
              <Nav.Item>
                <Nav.Link as={Link} to="/">Inicio</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/tarifas">Tarifas</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/galeria">Galería</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/primero">¿Tu primer día?</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link as={Link} to="/contacto">Contacto</Nav.Link>
              </Nav.Item>

              {!user && (
                <Nav.Item>
                  <Nav.Link as={Link} to="/login">Login</Nav.Link>
                </Nav.Item>
              )}

              {user && (
                <Nav.Item>
                  <Nav.Link as={Link} to="/usuarios">Usuarios</Nav.Link>
                </Nav.Item>
              )}
            </Nav>

            {user && (
              <Nav className="cerrar-sesion">
                <Nav.Item>
                  <Nav.Link as={Link} to="/login" onClick={handleLogout}>Cerrar sesión</Nav.Link>
                </Nav.Item>
              </Nav>
            )}
          </div>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
