import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import firebase from '../../firebase/firebase-init';
import axios from 'axios';
import Spinner1 from '../../utils/Spinner1';

class SignIn extends Component {
  // Configure FirebaseUI.
  uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      // firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      // Avoid redirects after sign-in.
      signInSuccessWithAuthResult: async e => {
        const { uid, displayName, email, emailVerified, photoURL } = e.user;

        const user = {
          uid,
          displayName,
          email,
          emailVerified,
          photoURL
        };

        try {
          await axios.post('/api/login', user);
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  renderSignInForm() {
    return (
      <StyledFirebaseAuth
        uiConfig={this.uiConfig}
        firebaseAuth={firebase.auth()}
      />
    );
  }

  render() {
    // Fetching user state
    if (this.props.auth === null) {
      return <Spinner1 />;
    }

    // User is not signed in
    if (this.props.auth === false) {
      return (
        <div className='signin'>
          <div className='ui basic segment' style={{ marginTop: '100px' }}>
            <div className='ui basic segment' style={{ textAlign: 'center' }}>
              <h1>Morning Sun</h1>
            </div>
            <div className='ui basic segment' style={{ textAlign: 'center' }}>
              <div className='ui grid'>
                <div
                  className='ui five wide column'
                  style={{ minWidth: '0px' }}
                ></div>
                <div
                  className='ui six wide column'
                  style={{ minWidth: '350px' }}
                >
                  <div className='ui segment sign-in-box'>
                    <div>
                      <img
                        src='./assets/images/logo.png'
                        className='signin-logo'
                        alt='signin-logo'
                      />
                    </div>
                    <p className='signin-text'>Start now</p>
                    <div>{this.renderSignInForm()}</div>
                  </div>
                </div>
                <div
                  className='ui five wide column'
                  style={{ minWidth: '0px' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // User is signed in
    return <Redirect to='/' />;
  }
}

const mapStateToProps = state => {
  return { auth: state.auth };
};

export default connect(mapStateToProps)(SignIn);
