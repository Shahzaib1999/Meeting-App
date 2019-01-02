import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as firebase from "firebase";

const config = { 
    apiKey: "AIzaSyBfbB4ASPoDn8BxR5KY1MNgIjodjhxS8Co", 
    authDomain: "meeting-app-1999.firebaseapp.com", 
    databaseURL: "https://meeting-app-1999.firebaseio.com", 
    projectId: "meeting-app-1999", 
    storageBucket: "meeting-app-1999.appspot.com", 
    messagingSenderId: "816278550808" };

    firebase.initializeApp(config);

    // const timestamp = snapshot.get('created_at');
    // const date = timestamp.toDate();

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
