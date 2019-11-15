import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { Menu, Sidebar } from 'semantic-ui-react';
import logo from '../images/logo-white.png';

class LeftSidebar extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  content() {
    // const { location, onClick } = this.props;
    // const path = location.pathname.split('/')[2];

    const { onClick } = this.props;

    return (
      <div>
        <div
          className='ui basic segment left-side-bar'
          onClick={() => window.location.replace('/')}
        >
          <img
            src={logo}
            alt='left-side-bar-logo'
            className='left-side-bar-logo'
          />
        </div>

        <Link onClick={onClick} to='/dashboard'>
          <div className='ui basic segment left-side-bar item'>
            <div className='home-icon'>
              <i className='home icon' />
            </div>
          </div>
        </Link>

        <Link onClick={onClick} to='/dashboard/logs'>
          <div className='ui basic segment left-side-bar item'>Logs</div>
        </Link>

        <Link onClick={onClick} to='/dashboard/analytics'>
          <div className='ui basic segment left-side-bar item'>Analytics</div>
        </Link>
      </div>
    );
  }

  render() {
    const { animation, direction, visible } = this.props;

    return (
      <div>
        <Sidebar
          as={Menu}
          animation={animation}
          direction={direction}
          vertical
          visible={visible}
          icon='labeled'
          style={{ width: '180px', backgroundColor: '#3c6382', color: '#fff' }}
        >
          <div>{this.content()}</div>
        </Sidebar>
      </div>
    );
  }
}

LeftSidebar.propTypes = {
  animation: PropTypes.string,
  direction: PropTypes.string,
  visible: PropTypes.bool
};

export default withRouter(LeftSidebar);
