import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
import { Menu, Sidebar } from 'semantic-ui-react';

class LeftSidebar extends Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  content() {
    const { match, location, history, onClick } = this.props;

    return (
      <div>
        <p>Location: {location.pathname}</p>

        <div>
          <Link onClick={onClick} to='/dashboard'>
            Dashboard
          </Link>
        </div>
        <div>
          <Link onClick={onClick} to='/dashboard/logs'>
            Logs
          </Link>
        </div>
        <div>
          <Link onClick={onClick} to='/dashboard/analytics'>
            Analytics
          </Link>
        </div>
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
          // width='wide'
          icon='labeled'
          style={{ width: '200px' }}
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
