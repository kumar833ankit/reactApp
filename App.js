import React, {  useRef, useState } from 'react';//1)hooks for returnnig object ,ou to have state variables in functional components.
//import axios from 'axios';
import './App.css';
//import {Button, FormControl ,InputLabel, Input } from '@material-ui/core';
import firebase from 'firebase/app';//it's a db struct.
import 'firebase/firestore';
import 'firebase/auth';//for google authentication
import 'firebase/analytics';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';//for accessing db data 

firebase.initializeApp({

  apiKey: "AIzaSyCcBnBog5TMZCkW4vnZkj9AP_7Jm3KHU-8",
  authDomain: "letstalk-97853.firebaseapp.com",
  projectId: "letstalk-97853",
  storageBucket: "letstalk-97853.appspot.com",
  messagingSenderId: "867689181958",
  appId: "1:867689181958:web:f5917f750707fc1c53a487",
  measurementId: "G-JD77C5FGYZ"
})//API parsing  

const auth = firebase.auth();// storing it in variables 
const firestore = firebase.firestore();
const analytics = firebase.analytics();


function App() {

  const [user] = useAuthState(auth);// taking user in values for google authenication 
  

  return (
    <div className="App">
      <header>
        <h1 className="tile">LETS <span>TALK</span> </h1>
        
        
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();// using and poping google login from firebase point 
    auth.signInWithPopup(provider);
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      <h1 class="intro">    Basic Frame don't expect much 😃  </h1>
            <h2 class="devD">⭐ we made it for split screen </h2>
            <h3 class="devD">⭐For windows Windows key + left/right arrow. 😎 </h3>
            <h3  class="devD">⭐ AtLast have FUN </h3>
          <h4 class="devD">DEVs Ankit & Arthur</h4>
    </>
  )

}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}


function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(250);

  const [messages] = useCollectionData(query, { idField: 'id' });

  const [formValue, setFormValue] = useState('');


  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL} = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    });

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form  onSubmit={sendMessage}>
    
      <input className="inputp" value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="Type a message" />

      <button className="inputs" onClick={sendMessage} type="submit" disabled={!formValue}>send</button>
   
    </form>
  </>)
}


function ChatMessage(props) {
  const { text,createdAt, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
    
      
         
      <p className="para">{text}</p>
    </div>
  </>)
}


export default App;