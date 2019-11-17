import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Menu, Sidebar, Modal } from 'semantic-ui-react';

import Spinner2 from '../../../utils/Spinner2';
import { deviceActions } from '../../../actions';

const { addDevice, resetDeviceStatus } = deviceActions;

var timer1;
var timer2;

class AddDevice extends Component {
  state = {
    deviceId: '',
    open: false,
    isAdding: false,
    added: false,
    showMessage: false
  };

  static getDerivedStateFromProps(props, state) {
    const { resetDeviceStatus } = props;
    const { data, status } = props.devices;

    if (status === 'created') {
      resetDeviceStatus(data);
      return { isAdding: false, added: true };
    }

    return null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { close } = nextProps;
    const { added, showMessage } = nextState;

    if (added) {
      timer1 = setTimeout(() => {
        close();
        this.setState({ deviceId: '', added: false, showMessage: true });
      }, 1000);
    }

    if (showMessage) {
      timer2 = setTimeout(() => {
        this.setState({ showMessage: false });
      }, 2000);

      return false;
    }

    return true;
  }

  componentWillUnmount() {
    clearTimeout(timer1);
    clearTimeout(timer2);
  }

  onChange = e => this.setState({ deviceId: e.target.value });
  openModal = () => this.setState({ open: true });
  closeModal = () => this.setState({ open: false });
  onSubmit = id => () => {
    this.setState({ isAdding: true, open: false });
    this.props.addDevice(id);
  };

  renderModal() {
    const { deviceId, open } = this.state;
    const header = 'Confirm your device ID';
    const content =
      'Publish sensor values from your device after creating one.';
    const actions = (
      <div>
        <button onClick={this.closeModal} className='ui button'>
          Cancel
        </button>
        <button
          onClick={this.onSubmit(deviceId)}
          className='ui positive button'
        >
          Add device
        </button>
      </div>
    );

    return (
      <Modal dimmer={true} open={open} onClose={this.closeModal} size='small'>
        <Modal.Header>{header}</Modal.Header>
        <Modal.Content>{content}</Modal.Content>
        <Modal.Actions>{actions}</Modal.Actions>
      </Modal>
    );
  }

  content() {
    const { deviceId: value, isAdding, added } = this.state;
    const { close } = this.props;

    if (isAdding) return <Spinner2 />;

    if (added) return <div>{this.renderAddedSuccessfullyMessage()}</div>;

    return (
      <div>
        <div className='ui basic segment'>
          <div className='ui grid'>
            <div className='ten wide column' style={{ minWidth: '400px' }}>
              <div className='ui basic segment'>
                <div className='add-device-cancel'>
                  <i
                    className='x icon'
                    onClick={close}
                    style={{ color: '#7f8fa6' }}
                  />
                </div>
              </div>

              <div className='ui basic segment'>
                <div className='ui grid'>
                  <div className='one wide column'></div>
                  <div className='ten wide column'>
                    <div className='add-device-content'>
                      <div className='ui basic segment'>
                        <h2 style={{ fontSize: '36px' }}>Add a new device.</h2>
                      </div>
                      <div
                        className='ui basic segment'
                        style={{ marginTop: '50px' }}
                      >
                        <div
                          className='ui input add-device'
                          style={{ width: '100%' }}
                        >
                          <input
                            type='text'
                            onChange={e => this.onChange(e)}
                            value={value}
                            placeholder='Enter your device ID'
                            style={{ color: '#1a73e8' }}
                          />
                        </div>
                      </div>
                      <div
                        className='ui basic segment'
                        style={{ marginTop: '50px' }}
                      >
                        {this.renderButton()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='six wide column' style={{ padding: '0px' }}>
              <div
                className='ui basic segment'
                // style={{ height: '100vh', backgroundColor: '#1a73e8' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderAddedSuccessfullyMessage() {
    return (
      <div className='center'>
        <h2>Device was successfully added!</h2>
      </div>
    );
  }

  renderButton() {
    const disabledButton = (
      <button className='ui disabled huge button device'>Continue</button>
    );

    const blueButton = (
      <button onClick={this.openModal} className='ui huge button device'>
        Continue
      </button>
    );

    const { deviceId: id } = this.state;
    if (id.length < 4) return disabledButton;

    if (this.deviceIdExists(id)) return disabledButton;

    return blueButton;
  }

  deviceIdExists(id) {
    const { data } = this.props.devices;

    return data.some(device => device.id === id);
  }

  render() {
    const { animation, direction, visible } = this.props;

    return (
      <div>
        {this.renderModal()}
        <Sidebar
          as={Menu}
          animation={animation}
          direction={direction}
          vertical
          visible={visible}
          // width='wide'
          // icon='labeled'
          style={{ width: '100%' }}
        >
          <div style={{ minWidth: '750px' }}>{this.content()}</div>
        </Sidebar>
      </div>
    );
  }
}

AddDevice.propTypes = {
  animation: PropTypes.string,
  direction: PropTypes.string,
  visible: PropTypes.bool
};

const mapStateToProps = state => {
  return { devices: state.devices };
};

export default connect(
  mapStateToProps,
  { addDevice, resetDeviceStatus }
)(AddDevice);
