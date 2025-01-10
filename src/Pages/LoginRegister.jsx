import React, { useState, useEffect, createContext, useContext } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import '../Styles/Login.css';

const USER_REGEX = /^[a-zA-Z0-9-_ \s]{3,25}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%*]).{8,24}$/;

const LoginRegister = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isFormMoved, setIsFormMoved] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [user, setUser] = useState(null);
  
  // Estados de validación
  const [validPwd, setValidPwd] = useState(false);
  const [validMatch, setValidMatch] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Inicializar Firebase Auth y Firestore
  const auth = getAuth();
  const db = getFirestore();

  // Contexto para el usuario
  const UserContext = createContext();
  const useUser = () => useContext(UserContext);

  const navigate = useNavigate();

  // Validación de la contraseña y comparación con la confirmación
  useEffect(() => {
    const result = PWD_REGEX.test(registerData.password);
    setValidPwd(result);
    setValidMatch(registerData.password === registerData.confirmPassword);
  }, [registerData.password, registerData.confirmPassword]);

  // Verificar el estado de autenticación al inicio
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Cargar los datos adicionales del usuario desde Firestore
        const userDocRef = doc(db, "users", currentUser.uid);
        getDoc(userDocRef).then((docSnapshot) => {
          if (docSnapshot.exists()) {
            setUser((prev) => ({ ...prev, ...docSnapshot.data() }));
          }
        });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Maneja los cambios en los formularios
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (isRegistering) {
      setRegisterData((prev) => ({ ...prev, [name]: value }));
    } else {
      setLoginData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Cambiar a la vista de registro
  const handleRegisterClick = () => {
    setIsRegistering(true);
    setIsFormMoved(true);
  };

  // Cambiar a la vista de login
  const handleLoginClick = () => {
    setIsRegistering(false);
    setIsFormMoved(false);
  };

  // Manejo del formulario de login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = loginData;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoginData({ email: "", password: ""});
      navigate('/usuarios'); 
    } catch (error) {
      setErrorMsg("Error al iniciar sesión: " + error.message);
    }
  };

  // Manejo del formulario de registro
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validPwd || !validMatch) {
      setErrorMsg("Las contraseñas no son válidas o no coinciden.");
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, registerData.email, registerData.password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), { name: registerData.name, email: registerData.email, createdAt: new Date() });
      setRegisterData({ name: "", email: "", password: "", confirmPassword: "" });
      setIsRegistering(false);
      alert("¡Te has registrado con éxito! Ya puedes iniciar sesión.");
    } catch (error) {
      setErrorMsg("Error al registrar usuario: " + error.message);
      alert("Error al registrar usuario: " + error.message);
    }
  };

  return (
    <div className="login-page">
      <main>
        <div className="contenedor_todo">
          <div className="caja_trasera">
            <div className="caja_trasera-login">
              <h3>¿Ya tienes una cuenta?</h3>
              <p>Inicia sesión para entrar en la página</p>
              <Button onClick={handleLoginClick}>Iniciar sesión</Button>
            </div>
            <div className="caja_trasera-registrar">
              <h3>¿Aún no tienes cuenta?</h3>
              <p>Regístrate para iniciar sesión</p>
              <Button onClick={handleRegisterClick}>Registrarse</Button>
            </div>
          </div>
          <div className={`contenedor_login-registrar ${isFormMoved ? "moved" : ""}`}>
            <Form className={`formulario_login ${isRegistering ? "formulario_hidden" : "formulario_visible"}`} onSubmit={handleLoginSubmit}>
              <h2>Iniciar sesión</h2>
              <Form.Group controlId="formBasicEmail">
                <Form.Control type="email" placeholder="Correo Electrónico" name="email" value={loginData.email} onChange={handleChange} />
              </Form.Group>
              <Form.Group controlId="formLoginPassword">
                <Form.Control type="password" placeholder="Contraseña" name="password" value={loginData.password} onChange={handleChange} />
              </Form.Group>
              {errorMsg && <div className="error-message">{errorMsg}</div>}
              <Button type="submit">Entrar</Button>
            </Form>

            <Form className={`formulario_registro ${isRegistering ? "formulario_visible" : "formulario_hidden"}`} onSubmit={handleRegisterSubmit}>
              <h2>Registrarse</h2>
              <Form.Group controlId="formBasicName">
                <Form.Control type="text" placeholder="Nombre de Usuario" name="name" value={registerData.name} onChange={handleChange} />
              </Form.Group>
              <Form.Group controlId="formBasicEmail">
                <Form.Control type="email" placeholder="Correo electrónico" name="email" value={registerData.email} onChange={handleChange} />
              </Form.Group>
              <Form.Group controlId="formRegisterPassword">
                <Form.Control type="password" placeholder="Contraseña" name="password" value={registerData.password} onChange={handleChange} />
                {!validPwd && <div className="error-message">La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una minúscula, un número y un carácter especial.</div>}
              </Form.Group>
              <Form.Group controlId="formBasicConfirmPassword">
                <Form.Control
                  type="password"
                  placeholder="Repite tu contraseña"
                  name="confirmPassword"
                  value={registerData.confirmPassword}
                  onChange={handleChange}
                />
                {registerData.confirmPassword && (
                  <div className="password-feedback">
                    {!validMatch && (
                      <div className="error-message">
                        Las contraseñas no coinciden
                        <FaTimes className="invalid-icon" />
                      </div>
                    )}
                    {validMatch && (
                      <div className="valid-message">
                        Las contraseñas coinciden
                        <FaCheck className="valid-icon" />
                      </div>
                    )}
                  </div>
                )}
              </Form.Group>

              <Button type="submit" disabled={!validMatch}>Registrarse</Button>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginRegister;
