import React, { Component } from "react";
import "../../App.css";
import * as firebase from 'firebase';
import Swiper from "react-id-swiper";


class App extends Component {
    constructor() {
        super();

        this.state = {
            user: false
        }

        this.pic = this.pic.bind(this);
        this.data = this.data.bind(this);
    }

    componentWillMount(){
        const db = firebase.firestore();

        var cocktail = "";
        var coffee = "";
        var juice = "";
        var min1 = "";
        var min2 = "";
        var min3 = "";

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                // this.setState({  });
                db.collection('users').doc(user.uid).get().then(res => {
                    if (res.exists) {
                        if (res.data().cocktail) {
                            cocktail = "Cocktail"
                        }
                        if (res.data().coffee) {
                            coffee = "Coffee"
                        }
                        if (res.data().juice) {
                            juice = "Juice"
                        }
                        if (res.data().min1) {
                            min1 = "20 min"
                        }
                        if (res.data().min2) {
                            min2 = "60 min"
                        }
                        if (res.data().min3) {
                            min3 = "120 min"
                        }
                        this.setState({
                            name: res.data().name,
                            nickname: res.data().nickname,
                            pic1: res.data().pic1,
                            pic2: res.data().pic2,
                            pic3: res.data().pic3,
                            cocktail,
                            coffee,
                            juice,
                            min1,
                            min2,
                            min3,
                            latitude: res.data().latitude,
                            longitude: res.data().longitude,
                            number: res.data().number,
                            user: true,
                            uid: user.uid
                        });
                    }
                });

            } else {
                this.props.history.replace('/');
            }
        });
    }

    pic(){
        this.props.history.replace('/Picture');        
    }
    
    data() {
        this.props.history.replace('/Data');
    }

    render() {
        const { name, nickname, pic1, pic2, pic3, cocktail,coffee,juice,min1,min2,min3,number} = this.state;
        const params = {
            pagination: {
                el: '.swiper-pagination',
                type: 'bullets',
                clickable: true
            }
        }
        return <div className="container mt-5">
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="card-title mb-4">
                      {/* <div className="d-flex justify-content-start"> */}
                      <div className="row">
                        <div className="col-md-4" />
                        <div className="col-md-4">
                          <div className="">
                            {/* <img src="http://placehold.it/150x150" id="imgProfile" style={{ width: "400px", height: "150px" }} className="img-thumbnail" />
                            <div className="">
                              <input type="file" style={{ display: "none" }} id="profilePicture" name="file" />
                            </div> */}
                            <Swiper {...params}>
                              <div>
                                <img src={pic1} width="320px" height="300px" />
                              </div>
                              <div>
                                <img src={pic2} width="320px" height="300px" />
                              </div>
                              <div>
                                <img src={pic3} width="320px" height="300px" />
                              </div>
                            </Swiper>
                            <center>
                              <input type="button" className="btn btn-secondary mt-3" id="btnChangePicture" value="Change" onClick={this.pic} />
                            </center>
                          </div>

                          {/* <div className="">
                            <h2 className="d-block" style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                              <a href="javascript:void(0);">
                                Some Name
                              </a>
                            </h2>
                            <h6 className="d-block">
                              <a href="javascript:void(0)">1,500</a> Video Uploads
                            </h6>
                            <h6 className="d-block">
                              <a href="javascript:void(0)">300</a> Blog Posts
                            </h6>
                          </div> */}
                          {/* <br /> */}
                          <div className="ml-auto">
                            <input type="button" className="btn btn-primary d-none" id="btnDiscard" value="Discard Changes" />
                          </div>
                        </div>
                        <div className="col-md-4" />
                        {/* </div> */}
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-12">
                        <ul className="nav nav-tabs mb-4" id="myTab" role="tablist">
                          <li className="nav-item">
                            <a className="nav-link active" id="basicInfo-tab" data-toggle="tab" href="#basicInfo" role="tab" aria-controls="basicInfo" aria-selected="true">
                              Basic Info
                            </a>
                          </li>
                          {/* <li className="nav-item">
                            <a className="nav-link" id="connectedServices-tab" data-toggle="tab" href="#connectedServices" role="tab" aria-controls="connectedServices" aria-selected="false">
                              Connected Services
                            </a>
                          </li> */}
                        </ul>
                        <div className="tab-content ml-1" id="myTabContent">
                          <div className="tab-pane fade show active" id="basicInfo" role="tabpanel" aria-labelledby="basicInfo-tab">
                            <div className="row">
                              <div className="col-sm-3 col-md-2 col-5">
                                <label style={{ fontWeight: "bold" }}>
                                  Name
                                </label>
                              </div>
                              <div className="col-md-8 col-6">
                                {name}
                              </div>
                            </div>
                            <hr />

                            <div className="row">
                              <div className="col-sm-3 col-md-2 col-5">
                                <label style={{ fontWeight: "bold" }}>
                                  Nick Name
                                </label>
                              </div>
                              <div className="col-md-8 col-6">
                                {nickname}
                              </div>
                            </div>
                            <hr />

                            <div className="row">
                              <div className="col-sm-3 col-md-2 col-5">
                                <label style={{ fontWeight: "bold" }}>
                                  Number
                                </label>
                              </div>
                              <div className="col-md-8 col-6">
                                {number}
                              </div>
                            </div>
                            <hr />
                            <div className="row">
                              <div className="col-sm-3 col-md-2 col-5">
                                <label style={{ fontWeight: "bold" }}>
                                  Beverages
                                </label>
                              </div>
                              <div className="col-md-8 col-6">
                                {cocktail + " " + coffee + " " + juice}
                              </div>
                            </div>
                            <hr />
                            <div className="row">
                              <div className="col-sm-3 col-md-2 col-5">
                                <label style={{ fontWeight: "bold" }}>
                                  Meeting Duration
                                </label>
                              </div>
                              <div className="col-md-8 col-6">
                                {min1 + " " + min2 + " " + min3}
                              </div>
                            </div>
                            <hr />
                            <center>
                              <input type="button" className="btn btn-secondary mt-3" value="Change" onClick={this.data} />
                            </center>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>;
    }
}

export default App;
