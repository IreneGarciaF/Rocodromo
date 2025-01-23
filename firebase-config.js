// backend/firebase-config.js (Node.js en Render)

import { initializeApp, credential } from 'firebase-admin';
import * as admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

const app = initializeApp({
  credential: credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL, // si usas Firebase Realtime DB
});

const db = admin.firestore();
const auth = admin.auth();

export { app, db, auth };
