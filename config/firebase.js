import { initializeApp } from 'firebase/app';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBeFXmW8dylTDIQentv_pxyuPQts30HWRw",
  authDomain: "marmicraft-784fb.firebaseapp.com",
  projectId: "marmicraft-784fb",
  storageBucket: "marmicraft-784fb.appspot.com",
  messagingSenderId: "532741298249",
  appId: "1:532741298249:web:e91b5b7b7182b40b528798"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;