import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage"
import { firebaseConfig } from "../../config";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const imDB = getStorage(app)
getAnalytics(app);

export {imDB};
