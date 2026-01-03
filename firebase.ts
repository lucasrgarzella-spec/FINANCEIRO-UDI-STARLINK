import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuração do Firebase
// IMPORTANTE: Para o app funcionar em produção, você deve usar suas chaves reais do Console Firebase.
const firebaseConfig = {
  apiKey: "AIzaSyAsPlaceholder_SUBSTITUA_PELA_SUA_CHAVE",
  authDomain: "starlink-stock-pro.firebaseapp.com",
  projectId: "starlink-stock-pro",
  storageBucket: "starlink-stock-pro.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// Singleton pattern para inicialização
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

export default app;