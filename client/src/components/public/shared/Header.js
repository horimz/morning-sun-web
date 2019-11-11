import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import firebase from '../../../firebase/firebase-init';
import { Dropdown } from 'semantic-ui-react';

class Header extends Component {
  signOut = () => firebase.auth().signOut();

  renderHeaderContent() {
    const auth = this.props.auth;

    if (this.props.auth === false) {
      return (
        <div style={{ paddingTop: '14px' }}>
          <Link to='/docs' className='nav-bar-top-link join'>
            Docs
          </Link>
          <Link to='/login' className='nav-bar-top-link'>
            Login
          </Link>
        </div>
      );
    }

    return (
      <Dropdown
        trigger={
          <img
            src={auth.photoURL}
            alt='profile'
            className='ui avatar image'
            style={{
              border: '2px solid #95a5a6',
              width: '40px',
              height: 'auto'
            }}
          />
        }
        icon={null}
        pointing='top left'
        direction='left'
      >
        <Dropdown.Menu>
          <Dropdown.Header>
            <div className='ui grid'>
              <div className='eight wide column'>
                <p className='header-display-name'>{auth.displayName}</p>
              </div>
              <div className='eight wide column' onClick={this.signOut}>
                <p className='header-signout'> Sign Out</p>
              </div>
            </div>
          </Dropdown.Header>
          <Dropdown.Divider style={{ margin: '0px' }} />
          <div
            className='ui basic segment'
            style={{ margin: '0px', padding: '0px' }}
          >
            {this.props.dashboard ? (
              <Link to='/dashboard/analytics'>
                <p className='header-dropdown-content'>Analytics</p>
              </Link>
            ) : (
              <Link to='/dashboard'>
                <p className='header-dropdown-content'>Dashboard</p>
              </Link>
            )}
          </div>
          <div
            className='ui basic segment'
            style={{ margin: '0px', padding: '0px' }}
          >
            <Link to='/support'>
              <p className='header-dropdown-content'>Support</p>
            </Link>
          </div>

          <Dropdown.Divider style={{ margin: '0px' }} />
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  renderLogo() {
    if (!this.props.logo) return;

    return (
      <Link to='/'>
        <img src='./assets/images/logo.png' className='logo' alt='logo' />
      </Link>
    );
  }

  render() {
    return (
      <div className='ui basic segment' style={{ borderRadius: '0px' }}>
        <div className='ui grid'>
          <div className='two wide column' style={{ padding: '0px 14px' }}>
            {this.renderLogo()}
          </div>
          <div className='fourteen wide column'>
            <div
              className='ui clearing basic segment'
              style={{ float: 'right', padding: '0px' }}
            >
              {this.renderHeaderContent()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { auth: state.auth };
};

export default connect(mapStateToProps)(Header);
