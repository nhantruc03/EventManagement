import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';

import React, { Component } from 'react';
import ChatRoom from './components/chat/ChatRoom';
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: "AIzaSyAvEcgONevrabJaNXYOBDBTxOb9K1AzNa8",
    authDomain: "chat-app-86654.firebaseapp.com",
    projectId: "chat-app-86654",
    storageBucket: "chat-app-86654.appspot.com",
    messagingSenderId: "1063403868159",
    appId: "1:1063403868159:web:00bc065e8bab4f10d421ca",
    measurementId: "G-69542S2J6F"
  })
} else {
  firebase.app(); // if already initialized, use that one
}


const auth = firebase.auth();
const firestore = firebase.firestore();
class SuperChat extends Component {
    constructor() {
        super();
        this.state = {
          user: null
        }
      }
    
      componentDidMount() {
        auth.onAuthStateChanged(user => {
          if (user) {
            this.setState({
              user: user
            })
          } else {
            this.setState({
              user: null
            })
          }
        })
      }
    
      render() {
        return (
          <div className="App">
            <header>
              <h1>⚛️🔥💬</h1>
              <SignOut />
            </header>
    
            <section>
              {this.state.user ? <ChatRoom auth={auth} firestore={firestore} roomId="60129f82af8ad01628e25073" /> : <SignIn />}
            </section>
          </div>
        );
      }
}

export default SuperChat;

class SignIn extends Component {
    signInWithGoogle = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider);
    }
    render() {
      return (
        <>
          <button className="sign-in" onClick={this.signInWithGoogle}>Sign in with Google</button>
          <p>Do not violate the community guidelines or you will be banned for life!</p>
        </>
      )
    }
  }
  
  
  
  class SignOut extends Component {
    render() {
      return auth.currentUser && (
        <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
      )
    }
  }