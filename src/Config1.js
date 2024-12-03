import Firebase from 'firebase';
const config = {
    apiKey: "AIzaSyCGVDUjCYG1u6J_A89UQDwWONq6KFYGL6Y",
    authDomain: "geniusgenie-94672.firebaseapp.com",
    databaseURL: "https://geniusgenie-94672-default-rtdb.firebaseio.com",
    projectId: "geniusgenie-94672",
    storageBucket: "geniusgenie-94672.appspot.com",
    messagingSenderId: "1057056581980",
    appId: "1:1057056581980:web:874c1136a1d9dcea727999",
    measurementId: "G-Y1CGPCF2QM"
};


let firebase = Firebase.initializeApp(config);
export default firebase