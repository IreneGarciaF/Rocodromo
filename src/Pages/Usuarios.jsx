import React, { useState, useEffect } from 'react';
import { Container, Row, Button, Modal, Col } from 'react-bootstrap';
import { getFirestore, collection, getDocs, query, where, updateDoc, doc, getDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import QRCode from 'react-qr-code';
import Bloques from '../components/Bloques'
import '../Styles/Usuarios.css'

//imagnees
import fondo1 from '../assets/fondo1.jpg'
import foto1 from '../assets/bloque1.jpg'
import foto2 from '../assets/bloque2.jpg'
import foto3 from '../assets/bloque3.jpg'
import foto4 from '../assets/bloque4.jpg'


function Usuarios() {
  const [compras, setCompras] = useState([]);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState(null); 
  const [showQRCodeModal, setShowQRCodeModal] = useState(false); 
  const [qrValue, setQrValue] = useState('');
  
  const bloques = [
    {
      blockId: 'bloque1',
      name: 'Bloque 1',
      image: foto1,
    },
    {
      blockId: 'bloque2',
      name: 'Bloque 2',
      image: foto2,
    },
    {
      blockId: 'bloque3',
      name: 'Bloque 3',
      image: foto3,
    },
    {
      blockId: 'bloque4',
      name: 'Bloque 4',
      image: foto4,
    },
  ];
  
  const auth = getAuth();
  const db = getFirestore();

 

  // Monitoriza el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);  

        // Consulta a Firestore para obtener el nombre del usuario
        const userDocRef = doc(db, 'users', user.uid);  
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserName(userData.name);  
        } else {
          console.log("No se encontró el documento del usuario.");
          setUserName('Usuario desconocido');  
        }
      } else {
        setUserId(null);
        setUserName(null);  
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  // Obtiene las compras del usuario y sus detalles
  useEffect(() => {
    const fetchCompras = async (userId) => {
      if (!userId) {
        console.log("userId no disponible");
        return;
      }
  
      try {
        // Llamamos al backend para obtener las compras del usuario
        const response = await fetch(`https://rocodromo-6e10f953f248.herokuapp.com/get-compras/${userId}`);
        if (!response.ok) {
          throw new Error("Error en la solicitud");
        }
        const data = await response.json();
        console.log("Compras recibidas:", data);
  
        if (!data || data.length === 0) {
          console.log("No se encontraron compras.");
          return;
        }
  
        const db = getFirestore();
        const purchasesRef = collection(db, "purchases");
        const q = query(purchasesRef, where("userId", "==", userId));
  
        const querySnapshot = await getDocs(q);
  
        const updatedPurchases = data.map(compra => {
          const matchingPurchase = querySnapshot.docs.find(doc => doc.id === compra.sessionId);
          if (matchingPurchase) {
            return {
              ...compra,
              entradasDisponibles: matchingPurchase.data().entradasDisponibles || 0,
            };
          }
          return compra;
        });
  
        setCompras(updatedPurchases);
  
      } catch (error) {
        console.error("Error al obtener las compras:", error);
      }
    };
  
    if (userId) {
      fetchCompras(userId); 
    }
  }, [userId]);  
  
  
  

  // Función para obtener el producto 
  const getProductoPorPriceId = async (priceId) => {
    const db = getFirestore();
    const productosRef = collection(db, 'productos');
    const q = query(productosRef, where('priceId', '==', priceId));
    
    const querySnapshot = await getDocs(q);
 
    console.log(`Documentos encontrados para priceId ${priceId}:`, querySnapshot.size);
 
    if (!querySnapshot.empty) {
      const producto = querySnapshot.docs[0].data();
      console.log("Producto encontrado:", producto);
      return { 
        tipo: producto.tipo, 
        entradasDisponibles: producto.entradasDisponibles || 0, 
      };
    }

    console.log("Producto no encontrado para priceId:", priceId); 
    return { tipo: 'desconocido', entradasDisponibles: 0 };
  };
  const manejarUsoProducto = async (compra) => {
    if (compra.tipo === "entrada" && compra.entradasDisponibles > 0) {
      const confirmUso = window.confirm(
        "Estás a punto de utilizar una entrada. Hazlo en la puerta del rocódromo, ya que no podrás recuperar esta entrada. ¿Estás seguro?"
      );

      if (!confirmUso) return;

      try {
        const nuevasEntradasDisponibles = compra.entradasDisponibles - 1;
        
        const db = getFirestore();
        const purchasesRef = collection(db, "purchases");
        const q = query(purchasesRef, where("sessionId", "==", compra.sessionId));

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docRef = querySnapshot.docs[0].ref;
          await updateDoc(docRef, { entradasDisponibles: nuevasEntradasDisponibles });

          setCompras((prevCompras) => 
            prevCompras.map((item) =>
              item.sessionId === compra.sessionId
                ? { ...item, entradasDisponibles: nuevasEntradasDisponibles }
                : item
            )
          );

          console.log("Entrada utilizada. Entradas disponibles actualizadas.");
        }

        setQrValue(`Compra ID: ${compra.sessionId} - Producto: ${compra.name}`);


        setShowQRCodeModal(true);

      } catch (error) {
        console.error("Error al actualizar las entradas disponibles:", error);
      }
    } else if (compra.tipo === "abono") {
      alert("Abono utilizado. No se restan entradas.");

      setQrValue(`Abono ID: ${compra.sessionId} - Producto: ${compra.name}`);
      setShowQRCodeModal(true);
    } else {
      console.log("No hay entradas disponibles para utilizar.");
    }
  };

  const cerrarModal = () => {
    setShowQRCodeModal(false);
    setQrValue(""); 
  };

  
  return (
    <Container fluid className="seccion-usuarios">
      <Row className="ususarios-container">
            <img className="background-usuarios" src={fondo1}/>
            <h2> Estás en tu casa </h2>
      </Row>
      <Row className="usuarios-productos">
      <h1> ¡Bienvenido a tu página de usuario! </h1>
        <h3>Tus productos:</h3>
        <ul>
          {compras.length > 0 ? (
            compras.map((compra, index) => {
              return (
                <li className="lista-productos" key={index}>
                <div className="product-name-row">
                  <h6>Nombre del producto: </h6><h5>{compra.name}</h5>
                </div>

                {/* Información adicional */}
                <div className="product-info">
                  {compra.tipo === 'abono' && <p>Suscripción activa.</p>}
                  {compra.tipo === 'entrada' && <p>Entradas disponibles: {compra.entradasDisponibles}</p>}
                </div>

                {/* Botón de acción */}
                <div className="product-action">
                  {compra.tipo === 'entrada' && compra.entradasDisponibles > 0 && (
                    <Button className="utilizar-btn" variant="primary" onClick={() => manejarUsoProducto(compra)}>
                      Utilizar
                    </Button>
                  )}

                  {compra.tipo === 'abono' && (
                    <Button className="utilizar-btn" variant="primary" onClick={() => manejarUsoProducto(compra)}>
                      Utilizar
                    </Button>
                  )}
                </div>
              </li>

              );
            })
          ) : (
            <p>No tienes productos registrados.</p>
          )}
        </ul>
      </Row>

      <Modal show={showQRCodeModal} onHide={cerrarModal}>
        <Modal.Header closeButton>
          <Modal.Title>Código QR</Modal.Title>
        </Modal.Header>

        <Modal.Body className="modal-body-centered">
          <QRCode value={qrValue} size={256} level="H" />
          <p>Escanea este código para entrar al roco.</p>
        </Modal.Body>

        <Modal.Footer className="modal-footer-centered">
          <Button variant="secondary" onClick={cerrarModal}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
      
      <Row className="seccion-escalada">
      <h3>La sección de escalada</h3>
      <h4>¿Que bloques has encadenado? ¡Cuéntanoslo y que lo vean tus compis!</h4>
        {bloques.length > 0 && (
          <Row className="bloque-bloques">
            {bloques.map((bloque, index) => (
              <Col key={index} md={6} className="mb-4">
                <Bloques 
                  image={bloque.image} 
                  name={bloque.name} 
                  blockId={bloque.blockId} 
                />
              </Col>
            ))}
          </Row>
        )}
      </Row>
    </Container>
  );
}

export default Usuarios;