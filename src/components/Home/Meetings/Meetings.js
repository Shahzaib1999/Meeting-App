import React, { Component } from "react";
import "../../App.css";
import * as firebase from 'firebase';
import swal from 'sweetalert';
import UserAvatar from "react-user-avatar";
import AddToCalendar from "react-add-to-calendar";
import {
  PopupboxManager,
  PopupboxContainer
} from 'react-popupbox';
import Modal from "react-modal";
import StarRatings from "react-star-ratings";
import "react-add-to-calendar/dist/react-add-to-calendar.css";


class Dashboard extends Component {
    constructor() {
        super();

        this.state = {
            uid: "",
            booking: false,
            data: [],
            Accept: [],
            accept: [],
            Decline: [],
            decline: [],
            pen: [],
            pend: false,
            popup: [],
            showModal: false,
            rating: 0
        }

        this.dates = this.dates.bind(this);
        this.redirect = this.redirect.bind(this);
      this.handleOpenModal = this.handleOpenModal.bind(this);
      this.handleCloseModal = this.handleCloseModal.bind(this);
      this.changeRating = this.changeRating.bind(this);
    }

    componentWillMount() {
      const db = firebase.firestore();
      var date = new Date();
      var dd = date.getDate();
      var mm = date.getMonth() + 1; //January is 0!
      var yyyy = date.getFullYear();
      var currenthours = date.getHours();
      var currentminitus = date.getMinutes();
      var a = (currenthours * 3600 + currentminitus * 60) * 1000;
      
      if (dd < 10) {
        dd = "0" + dd;
      }
      if (mm < 10) {
        mm = "0" + mm;
      }

      var today = yyyy + "-" + mm + "-" + dd;

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
              db.collection("meeting").where("request", "==", true).where(user.uid, "==", false).get().then(querySnapshot =>{
                if (querySnapshot.docs.length){
                  
                  querySnapshot.forEach(res =>{
                    // debugger
                    if (res.data().date === today) {
                      
                      if (res.data().sender === user.uid && res.data().endtime <= a) {
                      
                        // this.setState({ showModal: true });
                        var b = { id: res.id, to: res.data().reciever, userName: res.data().userName, restaurant: res.data().restaurant };
                        this.setState({ popup: [...this.state.popup, b], showModal: true });
  
                      }
                      else if (res.data().reciever === user.uid && res.data().endtime <= a){
                        // this.setState({ showModal: true });
  
                        var b = { id: res.id, to: res.data().sender, userName: res.data().name, restaurant: res.data().restaurant };
                        this.setState({ popup: [...this.state.popup, b], showModal: true });
                      }

                    }
                    else if (res.data().date > today || res.data().date < today){

                      if (res.data().sender === user.uid) {

                        // this.setState({ showModal: true });
                        var b = { id: res.id, to: res.data().reciever, userName: res.data().userName, restaurant: res.data().restaurant };
                        this.setState({ popup: [...this.state.popup, b], showModal: true });

                      }
                      else if (res.data().reciever === user.uid) {
                        // this.setState({ showModal: true });

                        var b = { id: res.id, to: res.data().sender, userName: res.data().name, restaurant: res.data().restaurant };
                        this.setState({ popup: [...this.state.popup, b], showModal: true });
                      }
                    }
                  });

                }
              })
                this.setState({
                    user: true,
                    uid: user.uid
                });            
                this.dates()
            }
            else {
                this.props.history.replace('/');
                // this.setState({ user: false });
            }
        });

    }

    dates() {
              const db = firebase.firestore();
              const { uid } = this.state;
              var req = "Accepted";

              //for accepted meeting(Sended)
              db.collection("meeting")
                .where("sender", "==", uid)
                .where("request", "==", true)
                .get()
                .then(querySnapshot => {
                  if (querySnapshot.size) {
                    // var data = document.getElementById("accepted");
                    // document.getElementById("accepted").innerHTML = "";
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

                      if (res.data().rating === 'Done') {
                        req = 'Done';
                      }
                      else if(res.data().rating === 'Cancelled'){
                        req = 'Cancelled';
                      }
                      else if(res.data().rating === 'Complicated'){
                        req = 'Complicated';
                      }
                      else{
                        req = "Accepted";
                      }

                      var a = { to: res.data().reciever, userName: res.data().userName, restaurant: res.data().restaurant, date: res.data().date, time: starthour + ":" + startmin, endtime: endhour + ":" + endmin, userpic: res.data().userpic, request: req };
                      this.setState({ Accept: [...this.state.Accept, a] });

                      // var jumbotron = document.createElement("div");
                      // var h1 = document.createElement("h1");
                      // var h4 = document.createElement("h4");
                      // var h42 = document.createElement("h4");
                      // var h43 = document.createElement("h4");
                      // var h44 = document.createElement("h4");

                      // jumbotron.setAttribute("class", "jumbotron border border-primary mt-5");  

                      // h1.innerHTML = "To: " + res.data().reciever;
                      // h4.innerHTML = "Venue: " + res.data().restaurant;
                      // h42.innerHTML = "Date: " + res.data().date;
                      // h43.innerHTML = "Time: " + res.data().time;
                      // h44.innerHTML = "Request: Accepted";

                      // jumbotron.appendChild(h1);
                      // jumbotron.appendChild(h4);
                      // jumbotron.appendChild(h42);
                      // jumbotron.appendChild(h43);
                      // jumbotron.appendChild(h44);
                      // data.appendChild(jumbotron);
                    });
                  }
                })
                .catch(err => {
                  swal(err.message, "", "error");
                });

              //for accepted meeting(Recieved)
              db.collection("meeting")
                .where("reciever", "==", uid)
                .where("request", "==", true)
                .get()
                .then(querySnapshot => {
                  if (querySnapshot.size) {

                    
                    // if (document.getElementById("accept")) {
                      //   document.getElementById("accepted").innerHTML = "";
                      // }
                      // var data = document.getElementById("accepted");

                      querySnapshot.forEach(res => {
                        if (uid === true) {
                        }
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

                        if (res.data().rating === 'Done') {
                          req = 'Done';
                        }
                        else if (res.data().rating === 'Cancelled') {
                          req = 'Cancelled';
                        }
                        else if (res.data().rating === 'Complicated') {
                          req = 'Complicated';
                        }
                        else {
                          req = "Accepted";
                        }

                        var a = { to: res.data().reciever, userName: res.data().name, restaurant: res.data().restaurant, date: res.data().date, time: starthour + ":" + startmin, endtime: endhour + ":" + endmin, userpic: res.data().pic, request: req };
                        this.setState({ accept: [...this.state.accept, a] });
                        
                        //   var jumbotron = document.createElement("div");
                    //   var h1 = document.createElement("h1");
                    //   var h4 = document.createElement("h4");
                    //   var h42 = document.createElement("h4");
                    //   var h43 = document.createElement("h4");
                    //   var h44 = document.createElement("h4");

                    //   jumbotron.setAttribute("class", "jumbotron border border-primary mt-5");

                    //   h1.innerHTML = "From: " + res.data().sender;
                    //   h4.innerHTML = "Venue: " + res.data().restaurant;
                    //   h42.innerHTML = "Date: " + res.data().date;
                    //   h43.innerHTML = "Time: " + res.data().time;
                    //   h44.innerHTML = "Request: Accepted";

                    //   jumbotron.appendChild(h1);
                    //   jumbotron.appendChild(h4);
                    //   jumbotron.appendChild(h42);
                    //   jumbotron.appendChild(h43);
                    //   jumbotron.appendChild(h44);
                    //   data.appendChild(jumbotron);
                    });
                  }
                })
                .catch(err => {
                  swal(err.message, "", "error");
                });

              // for declined meeting(sended)
              db.collection("meeting")
                .where("sender", "==", uid)
                .where("request", "==", "Cancelled")
                .get()
                .then(querySnapshot => {
                  if (querySnapshot.size) {
                    // var data = document.getElementById("declined");

                    // document.getElementById("declined").innerHTML = "";
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

                      var a = { to: res.data().reciever, userName: res.data().userName, restaurant: res.data().restaurant, date: res.data().date, time: starthour + ":" + startmin, endtime: endhour + ":" + endmin, userpic: res.data().userpic, request: "Accepted" };
                      this.setState({ accept: [...this.state.accept, a] });

                      // var jumbotron = document.createElement("div");
                      // var h1 = document.createElement("h1");
                      // var h4 = document.createElement("h4");
                      // var h42 = document.createElement("h4");
                      // var h43 = document.createElement("h4");
                      // var h44 = document.createElement("h4");

                      // jumbotron.setAttribute("class", "jumbotron border border-primary mt-5");

                      // h1.innerHTML = "To: " + res.data().reciever;
                      // h4.innerHTML = "Venue: " + res.data().restaurant;
                      // h42.innerHTML = "Date: " + res.data().date;
                      // h43.innerHTML = "Time: " + res.data().time;
                      // h44.innerHTML = "Request: Declined";

                      // jumbotron.appendChild(h1);
                      // jumbotron.appendChild(h4);
                      // jumbotron.appendChild(h42);
                      // jumbotron.appendChild(h43);
                      // jumbotron.appendChild(h44);
                      // data.appendChild(jumbotron);
                    });
                  }
                })
                .catch(err => {
                  swal(err.message, "", "error");
                });

              // for declined meeting(recieved)
              db.collection("meeting")
                .where("reciever", "==", uid)
                .where("request", "==", "Cancelled")
                .get()
                .then(querySnapshot => {
                  if (querySnapshot.size) {
                    //   if (document.getElementById("decline")) {
                    //     document.getElementById("declined").innerHTML = "";
                    //   } 
                    // var data = document.getElementById("declined");

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

                      var a = { to: res.data().reciever, userName: res.data().name, restaurant: res.data().restaurant, date: res.data().date, time: starthour + ":" + startmin, endtime: endhour + ":" + endmin, userpic: res.data().pic, request: "Declined" };
                      this.setState({ decline: [...this.state.decline, a] });
                      // var jumbotron = document.createElement("div");
                      // var h1 = document.createElement("h1");
                      // var h4 = document.createElement("h4");
                      // var h42 = document.createElement("h4");
                      // var h43 = document.createElement("h4");
                      // var h44 = document.createElement("h4");

                      // jumbotron.setAttribute("class", "jumbotron border border-primary mt-5");

                      // h1.innerHTML = "From: " + res.data().reciever;
                      // h4.innerHTML = "Venue: " + res.data().restaurant;
                      // h42.innerHTML = "Date: " + res.data().date;
                      // h43.innerHTML = "Time: " + res.data().time;
                      // h44.innerHTML = "Request: Declined";

                      // jumbotron.appendChild(h1);
                      // jumbotron.appendChild(h4);
                      // jumbotron.appendChild(h42);
                      // jumbotron.appendChild(h43);
                      // jumbotron.appendChild(h44);
                      // data.appendChild(jumbotron);
                    });
                  }
                })
                .catch(err => {
                  swal(err.message, "", "error");
                });

              // for pending meeting
              db.collection("meeting")
                .where("sender", "==", uid)
                .where("request", "==", false)
                .get()
                .then(querySnapshot => {
                  if (querySnapshot.size) {
                    // var data = document.getElementById("pending");
                    // document.getElementById("pending").innerHTML = "";

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

                      var a = { to: res.data().reciever, userName: res.data().userName, restaurant: res.data().restaurant, date: res.data().date, time: starthour + ":" + startmin, endtime: endhour + ":" + endmin, userpic: res.data().userpic, request: "Pending" };
                        this.setState({ pen: [...this.state.pen,a] });
                    //   var jumbotron = document.createElement("div");
                    //   var h1 = document.createElement("h1");
                    //   var h4 = document.createElement("h4");
                    //   var h42 = document.createElement("h4");
                    //   var h43 = document.createElement("h4");
                    //   var h44 = document.createElement("h4");
                    //   var div = document.createElement("div");

                    //   jumbotron.setAttribute("class", "jumbotron border border-primary mt-5");
                    //     var a = `<UserAvatar size="70" name="Will Binns-Smith" src="${res.data().userpic}" />`;
                    //   h1.innerHTML = "To: " + res.data().reciever;
                    //   h4.innerHTML = "Venue: " + res.data().restaurant;
                    //   h42.innerHTML = "Date: " + res.data().date;
                    //   h43.innerHTML = "Time: " + res.data().time;
                    //   h44.innerHTML = "Request: Pending";
                    //     div.innerHTML=a;
                    //     jumbotron.appendChild(div);
                    //   jumbotron.appendChild(h1);
                    //   jumbotron.appendChild(h4);
                    //   jumbotron.appendChild(h42);
                    //   jumbotron.appendChild(h43);
                    //   jumbotron.appendChild(h44);
                    //   data.appendChild(jumbotron);
                    });
                  }
                })
                .catch(err => {
                  swal(err.message, "", "error");
                });
            }

    redirect(){
        this.props.history.push("/Dashboard");
    }

  // openPopupbox() {
  //   const {popup} = this.state;
  //   debugger
  //   const content = (
  //     <div>
  //     {popup.map(data =>{
  //       <div>
  //       <span>as</span>
  //       <button >Update!</button>
  //       </div>
  //     })
  //     }
  //     </div>
  //   )

  //   PopupboxManager.open({
  //     content,
  //     config: {
  //       titleBar: {
  //         enable: true,
  //         text: 'Review'
  //       },
  //       fadeIn: true,
  //       fadeInSpeed: 500
  //     }
  //   })
  // }
  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  yes(id,user){
    const { uid, rating} = this.state;
    const db = firebase.firestore();
    var a = this;
    
    db.collection("meeting").doc(id).get().then(querySnapshot =>{
      if (querySnapshot.exists) {
        debugger
        if (querySnapshot.data().yes === true) {
            
          db.collection("meeting").doc(id).update({
              [uid]: true,
              yes: true,
              rating: 'Done'
            }).then(res => {
              db.collection("users").doc(uid).collection("ratings").doc(id).set({
                rating: rating,
                user: uid
              }).then(() => {
                db.collection("users").doc(user).collection("ratings").doc(id).set({
                  rating: rating,
                  user: uid
                }).then(() => {
                  a.props.history.replace("/Dashboard");
                  swal("Review submitted successfully", "", "success");
                })
              })
            })

        }
        else if(querySnapshot.data().no === true){

          db.collection("meeting").doc(id).update({
            [uid]: true,
            yes: true,
            rating: 'Complicated'
          }).then(res => {
            db.collection("users").doc(uid).collection("ratings").doc(id).set({
              rating: rating,
              user: uid
            }).then(() => {
              db.collection("users").doc(user).collection("ratings").doc(id).set({
                rating: rating,
                user: uid
              }).then(() => {
                a.props.history.replace("/Dashboard");
                swal("Review submitted successfully", "", "success");
              })
            })
          })

        }
        else if (!querySnapshot.data().yes && !querySnapshot.data().no){
          db.collection("meeting").doc(id).update({
            [uid]: true,
            yes: true,
            rating: 'Pending'
          }).then(res => {
            db.collection("users").doc(uid).collection("ratings").doc(id).set({
              rating: rating,
              user: uid
            }).then(() => {
              db.collection("users").doc(user).collection("ratings").doc(id).set({
                rating: rating,
                user: uid
              }).then(() => {
                a.props.history.replace("/Dashboard");
                swal("Review submitted successfully", "", "success");
              })
            })
          })
        }
      }
    })
    // db.collection("meeting").doc(id).update({
    //   [uid]:true,
    //   yes: true
    // }).then(res =>{
    //   db.collection("users").doc(uid).collection("ratings").doc(id).set({
    //     rating: rating,
    //     user: uid
    //   }).then(() =>{
    //     db.collection("users").doc(user).collection("ratings").doc(id).set({
    //       rating: rating,
    //       user: uid
    //     }).then(() =>{
    //       a.props.history.replace("/Dashboard");
    //       swal("Review submitted successfully","","success");
    //     })
    //   })
    // })
  }

  no(id, user){
    const { uid, rating } = this.state;
    const db = firebase.firestore();
    var a = this;

    db.collection("meeting").doc(id).get().then(querySnapshot => {
      if (querySnapshot.exists) {
        debugger
        if (querySnapshot.data().yes === true) {

          db.collection("meeting").doc(id).update({
            [uid]: true,
            no: true,
            rating: 'Complicated'
          }).then(res => {
            db.collection("users").doc(uid).collection("ratings").doc(id).set({
              rating: rating,
              user: uid
            }).then(() => {
              db.collection("users").doc(user).collection("ratings").doc(id).set({
                rating: rating,
                user: uid
              }).then(() => {
                a.props.history.replace("/Dashboard");
                swal("Review submitted successfully", "", "success");
              })
            })
          })

        }
        else if (querySnapshot.data().no === true) {

          db.collection("meeting").doc(id).update({
            [uid]: true,
            no: true,
            rating: 'Cancelled'
          }).then(res => {
            db.collection("users").doc(uid).collection("ratings").doc(id).set({
              rating: rating,
              user: uid
            }).then(() => {
              db.collection("users").doc(user).collection("ratings").doc(id).set({
                rating: rating,
                user: uid
              }).then(() => {
                a.props.history.replace("/Dashboard");
                swal("Review submitted successfully", "", "success");
              })
            })
          })

        }
        else if (!querySnapshot.data().yes && !querySnapshot.data().no) {
          db.collection("meeting").doc(id).update({
            [uid]: true,
            no: true,
            rating: 'Pending'
          }).then(res => {
            db.collection("users").doc(uid).collection("ratings").doc(id).set({
              rating: rating,
              user: uid
            }).then(() => {
              db.collection("users").doc(user).collection("ratings").doc(id).set({
                rating: rating,
                user: uid
              }).then(() => {
                a.props.history.replace("/Dashboard");
                swal("Review submitted successfully", "", "success");
              })
            })
          })
        }
      }
    })
    // db.collection("meeting").doc(id).update({
    //   [uid]: "no"
    // }).then(res => {
    //   db.collection("users").doc(uid).collection("ratings").doc(id).set({
    //     rating: rating,
    //     user: uid
    //   }).then(() => {
    //     db.collection("users").doc(user).collection("ratings").doc(id).set({
    //       rating: rating,
    //       user: uid
    //     }).then(() => {
    //       a.props.history.replace("/Dashboard");
    //       swal("Review submitted successfully", "", "success");
    //     })
    //   })
    // })

  }

  changeRating(newRating) {
    this.setState({
      rating: newRating
    });
  }

    render() {
      const {Accept,accept,Decline,decline,pen,popup} = this.state;
      let icon = { "calendar-plus-o": "left" };

        return <div className="container mt-5">
            
          {popup.length ? popup.map((item,index) =>
            <center key={index}>
              <div>
                <Modal isOpen={this.state.showModal} contentLabel="Minimal Modal Example" id="modal" style={{ overlay: { height: '600px' } }}>
                  <center>
                    <h1 className="mt-4">Was the meeting successfull with {item.userName}?</h1>
                    <h2 className="mt-5">Location: {item.restaurant}</h2>
                    <h3 className="mt-5">Your Rating:</h3>
                    <StarRatings rating={this.state.rating} starRatedColor="green" changeRating={this.changeRating} numberOfStars={5} name='rating'
                    /><br />
                    <button className="btn btn-success mt-5" onClick={() => this.yes(item.id, item.to)}>
                      Yes
                    </button>
                    <button className="btn btn-danger mt-5 ml-3" onClick={() => this.no(item.id, item.to)}>
                      No
                    </button>
                    <button className="btn btn-warning mt-5 ml-3" onClick={this.handleCloseModal}>
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
            {/* <UserAvatar size="70" name="Will Binns-Smith" src="https://pbs.twimg.com/profile_images/429442426038538240/6Ac9kykG_400x400.jpeg" /> */}
            <div className="card mt-5">
              <div className="card-header text-center text-white" id="color">
                <h2>Sended</h2>
              </div>
              <div className="card-body">
                <div className="card mt-5">
                  <div className="card-header text-center">
                    <h2>Acccepted</h2>
                  </div>
                  <div className="card-body">
                    {!Accept.length ? <center>
                        <h2>
                          You don’t have any accepted request yet!
                        </h2>
                      </center> : <div>
                        {Accept.map((item,index) => (
                          <div key={index} className="jumbotron border border-primary mt-5">
                            <center>
                              <UserAvatar
                                size="140"
                                name={item.userName}
                                src={item.userpic}
                              />
                            </center>
                            <h2>To: {item.userName}</h2>
                            <h4>Venue: {item.restaurant}</h4>
                            <h4>Date: {item.date}</h4>
                            <h4>Starting time: {item.time}</h4>
                            <h4>Ending time: {item.endtime}</h4>
                            <h4>Request: {item.request}</h4>
                            <br />
                            <AddToCalendar
                              event={{
                                title: "Meeting",
                                location: item.restaurant
                              }}
                              buttonTemplate={icon}
                            />
                          </div>
                        ))}
                      </div>}
                  </div>
                </div>

                <div className="card mt-5">
                  <div className="card-header text-center">
                    <h2>Declined</h2>
                  </div>
                  <div className="card-body">
                    {!Decline.length ? <center>
                        <h2>
                          You don’t have any declined request yet!
                        </h2>
                      </center> : <div>
                        {Decline.map(item => (
                          <div className="jumbotron border border-primary mt-5">
                            <center>
                              <UserAvatar
                                size="140"
                                name={item.userName}
                                src={item.userpic}
                              />
                            </center>
                            <h2>To: {item.userName}</h2>
                            <h4>Venue: {item.restaurant}</h4>
                            <h4>Starting time: {item.time}</h4>
                            <h4>Ending time: {item.endtime}</h4>
                            <h4>Request: {item.request}</h4>
                          </div>
                        ))}
                      </div>}
                  </div>
                </div>

                <div className="card mt-5">
                  <div className="card-header text-center">
                    <h2>Pending</h2>
                  </div>
                  <div className="card-body">
                    {!pen.length ? <center>
                        <h2>You don’t have any pending request yet!</h2>
                      </center> : <div>
                        {pen.map((item, index) => (
                          <div
                            key={index}
                            className="jumbotron border border-primary mt-5"
                          >
                            <center>
                              <UserAvatar
                                size="140"
                                name="a"
                                src={item.userpic}
                              />
                            </center>
                            <h2>To: {item.userName}</h2>
                            <h4>Venue: {item.restaurant}</h4>
                            <h4>Date: {item.date}</h4>
                            <h4>Starting time: {item.time}</h4>
                            <h4>Ending time: {item.endtime}</h4>
                            <h4>Request: {item.request}</h4>
                          </div>
                        ))}
                      </div>}
                  </div>
                </div>
              </div>
            </div>

            <div className="card mt-5">
              <div className="card-header text-center text-white" id="color">
                <h2>Recieved</h2>
              </div>
              <div className="card-body" id="sended">
                <div className="card mt-5">
                  <div className="card-header text-center">
                    <h2>Acccepted</h2>
                  </div>
                  <div className="card-body">
                    {!accept.length ? <center>
                        <h2>
                          You don’t have any accepted request yet!
                        </h2>
                      </center> : <div>
                        {accept.map((item, index) => (
                          <div
                            key={index}
                            className="jumbotron border border-primary mt-5"
                          >
                            <center>
                              <UserAvatar
                                size="140"
                                name={item.userName}
                                src={item.userpic}
                              />
                            </center>
                            <h2>From: {item.userName}</h2>
                            <h4>Venue: {item.restaurant}</h4>
                            <h4>Date: {item.date}</h4>
                            <h4>Starting time: {item.time}</h4>
                            <h4>Ending time: {item.endtime}</h4>
                            <h4>Request: {item.request}</h4>
                            <br />
                            <AddToCalendar
                              event={{
                                title: "Meeting",
                                location: item.restaurant
                              }}
                              buttonTemplate={icon}
                            />
                          </div>
                        ))}
                      </div>}
                  </div>
                </div>

                <div className="card mt-5">
                  <div className="card-header text-center">
                    <h2>Declined</h2>
                  </div>
                  <div className="card-body">
                    {!decline.length ? <center>
                        <h2>
                          You don’t have any declined request yet!
                        </h2>
                      </center> : <div>
                        {decline.map(item => (
                          <div className="jumbotron border border-primary mt-5">
                            <center>
                              <UserAvatar
                                size="140"
                                name={item.userName}
                                src={item.userpic}
                              />
                            </center>
                            <h2>From: {item.userName}</h2>
                            <h4>Venue: {item.restaurant}</h4>
                            <h4>Date: {item.date}</h4>
                            <h4>Starting time: {item.time}</h4>
                            <h4>Ending time: {item.endtime}</h4>
                            <h4>Request: {item.request}</h4>
                          </div>
                        ))}
                      </div>}
                  </div>
                </div>
              </div>
            </div>

            <button className="btn btn-block text-white mt-4" id="btn_color" onClick={this.redirect}>
              Meet More
            </button>
          </div>;
    }
}



export default Dashboard;
