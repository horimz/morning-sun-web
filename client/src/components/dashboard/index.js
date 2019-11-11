import React, { Component } from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { Sidebar } from 'semantic-ui-react';

import LeftSidebar from './LeftSidebar';
import MainPage from './MainPage';
import Devices from './devices';
import Logs from './logs';
import Analytics from './analytics';

class Dashboard extends Component {
  state = {
    animation: 'overlay',
    direction: 'left',
    dimmed: true,
    visible: false
  };

  handleAnimationChange = () => {
    this.setState(prevState => ({ visible: !prevState.visible }));
  };

  render() {
    const auth = this.props.auth;
    const { animation, direction, dimmed, visible } = this.state;

    if (auth === false) return <Redirect to='/' />;

    return (
      <BrowserRouter>
        <div>
          <Sidebar.Pushable>
            <LeftSidebar
              animation={animation}
              direction={direction}
              visible={visible}
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
                  <Route exact path='/dashboard/devices' component={Devices} />
                  <Route exact path='/dashboard/logs' component={Logs} />
                  <Route
                    exact
                    path='/dashboard/analytics'
                    component={Analytics}
                  />
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
  return { auth: state.auth };
};

export default connect(mapStateToProps)(Dashboard);
