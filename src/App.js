import firebase from "firebase/app";
import React, { useState } from "react"
import './App.css';
import "firebase/auth";
import firebaseConfig from "./firebase.config";


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

function App() {

const [user,setUser] = useState({
  isSignedIn: false,
  name: '',
  email: '',
  photo: '',
})


  const provider = new firebase.auth.GoogleAuthProvider();
  const handleSignIn = () =>{
    firebase.auth().signInWithPopup(provider)
    .then(result => {
      // console.log(result);
      const {displayName, photoURL, email} = result.user;
      // console.log(displayName, photoURL, email);

      const signedInUser = {
        isSignedIn: true,
        name: displayName,
        email: email,
        photo: photoURL
      }

      setUser(signedInUser);
    })
    .catch(error =>{
      console.log(error);
    })

  }

  const handleSignOut = () => {
    firebase.auth().signOut()
    .then(result => {
      const signedOutUser = {
        isSignedIn: false,
        name: '',
        email: '',
        photo: '',
      }
      setUser(signedOutUser)
    })
    .catch(error =>{
      console.log(error);
    })
  }





  return (
    <div className="App">

      {
        user.isSignedIn ?  <button onClick={handleSignOut}>Sign Out:</button> :
        <button  onClick={handleSignIn}>Sign In:</button>
      }
   

     
      {
        user.isSignedIn && <div>   
          <p>Welcome, {user.name}</p>
          <p>Email: {user.email}</p>
          {/* <img src={user.photo} alt=""> </img> */}
        </div>
      }
      
      
    </div>
  );
}

export default App;
