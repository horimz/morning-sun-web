import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Switch } from 'react-router-dom';
import ScrollToTopRoute from './ScrollToTopRoute';
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
            <ScrollToTopRoute exact path='/' component={Landing} />
            <ScrollToTopRoute path='/login' component={Login} />
            <ScrollToTopRoute path='/product' component={Product} />
            <ScrollToTopRoute path='/purchase' component={Purchase} />
            <ScrollToTopRoute path='/docs' component={Docs} />
            <ScrollToTopRoute
              exact
              path='/terms-of-service'
              component={TermsOfService}
            />
            <ScrollToTopRoute path='/privacy' component={PrivacyPolicy} />
            <ScrollToTopRoute path='/dashboard' component={Dashboard} />

            <ScrollToTopRoute component={PageNotFound} />
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
