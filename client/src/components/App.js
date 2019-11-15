import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { BrowserRouter, Switch } from 'react-router-dom';
import ScrollToTopRoute from './ScrollToTopRoute';
import './App.css';
import './queries.css';
import Landing from './public/Landing';
import Login from './public/Login';
import Product from './public/Product';
import Purchase from './public/Purchase';
import Docs from './public/Docs';
import TermsOfService from './public/TermsOfService';
import PrivacyPolicy from './public/PrivacyPolicy';
import Dashboard from './dashboard';
import PageNotFound from './public/PageNotFound';
import Spinner1 from '../utils/Spinner1';
import firebase from '../firebase/firebase-init';
import { userActions } from '../actions/';

const { fetchUser, setUser } = userActions;

class App extends Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        const idToken = await firebase.auth().currentUser.getIdToken(true);

        // Set default request headers/content-type
        axios.defaults.headers.common['Authorization'] = `Bearer ${idToken}`;
        axios.defaults.headers.post['Content-Type'] = 'application/json';

        this.props.fetchUser();
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
  { fetchUser, setUser }
)(App);
