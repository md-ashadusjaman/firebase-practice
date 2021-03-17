import firebase from "firebase/app";
import React, { useState } from "react"
import './App.css';
import "firebase/auth";
import firebaseConfig from "./firebase.config";


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

function App() {
  const [newUser, setNewUser] = useState (false);
  const [user, setUser] = useState({
    isSignedIn: false,
    name: '',
    email: '',
    photo: '',
    password: ''
  })


  const googleProvider = new firebase.auth.GoogleAuthProvider();
  const fbProvider = new firebase.auth.FacebookAuthProvider();


  const handleSignIn = () => {
    firebase.auth().signInWithPopup(googleProvider)
      .then(result => {
        // console.log(result);
        const { displayName, photoURL, email } = result.user;
        // console.log(displayName, photoURL, email);

        const signedInUser = {
          isSignedIn: true,
          name: displayName,
          email: email,
          photo: photoURL,

        }

        setUser(signedInUser);
      })
      .catch(error => {
        console.log(error);
      })

  }


  const handleFbSignIn = () => {

  firebase
  .auth()
  .signInWithPopup(fbProvider)
  .then(result => {
    /** @type {firebase.auth.OAuthCredential} */
    var credential = result.credential;

    // The signed-in user info.
    var user = result.user;

    // This gives you a Facebook Access Token. You can use it to access the Facebook API.
    var accessToken = credential.accessToken;

    console.log("fb user", user)

    // ...
  })
  
  .catch((error) => {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;

    // ...
  });

  }






  // const handleFbSignIn = () => {
  //   firebase.auth().signInWithPopup(fbProvider).then(function(result) {
  //     var token = result.credential.accessToken;
  //     var user = result.user;
  //     console.log('fb user after sign in', user);
  //   }).catch(function(error) {
  //     var errorCode = error.code;
  //     var errorMessage = error.message;
  //     console.log(errorCode, errorMessage)
  //   });
  // }








  const handleSignOut = () => {
    firebase.auth().signOut()
      .then(result => {
        const signedOutUser = {
          isSignedIn: false,
          name: '',
          email: '',
          photo: '',
          error: '',
          success: false

        }
        setUser(signedOutUser)
      })
      .catch(error => {
        console.log(error);
      })
  }

  // button handlers

  const handleSubmit = (event) => {
    // console.log(user.email, user.password)
    if (newUser && user.email && user.password) {
      firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
        .then(rerult => {
          const newUserInfo = { ...user };
          newUserInfo.error = '';
          // console.log(response);
          newUserInfo.success = true;
          setUser(newUserInfo);
          updateUserName(user.name);
        })

        .catch(error => {
          let newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);


        });
    }
if(!newUser && user.email && user.password) {

  firebase.auth().signInWithEmailAndPassword(user.email, user.password)
        .then(result => {
          const newUserInfo = { ...user };
          newUserInfo.error = '';
          // console.log(response);
          newUserInfo.success = true;
          setUser(newUserInfo);
          console.log ("sign in info", result.user);
        })

        .catch(error => {
          let newUserInfo = { ...user };
          newUserInfo.error = error.message;
          newUserInfo.success = false;
          setUser(newUserInfo);

        });
}

    event.preventDefault();
  }


// user info update

const updateUserName = name => {
  const user = firebase.auth().currentUser;

  user.updateProfile({
    displayName : name
  })
  .then (function(){
    console.log("success");
  })
  .catch(function(){
    console.log("error");
  });
}



  const handleBlur = (event) => {
    // console.log(event.target.value, event.target.name);

    let isFieldValid = true;

    if (event.target.name === 'email') {
      isFieldValid = /\S+@\S+\.\S+/.test(event.target.value);
      // console.log(isEmailValid)
    }

    if (event.target.name === 'password') {
      const isPasswordValid = event.target.value.length > 6;
      const passwordHasNumber = /\d{1}/.test(event.target.value);
      isFieldValid = (isPasswordValid, passwordHasNumber);
    }
    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[event.target.name] = event.target.value;
      setUser(newUserInfo);
    }

  }


  return (
    <div className="App">

      {
        user.isSignedIn ? <button onClick={handleSignOut}>Sign Out:</button> :
          <button onClick={handleSignIn}>Sign In:</button>
      }
<br /> <br />
      <button onClick={handleFbSignIn}>Sign in with Facebook</button>

      {
        user.isSignedIn && <div>
          <p>Welcome, {user.name}</p>
          <p>Email: {user.email}</p>
          <img src={user.photo} alt="" />
        </div>
      }





      <form onSubmit={handleSubmit}>
        <h1> Own Authentication</h1>

        {/* <p>Email:{user.email}</p>
    <p>Password: {user.password}</p>
    <p>Name: {user.name}</p> */}

        <input type="checkbox" onChange={()=> setNewUser(!newUser)} name="newUser" id="" />
        <label htmlFor="newUser">New User Signup</label>
        <br /> <br /> <br />

        { newUser && <input type="text" name="name" onBlur={handleBlur} placeholder="Name" />}
        <br /> <br />
        <input type="text" onBlur={handleBlur} name="email" placeholder="Email" required />
        <br /> <br />
        <input type="password" onBlur={handleBlur} name="password" placeholder="Password" required />
        <br /> <br />
        <input type="submit" value={newUser ? "Sign Up" : "Sign IN"} />

      </form>

      <p style={{ color: 'red' }}> {user.error}</p>
      {user.success && <p style={{ color: 'green' }}> User {newUser ? "Created" : "Logged In"} Success</p>}


    </div>
  );
}

export default App;
