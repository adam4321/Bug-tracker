/*****************************************************************
**  Description: Firebase database and storage configuration file
*****************************************************************/

// Api key
import credentials from './credentials.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: credentials.firebase_credential,
    authDomain: credentials.authDomain,
    databaseURL: credentials.databaseURL,
    projectId: credentials.projectId,
    storageBucket: credentials.storageBucket,
    messagingSenderId: credentials.messagingSenderId,
    appId: credentials.appId
};

firebase.initializeApp(firebaseConfig);
export default firebase;