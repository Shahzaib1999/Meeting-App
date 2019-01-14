import React, { Component } from "react";
import "../../App.css";
import * as firebase from "firebase";
import swal from "sweetalert";

class App extends Component {
    constructor() {
        super();

        this.state = {
            user: false
        };

        this.update = this.update.bind(this);
    }

    componentWillMount() {
        const db = firebase.firestore();

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                db.collection("users")
                    .doc(user.uid)
                    .get()
                    .then(res => {
                        if (res.exists) {
                            this.setState({
                                user: true,
                                uid: user.uid
                            });
                        }
                    });
            } else {
                this.props.history.replace("/");
            }
        });
    }

    update() {
        const {uid} = this.state;
        const db = firebase.firestore();
        var name = document.getElementById("name").value;
        var nickname = document.getElementById("nickname").value;
        var number = document.getElementById('number').value;
        var coffee = document.getElementById("coffee").checked;
        var juice = document.getElementById("juice").checked;
        var cocktail = document.getElementById("cocktail").checked;
        var min1 = document.getElementById("min1").checked;
        var min2 = document.getElementById("min2").checked;
        var min3 = document.getElementById('min3').checked;
        var a = this;

        if (coffee) {
          coffee = true;
        }

        if (juice) {
          juice = true;
        }

        if (cocktail) {
          cocktail = true;
        }

        if (min1) {
          min1 = true;
        }

        if (min2) {
          min2 = true;
        }

        if (min3) {
          min3 = true;
        }

        if (!name || !nickname || !number) {
            swal('Fill all the fields', '', 'error');
        }
        else {
            // db.collection("users")
            // this.setState({ name, nickname, number })
            if ((!coffee && !juice && !cocktail) || (!min1 && !min2 && !min3)) {
                swal('Select atleast one value of each', '', 'warning');
            }
            else {
                db.collection("users")
                    .doc(uid)
                    .update({
                        name,
                        nickname,
                        number,
                        coffee,
                        juice,
                        cocktail,
                        min1,
                        min2,
                        min3
                    }).then(res => {
                        swal('Data updated successfully', '', 'success');
                        a.props.history.push('/Profile');
                    }).catch(err => {
                        swal(err.message, '', 'error');
                    });

            }
    }
    }

    render() {
        return <div className="row mt-5">
            <div className="col-md-2" />
            <div className="col-md-8">
              <div className="card">
                <div className="card-header text-center" id="color">
                  <h2 id="profile">Profile</h2>
                </div>
                <div className="card-body">
                  <label>Name:</label>
                  <input type="text" className="form-control" id="name" />
                  <label className="mt-5">Nickname:</label>
                  <input type="text" className="form-control" id="nickname" />
                  <label className="mt-5">Number:</label>
                  <input type="number" className="form-control" id="number" />
                  <label className="mt-5">Select Beverages:</label>
                  <br />
                  <input type="checkbox" id="coffee" value="Coffee" />
                  Coffee
                  <br />
                  <input type="checkbox" id="juice" value="Juice" />
                  Juice
                  <br />
                  <input type="checkbox" id="cocktail" value="Cocktail" />
                  Cocktail
                  <br />
                  <label className="mt-5">Duration of meeting:</label>
                  <br />
                  <input type="checkbox" id="min1" value="20 min" />
                  20 min
                  <br />
                  <input type="checkbox" id="min2" value="60 min" />
                  60 min
                  <br />
                  <input type="checkbox" id="min3" value="120 min" />
                  120 min
                  <br />
                  <button className="btn btn-primary mt-4" id="btn_color" onClick={this.update}>
                    Update
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-2" />
          </div>;
    }
}

export default App;
