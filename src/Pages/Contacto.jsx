import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import '../Styles/Contacto.css'; // Aquí cargamos el CSS de la página

const Contacto = () => {
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    phone: '',
    comments: '',
  });
  const [validEmail, setValidEmail] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Validación del correo electrónico
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailValidation = () => {
    const result = EMAIL_REGEX.test(contactData.email);
    setValidEmail(result);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validEmail) {
      setErrorMsg('Por favor ingresa un correo electrónico válido.');
      return;
    }
    alert('Formulario enviado, te responderemos con la mayor brevedad posible');
    setContactData({ name: '', email: '', phone: '', comments: '' });
    setErrorMsg('');
  };

  return (
    <div className="contacto-page">
      <main>
        <div className="contacto_todo">
          <div className="caja_trasera">
            <div className="caja_trasera-contacto">
              <h3>¿Quieres decirnos algo?</h3>
              <p>Estamos aquí para ayudarte. ¡Envíanos tu mensaje!</p>
            </div>
          </div>
          <div className="contenedor_contacto">
            <Form onSubmit={handleSubmit} className="formulario_contacto">
              <h2>Contáctanos</h2>
              <Form.Group controlId="formBasicName">
                <Form.Control
                  type="text"
                  placeholder="Tu nombre"
                  name="name"
                  value={contactData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group controlId="formBasicEmail">
                <Form.Control
                  type="email"
                  placeholder="Correo electrónico"
                  name="email"
                  value={contactData.email}
                  onChange={(e) => {
                    handleChange(e);
                    handleEmailValidation();
                  }}
                  required
                />
                {!validEmail && contactData.email && (
                  <div className="error-message">El correo no es válido.</div>
                )}
              </Form.Group>

              <Form.Group controlId="formBasicPhone">
                <Form.Control
                  type="text"
                  placeholder="Teléfono (opcional)"
                  name="phone"
                  value={contactData.phone}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formBasicComments">
                <Form.Control
                  as="textarea"
                  rows={4}
                  placeholder="Comentarios"
                  name="comments"
                  value={contactData.comments}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {errorMsg && <div className="error-message">{errorMsg}</div>}

              <Button type="submit" disabled={!validEmail}>
                Enviar
              </Button>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contacto;
