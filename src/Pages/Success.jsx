import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Importa Firestore
import { Container, Row, Button } from 'react-bootstrap';
import { Link } from "react-router-dom"; 
import fondo1 from '../assets/fondo1.jpg';
import '../Styles/Success.css';

function Success() {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null); // Agregado para almacenar el nombre
  const [productName, setProductName] = useState(null);
  const [error, setError] = useState(null);

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid); // Guardamos el uid del usuario

        // Consulta a Firestore para obtener el nombre del usuario
        const userDocRef = doc(db, 'users', user.uid); // Referencia al documento del usuario en Firestore
        try {
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(userData.name); // Guardamos el nombre del usuario
          } else {
            console.log("No se encontró el documento del usuario.");
            setUserName('Usuario desconocido'); // Si no se encuentra, asignamos un valor predeterminado
          }
        } catch (err) {
          console.error("Error al obtener el nombre:", err);
          setError('Hubo un error al obtener el nombre del usuario.');
        }
      } else {
        setUserId(null);
        setUserName(null); // Si no hay usuario autenticado
      }
    });

    return () => unsubscribe();
  }, [auth, db]); // Dependencias de useEffect

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    console.log('Session ID recibido en frontend:', sessionId);

    if (!sessionId) {
      setError('No se encontró el session_id en la URL');
      return;
    }

    const fetchSessionData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/success?session_id=${sessionId}`);
        const data = await response.json();

        if (!response.ok) {
          setError('Error al obtener la información: ' + response.statusText);
          return;
        }

        console.log('Datos de la sesión:', data);  // Verifica los datos recibidos

        if (data.userId && data.productName) {
          setUserId(data.userId);  // Guardar el nombre del usuario
          setProductName(data.productName);  // Guardar el nombre del producto
        } else {
          setError('No se obtuvo userId o productName');
        }

      } catch (error) {
        setError('Error al obtener la sesión: ' + error.message);
      }
    };

    fetchSessionData();
  }, []);

  return (
    <div>
      <Container fluid className="seccion-success">
        <Row className="success-container">
          <img className="background-success" src={fondo1} alt="Fondo" />
          <h2>Todo ha salido perfectamente</h2>
        </Row>

        <Row className="compra-container">
          <h1>¡Gracias por tu compra,</h1>
          {userName && productName ? (
            <div>
              <h1>{userName}!</h1> {/* Mostrar el nombre del usuario */}
              <h5>La entrada que has adquirido:</h5>
              <h6>{productName}</h6>
              <p>Esta es solo una página para que sepas que todo ha ido estupendamente</p>
              <p>Pulsa en el botón para ir a tu página de usuario</p>
              <Link to="/usuarios">
                <Button variant="primary" className="success-btn">
                  Usuarios
                </Button>
              </Link>
            </div>
          ) : (
            <p>Esperando datos...</p>
          )}
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </Row>
      </Container>
    </div>
  );
}

export default Success;
