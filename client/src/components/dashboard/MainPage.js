import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Sidebar, Label, Popup } from 'semantic-ui-react';

import Header from '../public/shared/Header';
import Footer from '../public/shared/Footer';
import AddDevice from './devices/AddDevice';
import SendFeedback from './feedbacks/SendFeedback';
import ThanksMessage from './feedbacks/ThanksMessage';

import { userActions } from '../../actions';

const { generateKey } = userActions;

class MainPage extends Component {
  state = {
    animation: 'push',
    direction: 'right',
    dimmed: false,
    visible: false,
    openFeedback: false,
    openThanksMessage: false,
    isGeneratingKey: false,
    tooltip: 'Click to copy'
  };

  componentDidUpdate(prevProps) {
    const {
      auth: { apiKey }
    } = this.props;

    if (apiKey !== prevProps.auth.apiKey)
      this.setState({ isGeneratingKey: false });
  }

  handleAnimationChange = () =>
    this.setState(prevState => ({ visible: !prevState.visible }));
  handleOpenFeedback = () => this.setState({ openFeedback: true });
  handleCloseFeedback = () => this.setState({ openFeedback: false });
  handleOpenThanksMessage = () => this.setState({ openThanksMessage: true });
  handleCloseThanksMessage = () => this.setState({ openThanksMessage: false });
  generateApiKey = () => {
    this.setState({ isGeneratingKey: true });
    this.props.generateKey();
  };

  copyToClipboard = e => {
    var tempInput = document.createElement('input');
    tempInput.style = 'position: absolute; left: -1000px; top: -1000px';
    tempInput.value = this.props.auth.apiKey;

    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);

    this.setState({ tooltip: 'Key copied!' });
  };

  renderInlineLoader() {
    return <div className='ui active centered inline loader'></div>;
  }

  renderContent() {
    return (
      <div className='dashboard-main'>
        <Header logo={false} dashboard={true} />
        <div
          className='ui basic segment'
          style={{ margin: '0px', padding: '120px 14px 30px' }}
        >
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
            paddingBottom: '100px',
            backgroundImage: 'linear-gradient(#f5f6fa, #f5f6fa)'
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
                        style={{ borderRadius: '8px', minWidth: '170px' }}
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
                    {this.renderDevices()}
                  </div>
                </div>
              </div>
              <div className='three wide column'></div>
            </div>
          </div>
        </div>
        <div
          className='ui basic segment'
          style={{
            margin: '0px',
            backgroundImage: 'linear-gradient(#f5f6fa, #f5f6fa)',
            paddingBottom: '100px'
          }}
        >
          <div className='ui basic segment' style={{ textAlign: 'center' }}>
            <div className='ui grid'>
              <div
                className='two wide column'
                style={{ minWidth: '0px' }}
              ></div>
              <div className='six wide column' style={{ minWidth: '375px' }}>
                {this.renderApiKey()}
              </div>
              <div className='six wide column' style={{ minWidth: '375px' }}>
                {this.renderFeedback()}
              </div>
              <div
                className='two wide column'
                style={{ minWidth: '0px' }}
              ></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  renderDevices() {
    const { data } = this.props.devices;

    return data.map(device => {
      return (
        <div
          key={device.id}
          className='five wide column'
          style={{ minWidth: '200px' }}
        >
          <Link to={`/dashboard/devices/${device.id}`}>
            <div className='ui segment device' style={{ borderRadius: '8px' }}>
              <div className='device-segment'>{device.id}</div>
            </div>
          </Link>
        </div>
      );
    });
  }

  renderApiKey() {
    const {
      auth: { apiKey }
    } = this.props;
    const { isGeneratingKey, tooltip } = this.state;

    const popupContent = (
      <span style={{ position: 'absolute', right: '10px' }}>
        <i className='copy outline icon' onClick={this.copyToClipboard} />
      </span>
    );

    if (isGeneratingKey) {
      return (
        <div className='ui segment key-loader'>{this.renderInlineLoader()}</div>
      );
    }

    return (
      <div className='ui segment'>
        {apiKey ? (
          <Label attached='top left'>
            <Popup
              trigger={<div>API key</div>}
              flowing
              hoverable
              mouseLeaveDelay={500}
              hideOnScroll
            >
              <button onClick={this.generateApiKey} className='ui button'>
                Generate new API key
              </button>
            </Popup>
          </Label>
        ) : (
          <Label attached='top left'>API key</Label>
        )}

        {apiKey ? (
          <div className='ui segment key-box'>
            <span className='api-key-text'>{apiKey}</span>

            {document.queryCommandSupported('copy') ? (
              <Popup
                trigger={popupContent}
                content={`${tooltip}`}
                className='key-copy-popup'
                mouseLeaveDelay={300}
                on='hover'
                onUnmount={() => this.setState({ tooltip: 'Click to copy' })}
                inverted
                position='top center'
                pinned={true}
              />
            ) : null}
          </div>
        ) : (
          <div className='ui basic segment' style={{ marginBottom: '15px' }}>
            <button
              onClick={this.generateApiKey}
              className='ui fluid button key'
            >
              Generate API key
            </button>
          </div>
        )}
      </div>
    );
  }

  renderFeedback() {
    const { openFeedback, openThanksMessage } = this.state;
    return (
      <div className='ui segments'>
        <SendFeedback
          open={openFeedback}
          handleClose={this.handleCloseFeedback}
          handleOpenThanksMessage={this.handleOpenThanksMessage}
        />

        <ThanksMessage
          open={openThanksMessage}
          handleClose={this.handleCloseThanksMessage}
        />

        <div className='ui segment'>
          <h3 className='feedback-header'>Any feedback?</h3>
        </div>
        <div className='ui segment'>
          <div className='ui grid'>
            <div className='four wide column'>
              <i className='envelope icon feedback' />
            </div>
            <div className='eleven wide column' style={{ paddingLeft: '0px' }}>
              <p className='feedback-text'>
                <span
                  onClick={this.handleOpenFeedback}
                  className='feedback-submit'
                >
                  Submit feedback&nbsp;
                </span>
                to tell us about your experience with our system.
              </p>
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
  return { auth: state.auth, devices: state.devices };
};

export default connect(
  mapStateToProps,
  { generateKey }
)(MainPage);
