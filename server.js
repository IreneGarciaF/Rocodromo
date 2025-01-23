import express from 'express';
import stripeLib from 'stripe'; 
import cors from 'cors'; 
import admin from 'firebase-admin';
import bodyParser from 'body-parser';  
import dotenv from 'dotenv'; 

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Esto es para corregir los saltos de línea
  }),
});

const db = admin.firestore();  

const endpointSecret = 'whsec_UAdRmIp7LyIIbaX7JIuXigJDrb0JlcN3';
const stripe = stripeLib('sk_test_51QcqgCQG9VO4iB05bb8o5yxEw7lxBmIXT25bpzX2LTWpqCWCmegN3ATnIJlBGT8eqPoMesRzj1xBSPM2rf9lxk5v00cvAfpshR');  
const app = express();


app.use(bodyParser.json());  
app.use(cors());


// Middleware para asegurarse de que el cuerpo sea crudo y sin procesar
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  const endpointSecret = 'whsec_UAdRmIp7LyIIbaX7JIuXigJDrb0JlcN3'; 

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook error:', err);
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  // Handle the checkout session completed event
   if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Actualizar el estado de la compra en Firestore
    const purchaseRef = db.collection('purchases').doc(session.id);
    await purchaseRef.update({
      comprado: true, // Marcar como comprado
    });
  }
  res.status(200).send('Evento recibido');
});



// Rutas para crear las sesiones de pago (mantén el resto del código igual)
app.post('/create-checkout-session', async (req, res) => {
  const { userId, priceId, name } = req.body;
  try {
  const entradasPorProducto = {
    "price_1QcqlcQG9VO4iB05PdHXTAeM": 1, 
    "price_1QcqmcQG9VO4iB05GhGi9Gy7": 1, 
    "price_1QcqnUQG9VO4iB054FkIspJX": 1, 
    "price_1Qcqo7QG9VO4iB052aKk01J3": 10, 
    "price_1QcqoxQG9VO4iB05OEgxk82Z": 10,
  };

  // Determinar el número de entradas según el priceId
  const entradasDisponibles = entradasPorProducto[priceId] || 0;

    // Crear la sesión de Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/cancel`,
    });

    // Almacenar la compra en Firestore
    const purchaseRef = db.collection('purchases').doc(session.id);
    await purchaseRef.set({
      userId,
      sessionId: session.id,
      name, 
      fecha: new Date().toISOString(), 
      entradasDisponibles, 
    });

    // Enviar el ID de la sesión de Stripe al frontend
    res.json({ id: session.id });
  } catch (error) {
    console.error('Error al crear la sesión de pago:', error);
    res.status(500).send('Error interno del servidor');
  }
});


