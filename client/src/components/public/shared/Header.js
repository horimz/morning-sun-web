import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import firebase from '../../../firebase/firebase-init';
import { Dropdown, Menu } from 'semantic-ui-react';

class Header extends Component {
  state = { prevScrollPos: window.pageYOffset, visible: true };

  signOut = () => firebase.auth().signOut();

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    const { location } = this.props;

    if (location.pathname.includes('dashboard')) return;

    // const { prevScrollPos } = this.state;
    const currentScrollPos = window.pageYOffset;

    if (currentScrollPos > 200) return this.setState({ visible: false });

    this.setState({ visible: true });
    // const visible = prevScrollPos > currentScrollPos;
  };

  renderHeaderContent() {
    const auth = this.props.auth;
    const { visible } = this.state;

    if (this.props.auth === false) {
      return (
        <div>
          <Link
            to='/docs'
            className={
              visible ? 'nav-bar-top-link join' : 'nav-bar-top-link2 join'
            }
          >
            Docs
          </Link>
          <Link
            to='/login'
            className={visible ? 'nav-bar-top-link' : 'nav-bar-top-link2'}
          >
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
              <a href='/'>
                <p className='header-dropdown-content'>Home</p>
              </a>
            ) : (
              <Link to='/dashboard'>
                <p className='header-dropdown-content'>Dashboard</p>
              </Link>
            )}
          </div>

          {this.props.dashboard ? null : (
            <div
              className='ui basic segment'
              style={{ margin: '0px', padding: '0px' }}
            >
              <Link to='/support'>
                <p className='header-dropdown-content'>Support</p>
              </Link>
            </div>
          )}

          <div
            className='ui basic segment'
            style={{ margin: '0px', padding: '0px' }}
          >
            <Link to='/docs' rel='noopener noreferrer' target='_blank'>
              <p className='header-dropdown-content'>Docs</p>
            </Link>
          </div>

          <Dropdown.Divider style={{ margin: '0px' }} />
        </Dropdown.Menu>
      </Dropdown>
    );
  }

  renderLogo() {
    if (!this.props.logo) return;

    const { visible } = this.state;

    return (
      <Link to='/'>
        <img
          src={
            visible
              ? './assets/images/logo-white.png'
              : './assets/images/logo.png'
          }
          className='logo'
          alt='logo'
        />
      </Link>
    );
  }

  render() {
    const { visible } = this.state;
    const { style } = this.props;
    return (
      <Menu
        className={visible ? 'shared-header' : 'shared-header-hidden'}
        size='tiny'
        borderless
        style={style}
      >
        <Menu.Item style={{ padding: '0px' }}>{this.renderLogo()}</Menu.Item>
        <Menu.Item position='right'>{this.renderHeaderContent()}</Menu.Item>
      </Menu>
    );
  }
}

const mapStateToProps = state => {
  return { auth: state.auth };
};

export default withRouter(connect(mapStateToProps)(Header));
