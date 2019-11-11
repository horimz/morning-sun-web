import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Sidebar } from 'semantic-ui-react';

import Header from '../public/shared/Header';
import AddDevice from './devices/AddDevice';

class MainPage extends Component {
  state = {
    animation: 'overlay',
    direction: 'right',
    dimmed: false,
    visible: false
  };

  handleAnimationChange = () => {
    this.setState(prevState => ({ visible: !prevState.visible }));
  };

  renderContent() {
    return (
      <div className='dashboard-main'>
        <Header logo={false} dashboard={true} />
        <div className='ui basic segment' style={{ margin: '50px 0px 0px' }}>
          <div className='ui basic segment'>
            <div className='ui grid'>
              <div className='three wide column'></div>
              <div className='four wide column'>
                <h2 className='your-devices'>Your Devices</h2>
              </div>
              <div className='nine wide column'></div>
            </div>
          </div>
        </div>
        <div
          className='ui basic segment'
          style={{
            margin: '0px',
            backgroundImage: 'linear-gradient(#f5f6fa, #f5f6fa)',
            height: '75vh'
          }}
        >
          <div className='ui basic segment'>
            <div className='ui grid'>
              <div className='three wide column'></div>
              <div className='ten wide column'>
                <div className='ui basic segment'>
                  <div className='ui grid'>
                    <div
                      className='five wide column'
                      style={{ minWidth: '200px' }}
                    >
                      <div
                        className='ui segment device'
                        style={{ borderRadius: '8px' }}
                        onClick={this.handleAnimationChange}
                      >
                        <div className='add-device-segment'>
                          <i
                            className='plus icon'
                            style={{ color: '#1a73e8', fontSize: '20px' }}
                          />
                          <p className='add-device'>Add device</p>
                        </div>
                      </div>
                    </div>
                    <div
                      className='five wide column'
                      style={{ minWidth: '200px' }}
                    >
                      <div
                        className='ui segment device'
                        style={{ borderRadius: '8px' }}
                      >
                        <div className='device-segment'>1</div>
                      </div>
                    </div>
                    <div
                      className='five wide column'
                      style={{ minWidth: '200px' }}
                    >
                      <div
                        className='ui segment device'
                        style={{ borderRadius: '8px' }}
                      >
                        <div className='device-segment'>2</div>
                      </div>
                    </div>
                    <div
                      className='five wide column'
                      style={{ minWidth: '200px' }}
                    >
                      <div
                        className='ui segment device'
                        style={{ borderRadius: '8px' }}
                      >
                        <div className='device-segment'>3</div>
                      </div>
                    </div>
                    <div
                      className='five wide column'
                      style={{ minWidth: '200px' }}
                    >
                      <div
                        className='ui segment device'
                        style={{ borderRadius: '8px' }}
                      >
                        <div className='device-segment'>4</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='three wide column'></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const { animation, direction, dimmed, visible } = this.state;

    return (
      <Sidebar.Pushable>
        <AddDevice
          animation={animation}
          direction={direction}
          visible={visible}
          close={this.handleAnimationChange}
        />
        <Sidebar.Pusher
          dimmed={dimmed && visible}
          onClick={visible ? this.handleAnimationChange : null}
        >
          {this.renderContent()}
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }
}

const mapStateToProps = state => {
  return { auth: state.auth, device: state.devices };
};

export default connect(mapStateToProps)(MainPage);
