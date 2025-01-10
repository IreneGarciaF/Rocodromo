import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../firebase-config';

const ProtectedRoute = ({ element }) => {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  if (user === null) {
    // Si no sabemos si el usuario está autenticado aún, no renderizamos nada
    return null;
  }

  if (!user) {
    // Si no está autenticado, redirigimos a /login
    return <Navigate to="/login" />;
  }

  // Si está autenticado, renderizamos el componente
  return element;
};

export default ProtectedRoute;
