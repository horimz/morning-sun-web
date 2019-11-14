import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Header from './shared/Header';
import Footer from './shared/Footer';

function Landing(props) {
  const signup = () => {
    if (props.auth === false) {
      return (
        <div className='ui basic segment clear'>
          <Link to='/login' className='ui massive button landing-signin'>
            Sign Up
          </Link>
        </div>
      );
    }
  };

  return (
    <div>
      <header>
        <Header logo={true} />
        <div className='ui segment landing'>
          <div className='ui basic segment'>
            <h2 style={{ fontSize: '50px', color: '#fff' }}>
              Manage Photovoltaic Panels
            </h2>
          </div>
        </div>

        <div
          className='ui basic segment body'
          style={{ backgroundColor: '#fff' }}
        >
          <div
            className='ui grid'
            style={{ textAlign: 'center', margin: '0px' }}
          >
            <div
              className='eight wide column'
              style={{ padding: '50px 0px 50px 60px' }}
            >
              <img
                src='/assets/images/monit-2.png'
                className='monit'
                alt='monit'
              />
            </div>
            <div
              className='eight wide column'
              style={{ padding: '70px 50px', minWidth: '375px' }}
            >
              <h2>Manage your ecosystem</h2>
              <p>Keep an eye on your tracking system</p>
              <Link to='/product' className='ui big button learn-more'>
                How to start
              </Link>
            </div>
          </div>
        </div>

        <div className='ui basic segment body'>
          <div
            className='ui grid'
            style={{ textAlign: 'center', margin: '0px' }}
          >
            <div
              className='eight wide column'
              style={{ padding: '50px 100px', minWidth: '375px' }}
            >
              <i
                className='chart bar outline icon'
                style={{ fontSize: '70px', marginBottom: '20px' }}
              />
              <p style={{ color: '#e74c3c', fontWeight: '500' }}>
                Real-time monitoring
              </p>
              <p>
                Send sensor values from your panel and track them in real time.
              </p>
            </div>
            <div
              className='eight wide column'
              style={{ padding: '50px 100px', minWidth: '375px' }}
            >
              <i
                className='eye icon'
                style={{ fontSize: '70px', marginBottom: '20px' }}
              />
              <p style={{ color: '#e74c3c', fontWeight: '500' }}>
                Photovoltaic energy forecast
              </p>
              <p>Photovoltaic energy prediction for better maintenance.</p>
            </div>
          </div>
        </div>
        {signup()}
        <Footer />
      </header>
    </div>
  );
}

const mapStateToProps = state => {
  return { auth: state.auth };
};

export default connect(mapStateToProps)(Landing);
