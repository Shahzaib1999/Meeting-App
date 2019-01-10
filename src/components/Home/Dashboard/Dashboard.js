/* eslint-disable no-undef */
/* global google */
import React, { Component } from "react";
import "../../App.css";
import * as firebase from 'firebase';
import swal from 'sweetalert';
import Cards, { Card } from "react-swipe-deck";
import { withGoogleMap, GoogleMap, Marker, DirectionsRenderer, withScriptjs } from "react-google-maps";
import Swiper from "react-id-swiper";
import Modal from "react-modal";
import StarRatings from "react-star-ratings";
import cross from "../../images/cross.png";
import tick from '../../images/tick.png';

const provider = new firebase.auth.FacebookAuthProvider();

class Dashboard extends Component {
  constructor() {
    super();
    
    this.state = { uid: "", booking: false, data: [], coords: {}, map: false, resLat: false, resLon: false, showModal: false, requests: [] };

    this.getUsers = this.getUsers.bind(this);
    this.search = this.search.bind(this);
    this.sendRequest = this.sendRequest.bind(this);
    this.dates = this.dates.bind(this);
    this.getDirections = this.getDirections.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    // this.showDate = this.showDate.bind(this);
  }

  componentWillMount() {
    const db = firebase.firestore();
    debugger;



    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // this.setState({  });
        db.collection("meeting").where("reciever", "==", user.uid).where("request", "==", false).get()
          .then(querySnapshot => {
            if (querySnapshot.size) {

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
                this.setState({ requests: [...this.state.requests, a], showModal: true });

              });
            }
          })
          .catch(err => {
            swal(err.message, "", "error");
          });
        db.collection('users').doc(user.uid).get().then(res =>{
          if(res.exists){
          this.setState({
            name: res.data().name,
            pic: res.data().pic1,
            cocktail: res.data().cocktail,
            coffee: res.data().coffee,
            juice: res.data().juice,
            min1: res.data().min1,
            min2: res.data().min2,
            min3: res.data().min3,
            latitude: res.data().latitude,
            longitude: res.data().longitude,
            user: true,
            uid: user.uid
          });
          this.dates()
        }
        });

      } else {
        this.props.history.replace('/');
        // this.setState({ user: false });
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
  
  dates(){
    const db = firebase.firestore();
    var b = this
    const { cocktail, coffee, juice, min1, min2, min3, uid } = this.state;

    db.collection('users').get().then(res => {
      res.forEach(doc => {
  
        if (doc.data().uid === uid) {
  
        }
        else if ((doc.data().cocktail && cocktail) || (doc.data().coffee && coffee) || (doc.data().juice && juice) || (doc.data().min1 && min1) || (doc.data().min2 && min2) || (doc.data().min3 && min3)) {
          var a = { name: doc.data().name, nickname: doc.data().nickname, pic1: doc.data().pic1, pic2: doc.data().pic2, pic3: doc.data().pic3, id: doc.data().uid };
          console.log(a);
          this.setState({
            data: [...this.state.data, a],
          })
        }
  
      })
    })
    
  }

  getUsers(){
    const db  = firebase.firestore();
    var b = this
    const {cocktail, coffee, juice, min1, min2, min3, uid} = this.state;
    db.collection('users').get().then(res =>{
      res.forEach(doc =>{
       
        if (doc.data().uid === uid) {
          
        }
        else if ((doc.data().cocktail && cocktail) || (doc.data().coffee && coffee) || (doc.data().juice && juice) || (doc.data().min1 && min1) || (doc.data().min2 && min2) || (doc.data().min3 && min3)) {
          var a = {name:doc.data().name,nickname:doc.data().nickname,pic1:doc.data().pic1,id:doc.data().uid};
          console.log(a);
          this.setState({
            data: [...this.state.data,a],
          })
        }
       
      })
    })
  }

  directions(lat, lon){
    this.setState({ resLat: lat, resLon: lon, map: true });
    // ()=> this.getDirections();
  }

  back() {
    this.setState({ resLat: false, resLon: false })
    this.setState({ map: false});
  }

  swipeRight(id,pic,name){
    const {latitude, longitude} = this.state;
    console.log(id);
    const db = firebase.firestore();

    db.collection("users").doc(id).get().then(res => {
      this.setState({
        usermin1: res.data().min1,
        usermin2: res.data().min2,
        usermin3: res.data().min3,
        userid: id, 
        userpic: pic, 
        userName: name
      });
    })
    
    debugger

    var data = document.getElementById("data");
    var input = document.createElement("input");
    var search = document.createElement('button');
    var heading = document.createElement("h1");

    document.getElementById("data").innerHTML = "";
    heading.innerHTML = "Nearest Places";
    search.innerHTML = "Search";

    input.setAttribute('type', 'search');
    input.setAttribute('id', 'search');
    search.setAttribute('class', 'btn btn-primary ml-3');
    search.addEventListener('click', this.search)

    data.appendChild(heading);
    data.appendChild(input);
    data.appendChild(search);
 
    fetch(`https://api.foursquare.com/v2/venues/explore?ll=${latitude},${longitude}&client_id=4BZGAN3BL3XWB3AXYP43WZMB103QQJ4PYAYMEI5VE2SM1LEM&client_secret=NJSUB2AUNRHO5D3BWFY4PPUBVGXRARI4BB0UK3Z1O14PIJ0G&v=20171029&query=restaurant`).then(res => {
        return res.json()
      }).then(myJson => {
        console.log(myJson.response.groups[0].items);
        for (let i = 0; i <= 2; i++) {
          var jumbotron = document.createElement('div');
          var h1 = document.createElement('h1');
          var h4 = document.createElement('h4');
          var btn = document.createElement("button");
          var btn1 = document.createElement('button');

          jumbotron.setAttribute("class", "jumbotron border border-primary mt-5");
          btn.setAttribute("class", "btn btn-success float-right ml-4");
          btn.setAttribute('id', 'cancel');
          btn1.setAttribute("class", "btn btn-primary float-right ml-3");
          btn1.setAttribute("id", "cancel");

          btn.addEventListener("click", () =>
          this.showDate(
            myJson.response.groups[0].items[i].venue.name,
            myJson.response.groups[0].items[i].venue.location.lat,
            myJson.response.groups[0].items[i].venue.location.lng
            )
            );
          btn1.addEventListener("click", () =>
            this.directions(
              myJson.response.groups[0].items[i].venue.location.lat,
              myJson.response.groups[0].items[i].venue.location.lng
            )
          );
          h1.innerHTML = myJson.response.groups[0].items[i].venue.name;
          h4.innerHTML = myJson.response.groups[0].items[i].venue.location.address;
          btn.innerHTML = "Select Location";
          btn1.innerHTML = "Get Direction";

          jumbotron.appendChild(h1);
          jumbotron.appendChild(h4);
          jumbotron.appendChild(btn);
          jumbotron.appendChild(btn1);
          data.appendChild(jumbotron);
          // var name = myJson.response.groups[0].items[i].vanue.name;
        }
      })
    
  }

  search(){
    var search = document.getElementById('search').value;
    var data = document.getElementById("data");
    var input = document.createElement("input");
    var button = document.createElement("button");
    var heading = document.createElement("h1");

    document.getElementById("data").innerHTML = "";
    heading.innerHTML = "Nearest Places";
    button.innerHTML = "Search";

    input.setAttribute("type", "search");
    input.setAttribute("id", "search");
    button.setAttribute("class", "btn btn-primary ml-3");
    button.addEventListener("click", this.search);

    data.appendChild(heading);
    data.appendChild(input);
    data.appendChild(button);
    
    
    fetch(`https://api.foursquare.com/v2/venues/explore?ll=24.87473364828146,67.03611161774904&client_id=4BZGAN3BL3XWB3AXYP43WZMB103QQJ4PYAYMEI5VE2SM1LEM&client_secret=NJSUB2AUNRHO5D3BWFY4PPUBVGXRARI4BB0UK3Z1O14PIJ0G&v=20171029&query=${search}`).then(res => {
      return res.json()
    }).then(myJson => {
      debugger
      if (myJson.response.groups[0].items.length > 0) {
        
        console.log(myJson.response.groups[0].items);
        for (let i = 0; i <= 2; i++) {
          var jumbotron = document.createElement('div');
          var h1 = document.createElement('h1');
          var h4 = document.createElement('h4');
          var btn = document.createElement('button');
          var btn1 = document.createElement('button');

          jumbotron.setAttribute("class", "jumbotron border border-primary mt-5");
          btn.setAttribute("class", "btn btn-success float-right ml-4");
          btn.setAttribute('id', 'cancel');
          btn1.setAttribute("class", "btn btn-primary float-right ml-3");
          btn1.setAttribute("id", "cancel");

          btn.addEventListener("click", () =>
            this.showDate(
              myJson.response.groups[0].items[i].venue.name,
              myJson.response.groups[0].items[i].venue.location.lat,
              myJson.response.groups[0].items[i].venue.location.lng
            )
          );
          btn1.addEventListener("click", () =>
            this.directions(
              myJson.response.groups[0].items[i].venue.location.lat,
              myJson.response.groups[0].items[i].venue.location.lng
            )
          );

          h1.innerHTML = myJson.response.groups[0].items[i].venue.name;
          h4.innerHTML = myJson.response.groups[0].items[i].venue.location.address;
          btn.innerHTML = "Select Location";
          btn1.innerHTML = "Get Direction";

          jumbotron.appendChild(h1);
          jumbotron.appendChild(h4);
          jumbotron.appendChild(btn);
          jumbotron.appendChild(btn1);
          data.appendChild(jumbotron);
        }
      }
      else{
        document.getElementById("data").innerHTML = "No result found";
        var input = document.createElement("input");
        var button = document.createElement("button");

        button.innerHTML = "Search";

        input.setAttribute("type", "search");
        input.setAttribute("id", "search");
        button.setAttribute("class", "btn btn-primary ml-3");
        button.addEventListener("click", this.search);

        data.appendChild(input);
        data.appendChild(button);
      }
    })
  }

  showDate(name, lat, lon){
    const { userid, min1, min2, min3, usermin1, usermin2, usermin3} = this.state;
    
    this.setState({restaurant:name, resLat: lat, resLon: lon});
    debugger
    document.getElementById("data").innerHTML = "";

    var a;
    var data = document.getElementById("data");
    var card = document.createElement('div');
    var body = document.createElement('div');
    var label = document.createElement("label");
    var label2 = document.createElement('label');
    var date = document.createElement("input");
    var time = document.createElement("input");
    var btn = document.createElement("button");
    var input = document.createElement("input");
    var input1 = document.createElement("input");
    var input2 = document.createElement("input");
    var span = document.createElement("span");
    var span1 = document.createElement("span1");
    var span2 = document.createElement("span2");
    var br = document.createElement("br");

    input.setAttribute("type", "radio");
    input.setAttribute("class","mt-4 ml-3");
    input.setAttribute("name","min");
    input1.setAttribute("type", "radio");
    input1.setAttribute("class", "mt-4 ml-3");
    input1.setAttribute("name", "min");
    input2.setAttribute("type", "radio");
    input2.setAttribute("class", "mt-4 ml-3");
    input2.setAttribute("name", "min");
    // span.setAttribute("class","ml-3");
    // span1.setAttribute("class", "ml-3");
    // span2.setAttribute("class","ml-3");
    
    label.innerHTML = "Select Date";
    label2.innerHTML = "Select Time";
    btn.innerHTML = "Send Request";
    
    btn.setAttribute('class','btn btn-primary mt-3');
    btn.addEventListener("click",this.sendRequest);
    label2.setAttribute("class","mt-5");
    date.setAttribute("class", "form-control");
    date.setAttribute("type", "date");
    date.setAttribute("id", "date");
    time.setAttribute("class", "form-control");
    time.setAttribute("type", "time");
    time.setAttribute("id", "time");
    card.setAttribute('class','card mt-5');
    card.setAttribute('id','Datecard');
    body.setAttribute('class','card-body');
    
    body.appendChild(label);
    body.appendChild(date);
    body.appendChild(label2);
    body.appendChild(time);
    
    if (min1 === true && usermin1 === true) {

      input.setAttribute("id","min1");
      input.setAttribute("value","20 min");
      span.innerHTML = "20 min"
      body.appendChild(input); 
      body.appendChild(span); 
      // input.innerHTML = "20 min";
      // body.appendChild(a);

      if (min2 === true && usermin2 === true) {
        input1.setAttribute("id", "min2");
        input1.setAttribute("value", "60 min");
        span1.innerHTML = "60 min"
        body.appendChild(input1);
        body.appendChild(span1); 
      }
      
      if (min3 === true && usermin3 === true) {
        input2.setAttribute("id", "min3");
        input2.setAttribute("value", "120 min");
        span2.innerHTML = "120 min"
        body.appendChild(input2);
        body.appendChild(span2);  
      }

    }
    else if (min2 === true && usermin2 === true){

      input1.setAttribute("id", "min2");
      input1.setAttribute("value","20 min");
      span1.innerHTML = "60 min"
      body.appendChild(input1);
      body.appendChild(span1); 

      if (min3 === true && usermin3 === true) {
        input2.setAttribute("id", "min3");
        input2.setAttribute("value", "120 min");
        span2.innerHTML = "120 min"
        body.appendChild(input2);
        body.appendChild(span2);
      }

    }
    else if (min3 === true && usermin3 === true){
      input2.setAttribute("id", "min3");
      input2.setAttribute("value","20 min");
      span2.innerHTML = "120 min"
      body.appendChild(input2);
      body.appendChild(span2);
    }

    body.appendChild(br);
    body.appendChild(btn);
    card.appendChild(body);
    data.appendChild(card)

  }

  sendRequest(){
    const {uid,userid,restaurant, resLat, resLon, userpic, userName, name, pic} = this.state;
    const db = firebase.firestore();

    var date = new Date();
    var day = document.getElementById("date").value;
    var time = document.getElementById("time").value;

    var dd = date.getDate();
    var mm = date.getMonth() + 1; //January is 0!

    var yyyy = date.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }

    var today = yyyy + "-" + mm + "-" + dd;
    var r = (Number(time.split(":")[0]) * 3600 + Number(time.split(":")[1]) * 60) * 1000;
    var currenthours = date.getHours();
    var currentminitus = date.getMinutes();
    var a = (currenthours * 3600 + currentminitus * 60) * 1000;
    // var min1 = document.getElementById("min1").checked;
    // var min2 = document.getElementById("min2").checked;
    // var min3 = document.getElementById("min3").checked;
    var min;
    if (document.getElementById("min1")) {
      if (document.getElementById("min1").checked) {
        min = r + 1200000;
      } 
      else if (document.getElementById("min2")) {
        if (document.getElementById("min2").checked) {
          min = r + 3600000;
        }
        else if (document.getElementById("min3")) {
          if (document.getElementById("min3").checked) {
            min = r + 7200000;
          }
        }
      }
        else if (document.getElementById("min3")) {
          if (document.getElementById("min3").checked) {
            min = r + 7200000;
          }
      }
      else if (document.getElementById("min3")) {
        if (document.getElementById("min3").checked) {
          min = r + 7200000;
        }
      } 
    } 
    else if (document.getElementById("min2")) {
      if (document.getElementById("min2").checked) {
        min = r + 3600000;
      } 
      else if (document.getElementById("min3")) {
        if (document.getElementById("min3").checked) {
          min = r + 7200000;
        }
      }
    } 
    else if (document.getElementById("min3")) {
      if (document.getElementById("min3").checked) {
        min = r + 7200000;
      }
    }

    if (!day || !time || !min) {
      swal('Please fill the fields','','warning');
    }
    else if(today > day){
      swal('Date should be present or future', '', 'warning');
    }
    else if((today === day) && (a >= r)){
      swal('Time should be future','','warning');
    }
    else{
      db.collection('meeting').add({
        name,
        pic,
        [uid]: false,
        [userid]: false,
        sender: uid,
        reciever: userid,
        userName,
        userpic,
        restaurant,
        date: day,
        time: r,
        endtime: min,
        resLat, 
        resLon,
        request: false
      }).then(res =>{
        swal('Successfully sended','','success');
        this.props.history.push('/Meetings')
      })
    }
    // console.log(today,a,r,day);
    
  }

  handleCloseModal() {
    this.setState({ showModal: false });
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

  rejected(index){
    const {data} = this.state;

    data.splice(index,1);
    this.setState({data});
    
  }

  render() {
    const { booking, data, map, coords, directions, name, pic, requests} = this.state;
    // debugger
    const params = {
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true
      }
    }

    return (
      <div className="container mt-5">
        {requests.length ? requests.map((item, index) =>
          <center key={index}>
            <div>
              <Modal isOpen={this.state.showModal} contentLabel="Minimal Modal Example" id="modal" style={{ overlay: { height: '600px' } }}>
                <center>
                  <h1>Request</h1><hr />
                  <h2>From: {item.userName}</h2>
                  <h4>Venue: {item.restaurant}</h4>
                  <h4>Date: {item.date}</h4>
                  <h4>Starting time: {item.time}</h4>
                  <h4>Ending time: {item.endtime}</h4>
                  <h4>Request: {item.request}</h4>
                  <button className="btn btn-success mt-3" onClick={() => this.accept(item.id)}>Accept</button>
                  <button className="btn btn-danger mt-3 ml-3" onClick={() => this.decline(item.id)}>Decline</button>
                  <button className="btn btn-warning mt-3 ml-3" onClick={this.handleCloseModal}>
                    Close
                    </button>
                </center>
              </Modal>
            </div>
          </center>
        )
          :
          <div></div>
        }
        {
          map ? <div>
            <button onClick={() => this.back()} className="btn btn-dark">Back</button><br /> <br /> 
            < MyMapComponent isMarkerShown coords={coords} googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyANkUfLBovPhWMJohvoCTbFbo3Rd7uPLSo&v=3.exp&libraries=geometry,drawing,places" loadingElement={< div style={{ height: `100%` }
            } />} containerElement={<div style={{ height: `550px` }} />} mapElement={< div style={{ height: `100%` }} />} directions={directions} />

            <center>  
              <button id="btn_color" className="btn text-white mt-2" onClick={this.getDirections}>
                <h1>Get Directions</h1>
              </button>
            </center>
          </div> 
          :
          <div id="searc">
            <center id="data">
              <h5>Sweeping right = Meet</h5>
              <h5>Sweeping left = Cancel</h5>
              <Cards onEnd={() => console.log('end')} size={[, 500]} id='master-root'>
                {data.map((item, index) =>
                  <Card key={index}
                    onSwipeLeft={() => console.log('swipe left')}
                    onSwipeRight={() => this.swipeRight(item.id,item.pic1,item.name)}>
                   
                      <div id="white" style={{ marginTop: '-100px', width: '300px', marginLeft: '-50px'}}>
                                          
                        <Swiper {...params}>
                          <div><img src={item.pic1} width="300px" height="300px" /></div>
                          <div><img src={item.pic2} width="300px" height="300px"/></div>
                          <div><img src={item.pic3} width="300px" height="300px"/></div>
                        </Swiper>
                     
                      <h3 id="white" className="mt-2">{item.name}</h3>
                      <img src={cross} width="45px" id="cross" onClick={() => this.rejected(index)} />
                      <img src={tick} width="45px" id="tick" onClick={() => this.swipeRight(item.id,item.pic1,item.name)} />
                      <p style={{fontSize: '20px'}} id="nick">{item.nickname}</p>
                    </div>
                  </Card>
                )}
              </Cards>
            </center>
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
