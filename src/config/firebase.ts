import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, getReactNativePersistence, initializeAuth, type Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

import { secureStorage } from '@/services/secureStorage';

// Config pública do app Web do Firebase (lida do .env). Não é credencial privada:
// quem protege os dados são as regras do Firestore (firestore.rules).
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const jaIniciado = getApps().length > 0;
const app = jaIniciado ? getApp() : initializeApp(firebaseConfig);

// A sessão (que contém tokens) fica no SecureStore, criptografada, e não no AsyncStorage.
export const auth: Auth = jaIniciado
  ? getAuth(app)
  : initializeAuth(app, { persistence: getReactNativePersistence(secureStorage) });

export const db = getFirestore(app);
