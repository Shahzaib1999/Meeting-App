import React, { Component } from 'react';
import './App.css';
// import firebase from './Config/firebase';
import { Router, Route, Redirect } from "react-router-dom";
import createBrowserHistory from "history/createBrowserHistory";
import * as firebase from "firebase";
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import Dashboard from "./components/Dashboard/Dashboard";
import Meetings from "./components/Meetings/Meetings";
import Requests from "./components/Requests/Requests";
import Profile from "./components/Profile/Profile";
import Picture from "./components/Edit/Picture";
import Data from "./components/Edit/Data";
import { Provider } from "react-redux";
import store from "./Redux/store";


const customHistory = createBrowserHistory();
// const provider = new firebase.auth.FacebookAuthProvider();

class App extends Component {
  constructor() {
    super();

    this.state = {
      user: false    
  }
  }
  componentWillMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.setState({ user: true, uid: user.uid });
        localStorage.setItem("uid", user.uid);
      } else {
        this.setState({ user: false });
      }
    });
  }

  render() {
    return <Provider store={store}>
      <Router history={customHistory}>
        <div>
          <Navbar />
          {/* <Home /> */}
          <Route exact path="/" component={Home} />
          <Route path="/Dashboard" component={Dashboard} />
          <Route path="/Meetings" component={Meetings} />
          <Route path="/Requests" component={Requests} />
          <Route path="/Profile" component={Profile} />
          <Route path="/Picture" component={Picture} />
          <Route path="/Data" component={Data} />
          {/* <Route path="/" Component={} /> */}
        </div>
      </Router>
    </Provider>;
  }
}

export default App;
