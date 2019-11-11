import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import './queries.css';

import Landing from './public/Landing';
import Login from './public/Login';
import Product from './public/Product';
import Purchase from './public/Purchase';
import Docs from './shared/Docs';
import TermsOfService from './shared/TermsOfService';
import PrivacyPolicy from './shared/PrivacyPolicy';
import Dashboard from './dashboard';
import PageNotFound from './shared/PageNotFound';
import Spinner1 from '../utils/Spinner1';

import firebase from '../firebase/firebase-init';
import { userActions } from '../actions/';

const { setUser } = userActions;

class App extends Component {
  componentDidMount() {
    // firebase.auth().signOut();
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        const { uid, displayName, email, emailVerified, photoURL } = user;

        const currentUser = {
          uid,
          displayName,
          email,
          emailVerified,
          photoURL
        };

        this.props.setUser(currentUser);
      } else {
        // No user is signed in
        this.props.setUser(false);
      }
    });
  }

  render() {
    const auth = this.props.auth;

    if (auth === null) return <Spinner1 />;

    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route exact path='/' component={Landing} />
            <Route exact path='/login' component={Login} />
            <Route exact path='/product' component={Product} />
            <Route exact path='/purchase' component={Purchase} />
            <Route exact path='/docs' component={Docs} />
            <Route exact path='/terms-of-service' component={TermsOfService} />
            <Route exact path='/privacy' component={PrivacyPolicy} />
            <Route exact path='/dashboard' component={Dashboard} />
            <Route component={PageNotFound} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => {
  return { auth: state.auth };
};

export default connect(
  mapStateToProps,
  { setUser }
)(App);
