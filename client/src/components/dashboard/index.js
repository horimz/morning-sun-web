import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Sidebar } from 'semantic-ui-react';
import LeftSidebar from './LeftSidebar';
import MainPage from './MainPage';
import Devices from './devices';
import Logs from './logs/Logs';
import Analytics from './analytics';
import Spinner1 from '../../utils/Spinner1';

import { deviceActions } from '../../actions';

const { fetchDevices } = deviceActions;

class Dashboard extends Component {
  state = {
    animation: 'overlay',
    direction: 'left',
    dimmed: true,
    visible: false
  };

  componentDidMount() {
    this.props.fetchDevices();
  }

  handleAnimationChange = () => {
    this.setState(prevState => ({ visible: !prevState.visible }));
  };

  render() {
    const { auth, devices } = this.props;
    const { animation, direction, dimmed, visible } = this.state;

    if (auth === false) return <Redirect to='/' />;

    if (devices === null) return <Spinner1 />;

    return (
      <BrowserRouter>
        <div>
          <Sidebar.Pushable>
            <LeftSidebar
              animation={animation}
              direction={direction}
              visible={visible}
              onClick={this.handleAnimationChange}
            />

            <Sidebar.Pusher
              dimmed={dimmed && visible}
              onClick={visible ? this.handleAnimationChange : null}
            >
              <div
                className='content-icon'
                onClick={this.handleAnimationChange}
              >
                <i className='content icon' />
              </div>

              <div>
                <Switch>
                  <Route exact path='/dashboard' component={MainPage} />
                  <Route path='/dashboard/devices' component={Devices} />
                  <Route path='/dashboard/logs' component={Logs} />
                  <Route path='/dashboard/analytics' component={Analytics} />
                </Switch>
              </div>
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = state => {
  return { auth: state.auth, devices: state.devices, logs: state.logs };
};

export default connect(
  mapStateToProps,
  { fetchDevices }
)(Dashboard);
