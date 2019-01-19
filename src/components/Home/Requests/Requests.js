/* eslint-disable no-undef */
/* global google */
import React, { Component } from "react";
import "../../App.css";
import * as firebase from 'firebase';
import swal from 'sweetalert';
import UserAvatar from "react-user-avatar";
import { withGoogleMap, GoogleMap, Marker, DirectionsRenderer, withScriptjs } from "react-google-maps";

class Dashboard extends Component {
  constructor() {
    super();

    this.state = {
      uid: "",
      data: [],
      map: false,
      coords: {}
    };

    this.requests = this.requests.bind(this);
    this.getDirections = this.getDirections.bind(this);
    this.back = this.back.bind(this);
  }

  componentWillMount() {
    const db = firebase.firestore();

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        db.collection('users').doc(user.uid).get().then(res => {
          if (res.exists) {
            this.setState({
              name: res.data().name,
              latitude: res.data().latitude,
              longitude: res.data().longitude,
              user: true,
              uid: user.uid
            });
            this.requests();
          }
        });
      } else {
        this.props.history.replace("/");
      }
    });

  }

  componentDidMount() {
    this.setPosition();
  }

  setPosition() {
    navigator.geolocation.getCurrentPosition(position => {
      this.setState({ coords: position.coords })
    });
  }

  getDirections() {
    const { latitude, longitude, resLat, resLon } = this.state;
    const DirectionsService = new google.maps.DirectionsService();

    debugger;

    var a = 24.8812296;
    var b = 67.0727269;
    DirectionsService.route(
      {
        origin: new google.maps.LatLng(latitude, longitude),
        destination: new google.maps.LatLng(resLat, resLon),
        travelMode: google.maps.TravelMode.DRIVING
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result
          });
        } else {
          alert("Sorry! Can't calculate directions!");
        }
      }
    );
  }

  directions(lat, lon) {
    this.setState({ resLat: lat, resLon: lon, map: true });
    // ()=> this.getDirections();
  }

  back() {
    this.setState({ resLat: false, resLon: false })
    this.setState({ map: false });
  }

  requests() {
    const db = firebase.firestore();
    const { uid } = this.state;

    db.collection("meeting")
      .where("reciever", "==", uid)
      .where("request", "==", false)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.size) {
          // document.getElementById("request").innerHTML = "";

          querySnapshot.forEach(res => {

            var st = res.data().time;
            var et = res.data().endtime;
            var starthour = Math.round(st / 3600000);
            var startmin = (st % 3600000) / 60000;
            var endhour = Math.round(et / 3600000);
            var endmin = (et % 3600000) / 60000;

            if (starthour < 10) {
              starthour = "0" + starthour;
            }
            if (startmin < 10) {
              startmin = "0" + startmin;
            }

            if (endhour < 10) {
              endhour = "0" + endhour;
            }
            if (endmin < 10) {
              endmin = "0" + endmin;
            } 

            var a = { id: res.id, to: res.data().reciever, userName: res.data().name, restaurant: res.data().restaurant, date: res.data().date, time: starthour + ":" + startmin, endtime: endhour + ":" + endmin, userpic: res.data().pic, pic: res.data().userpic, resLat: res.data().resLat, resLon: res.data().resLon, request: "Pending" };
            this.setState({ data: [...this.state.data, a] });
            // var jumbotron = document.createElement("div");
            // var h2 = document.createElement("h2");
            // var h4 = document.createElement("h4");
            // var h42 = document.createElement("h4");
            // var h43 = document.createElement("h4");
            // var data = document.getElementById("request");
            // var btn = document.createElement("button");
            // var btn1 = document.createElement("button");

            // h2.setAttribute("id", "font");
            // btn.setAttribute("class", "btn btn-success mt-3");
            // btn.addEventListener("click", () => this.accept(res.id));
            // btn1.addEventListener("click", () => this.decline(res.id));
            // btn1.setAttribute("class", "btn btn-danger mt-3 ml-3");
            // jumbotron.setAttribute(
            //   "class",
            //   "jumbotron border border-primary mt-5"
            // );

            // h2.innerHTML = "From: " + res.data().sender;
            // h4.innerHTML = "Venue: " + res.data().restaurant;
            // h42.innerHTML = "Date: " + res.data().date;
            // h43.innerHTML = "Time: " + res.data().time;
            // btn.innerHTML = "Accept";
            // btn1.innerHTML = "Decline";

            // jumbotron.appendChild(h2);
            // jumbotron.appendChild(h4);
            // jumbotron.appendChild(h42);
            // jumbotron.appendChild(h43);
            // jumbotron.appendChild(btn);
            // jumbotron.appendChild(btn1);
            // data.appendChild(jumbotron);
          });
        }
      })
      .catch(err => {
        swal(err.message, "", "error");
      });
  }

  accept(id) {
    const db = firebase.firestore();
    var a = this;

    db.collection("meeting")
      .doc(id)
      .update({
        request: true
      })
      .then(res => {
        swal("Accepted", "", "success");
        a.props.history.push("/Meetings");
      }).catch(err => {
        swal(err.message, '', 'error');
      })
  }

  decline(id) {
    const db = firebase.firestore();
    var a = this;

    db.collection("meeting")
      .doc(id)
      .update({
        request: "Cancelled"
      })
      .then(res => {
        swal("Decliened", "", "error");
        a.props.history.push("/Meetings");
      }).catch(err => {
        swal(err.message, '', 'error');
      });
  }

  render() {
    const { data, map, coords, directions } = this.state;
    return (
      <div className="container mt-5" id="request">
        {map ? <div>
          <button onClick={this.back} className="btn btn-dark">Back</button><br /> <br />
          < MyMapComponent isMarkerShown coords={coords} googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyANkUfLBovPhWMJohvoCTbFbo3Rd7uPLSo&v=3.exp&libraries=geometry,drawing,places" loadingElement={< div style={{ height: `100%` }
          } />} containerElement={<div style={{ height: `550px` }} />} mapElement={< div style={{ height: `100%` }} />} directions={directions} />

          <center>
            <button id="btn_color" className="btn text-white mt-2" onClick={this.getDirections}>
              <h1>Get Directions</h1>
            </button>
          </center>
        </div>
          :
        <div className="card mt-5">
          <div className="card-body">
            {!data.length ?
              <center>
                <h2>No pending request</h2>
              </center>
              :
              <div>
                {data.map((item, index) =>
                  <div key={index} className="jumbotron border border-primary mt-5">
                    <center id="pic"><UserAvatar size="140" name={item.userName} src={item.userpic} /></center>
                    <center id="pic1"><UserAvatar size="140" name={item.userName} src={item.pic} /></center>
                    <h2>From: {item.userName}</h2>
                    <h4>Venue: {item.restaurant}</h4>
                    <h4>Date: {item.date}</h4>
                    <h4>Starting time: {item.time}</h4>
                    <h4>Ending time: {item.endtime}</h4>
                    <h4>Request: {item.request}</h4>
                    <button className="btn btn-primary" onClick={() => this.directions(item.resLat,item.resLon)}>Get Direction</button><br />
                    <button className="btn btn-success mt-3" onClick={() => this.accept(item.id)}>Accept</button>
                    <button className="btn btn-danger mt-3 ml-3" onClick={() => this.decline(item.id)}>Decline</button>
                  </div>
                )}
              </div>
            }
          </div>
        </div>
        }
      </div>
    );
  }
}

const MyMapComponent = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={14}
    center={{ lat: props.coords.latitude, lng: props.coords.longitude }}
  >

    <Marker position={{ lat: props.coords.latitude, lng: props.coords.longitude }} />
    {/* <Marker position={{ lat: props.resLat, lng: props.resLon }} /> */}

    {props.directions && <DirectionsRenderer directions={props.directions} />}

  </GoogleMap>
))

export default Dashboard;
