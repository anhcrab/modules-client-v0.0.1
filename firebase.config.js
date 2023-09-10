import { initializeApp } from "firebase/app";
import { getAuth, FacebookAuthProvider} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyDmZCMDeeFjjD6lLz4bvIjiPUCn-6eR3k8",
  authDomain: "modules-2c73c.firebaseapp.com",
  projectId: "modules-2c73c",
  storageBucket: "modules-2c73c.appspot.com",
  messagingSenderId: "359550324852",
  appId: "1:359550324852:web:dd7202ee1eb77ea0884121",
  measurementId: "G-VGK553LEY4",
  hosting: {
    localhost: {
      auth: {
        allow: true
      }
    }
  }
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const provider = new FacebookAuthProvider()

export { auth, provider }
