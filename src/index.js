import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as firebase from "firebase";

const config = { 
    apiKey: "Your Key", 
    authDomain: "meeting-app-1999.firebaseapp.com", 
    databaseURL: "db url", 
    projectId: "meeting-app-1999", 
    storageBucket: "meeting-app-1999.appspot.com", 
    messagingSenderId: "Your ID" };

    firebase.initializeApp(config);


ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