// Endpoint para crear una sesión de checkout para suscripción
app.post('/create-checkout-session-subscription', async (req, res) => {
  const { userId, priceId, name } = req.body;

  // Verifica si los datos son válidos
  if (!userId || !priceId || !name) {
    return res.status(400).json({ error: 'Faltan datos necesarios (userId, priceId, name).' });
  }

  try {
    // Verifica si ya existe una compra con el mismo priceId y userId
    const comprasRef = db.collection('purchases');
    const snapshot = await comprasRef.where('userId', '==', userId).where('name', '==', name).get();

    if (!snapshot.empty) {
      return res.status(400).json({ error: 'Ya tienes un abono activo, no puedes comprar otro.' });
    }

    // Crear la sesión de Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,  
          quantity: 1,      
        },
      ],
      mode: 'subscription',
      success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/cancel`,
    });

    // Almacenar la compra en Firestore
    const purchaseRef = db.collection('purchases').doc(session.id);
    await purchaseRef.set({
      userId,
      sessionId: session.id,
      name,
      tipo: 'suscripción',
      fecha: new Date().toISOString(),
    });

    // Devolver la sesión de Stripe como JSON
    res.json({ id: session.id });
  } catch (error) {
    console.error('Error al crear la sesión de suscripción:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});





app.get('/success', async (req, res) => {
  const sessionId = req.query.session_id;
  console.log('Session ID recibido:', sessionId);  // Verifica que el sessionId se recibe correctamente

  try {
    // Buscar la compra en Firestore usando el sessionId
    const purchaseRef = db.collection('purchases').doc(sessionId);
    const purchaseDoc = await purchaseRef.get();

    if (!purchaseDoc.exists) {
      return res.status(404).send('Compra no encontrada');
    }

    const purchaseData = purchaseDoc.data();
    console.log('Datos de la compra:', purchaseData);  // Verifica los datos de la compra

    // Obtener el nombre del usuario
    const userRef = db.collection('users').doc(purchaseData.userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).send('Usuario no encontrado');
    }

    const userData = userDoc.data();
    console.log('Datos del usuario:', userData);  // Verifica los datos del usuario

    const productName = purchaseData.name;  // Usar el campo 'name' en lugar de 'productName'

    // Enviar los datos al frontend
    res.json({
      userId: userData.name, // Nombre del usuario
      productName: productName, // Nombre del producto
    });

  } catch (error) {
    console.error('Error al obtener los datos:', error);
    res.status(500).send('Error al obtener los datos de la compra');
  }
});

// Backend: Obtener las compras de un usuario
app.get('/get-compras/:userId', async (req, res) => {
  const userId = req.params.userId;
  try {
    // Obtener las compras del usuario
    const comprasRef = db.collection('purchases');
    const snapshot = await comprasRef.where('userId', '==', userId).get();

    if (snapshot.empty) {
      return res.status(404).send('No se encontraron compras para este usuario');
    }

    // Obtener los datos de las compras
    const compras = await Promise.all(snapshot.docs.map(async (doc) => {
      const compraData = doc.data();
      
      // Obtener los detalles del producto relacionado con esta compra
      const productoRef = db.collection('productos').where('nombre', '==', compraData.name);
      const productoSnapshot = await productoRef.get();

      let tipo = '';
      let entradasDisponibles = 0;
      
      // Si encontramos el producto
      if (!productoSnapshot.empty) {
        const productoData = productoSnapshot.docs[0].data();
        tipo = productoData.tipo;  // 'entrada' o 'abono'
        entradasDisponibles = productoData.entradasDisponibles;  // 1 o 10
      }

      return {
        ...compraData,
        tipo,  // Añadimos el tipo de producto (entrada o abono)
        entradasDisponibles  // Añadimos el número de entradas disponibles
      };
    }));

    console.log('Compras con detalles:', compras); // Log para verificar los datos
    res.json(compras);
  } catch (error) {
    console.error('Error al obtener las compras:', error);
    res.status(500).send('Error al obtener las compras');
  }
});



app.post('/actualizar-compra', async (req, res) => {
  const { compraId, tipo, entradasDisponibles } = req.body;
  console.log("Actualizando compra:", compraId, tipo, entradasDisponibles);

  try {
    const compraRef = db.collection('purchases').doc(compraId);

    const compraDoc = await compraRef.get();

    if (!compraDoc.exists) {
      return res.status(404).send('Compra no encontrada');
    }

    const compraData = compraDoc.data();

    if (tipo === 'entrada') {
      if (entradasDisponibles === 1) {
        // Si es una entrada de un solo uso, eliminar el producto
        await compraRef.delete();
        return res.status(200).send('Entrada utilizada y eliminada');
      } else {
        // Si es un pack, actualizar el contador de entradas disponibles
        await compraRef.update({
          entradasDisponibles: entradasDisponibles - 1,
        });
        return res.status(200).send('Entrada utilizada, contador actualizado');
      }
    } else {
      return res.status(400).send('Tipo de compra no válido');
    }
  } catch (error) {
    console.error('Error al actualizar la compra:', error);
    res.status(500).send('Error interno del servidor');
  }
});



app.listen(3001, () => {
  console.log('Server running on port 3001');
});