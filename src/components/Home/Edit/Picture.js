import React, { Component } from "react";
import "../../App.css";
import * as firebase from "firebase";
import swal from "sweetalert";
import UserAvatar from "react-user-avatar";
import Swiper from "react-id-swiper";

class App extends Component {
  constructor() {
    super();

    this.state = {
      user: false
    };

    this.updatePic = this.updatePic.bind(this);
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

  updatePic() {
    var file = document.getElementById("image1").files[0];
    var file2 = document.getElementById("image2").files[0];
    var file3 = document.getElementById("image3").files[0];
    const storageRef = firebase.storage().ref();
    const db = firebase.firestore();
    var a = this;

    var fileName1 = "images/user_" +Math.random().toString().substring(2, 6) +".jpg";
    var ImageRef1 = storageRef.child(fileName1);
    var fileName2 ="images/user_" + Math.random().toString().substring(2, 6) +".jpg";
    var ImageRef2 = storageRef.child(fileName2);
    var fileName3 = "images/user_" + Math.random().toString().substring(2, 6) +".jpg";
    var ImageRef3 = storageRef.child(fileName3);

    if (!file || !file2 || !file3) {
      swal("Select 3 pictures", "", "warning");
    } else {
      ImageRef1.put(file).then(function() {
        ImageRef1.getDownloadURL().then(function(url1) {
          ImageRef2.put(file2).then(function() {
            ImageRef2.getDownloadURL().then(function(url2) {
              ImageRef3.put(file3).then(function() {
                ImageRef3.getDownloadURL().then(function(url3) {
                  db.collection("users")
                    .doc(a.state.uid)
                    .update({ pic1: url1, pic2: url2, pic3: url3 })
                    .then(() => {
                        swal("Picture updated successfully", "", "success");
                        a.props.history.replace("/Profile");
                    });
                });
              });
            });
          });
        });
      });
    }
  }

  render() {
    return (
      <div className="row mt-5">
        <div className="col-md-2" />
        <div className="col-md-8">
          <div className="card">
            <div className="card-header text-center" id="color">
              <h2 id="profile">Profile</h2>
            </div>
            <div className="card-body">
              <label>Choose Images:</label>
              <input type="file" className="form-control" id="image1" />
              <br />
              <input type="file" className="form-control" id="image2" />
              <br />
              <input type="file" className="form-control" id="image3" />
              <button className="btn btn-primary mt-4" id="btn_color" onClick={this.updatePic}>
                Update
              </button>
            </div>
          </div>
        </div>
        <div className="col-md-2" />
      </div>
    );
  }
}

export default App;
