import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import { connect } from 'react-redux';
import { Modal, Menu, Dropdown, Sidebar } from 'semantic-ui-react';
import Header from '../../public/shared/Header';
import Footer from '../../public/shared/Footer';
import Spinner1 from '../../../utils/Spinner1';
import ChartWrapper1 from './charts/ChartWrapper1';
import ChartWrapper2 from './charts/ChartWrapper2';
import ChartWrapper3 from './charts/ChartWrapper3';
import ChartWrapper4 from './charts/ChartWrapper4';
import ChartWrapper5 from './charts/ChartWrapper5';
import ChartWrapper6 from './charts/ChartWrapper6';
import ViewDetails from './ViewDetails';
import { deviceActions } from '../../../actions';
import Spinner2 from '../../../utils/Spinner2';
import firebase from '../../../firebase/firebase-init';

const { deleteDevice } = deviceActions;
const firestore = firebase.firestore();

class Device extends Component {
  state = {
    animation: 'overlay',
    direction: 'right',
    dimmed: true,
    visible: false,
    currentDevice: null,
    deviceInformation: null,
    open: false,
    openDeleteModal: false,
    isDeleting: false,
    isFetching: true,
    type: 'power',
    data: [],
    bms: null,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight,
    MAX_NUM_TO_DISPLAY: 50
  };

  async componentDidMount() {
    const {
      match: { params },
      devices: { data },
      auth
    } = this.props;

    var _id = undefined;

    for (var i = 0; i < data.length; i++) {
      if (data[i].id === params.id) {
        this.setState({ currentDevice: data[i] });
        _id = data[i]._id;
      }
    }

    if (_id === undefined) {
      this.setState({ deviceInformation: false });
    } else {
      const res = await axios.get('/api/device', { params: { id: _id } });
      const messages = res.data.messages;
      const keys = Object.keys(messages);

      for (let i = 0; i < keys.length; i++) {
        messages[keys[i]].map(msg => {
          msg['date'] = new Date(msg.timeinmillis).toString();
          return msg;
        });
      }

      this.setState({
        deviceInformation: res.data.deviceInformation,
        numOfLogs: res.data.numOfLogs,
        logs: res.data.logs,
        messages
      });
    }

    // Fetch data published today by this device
    const {
      currentDevice: { _id: deviceId },
      MAX_NUM_TO_DISPLAY
    } = this.state;

    const today = moment()
      .format()
      .split('T')[0];

    const deviceCollectionRef = firestore.collection(
      `users/${auth.uid}/devices/${deviceId}/${today}`
    );

    deviceCollectionRef.onSnapshot(res => {
      res.docChanges().forEach(change => {
        console.log('onSnapshot', change.type);
        const doc = {
          ...change.doc.data(),
          id: change.doc.id,
          date: new Date(change.doc.data().timeinmillis).toString()
        };

        switch (change.type) {
          case 'added':
            const { data } = this.state;

            if (data.length === MAX_NUM_TO_DISPLAY) data.shift();

            data.push(doc);
            this.setState({ data });
            break;
          case 'modified':
            return console.log('modified: ', doc);
          case 'removed':
            return console.log('removed: ', doc);
          default:
            return console.warning('Unknown change type has been detected');
        }
      });
    });

    const bmsCollectionRef = firestore.collection(
      `users/${auth.uid}/devices/${deviceId}/bms`
    );

    bmsCollectionRef.onSnapshot(res => {
      res.docChanges().forEach(change => {
        console.log('BMS doc', change.type);
        const doc = { ...change.doc.data() };

        switch (change.type) {
          case 'added':
            this.setState({ bms: doc });
            break;
          case 'modified':
            this.setState({ bms: doc });
            break;
          case 'removed':
            return console.log('removed: ', doc);
          default:
            return console.warning('Unknown change type has been detected');
        }
      });
    });

    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  handleAnimationChange = () => {
    this.setState(prevState => ({ visible: !prevState.visible }));
  };

  updateWindowDimensions = () => {
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight
    });
  };

  handleItemClick = (e, { name }) => this.setState({ type: name });
  handleTypeUpdate = (event, data) => this.setState({ type: data.value });

  openModal = () => this.setState({ open: true });
  openDeleteModal = () => this.setState({ openDeleteModal: true });
  closeDeleteModal = () => this.setState({ openDeleteModal: false });
  onSubmit = () => {
    const { currentDevice } = this.state;
    this.setState({ isDeleting: true, openDeleteModal: false, open: true });
    this.props.deleteDevice(currentDevice._id, currentDevice.id);
  };

  renderModal() {
    const { open } = this.state;
    return (
      <Modal dimmer='inverted' open={open}>
        <Spinner2 style={{ margin: '0px auto' }} text='Deleting...' />
      </Modal>
    );
  }

  renderDeleteModal() {
    const { openDeleteModal } = this.state;
    const header = 'Delete device';
    const content = (
      <div>
        <div>Are you sure you want to delete this device? </div>
        <div></div>
        <div>All data & logs will be removed. </div>
      </div>
    );
    const actions = (
      <div>
        <button onClick={this.closeDeleteModal} className='ui button'>
          Cancel
        </button>
        <button onClick={this.onSubmit} className='ui negative button'>
          Delete
        </button>
      </div>
    );

    return (
      <Modal
        dimmer={true}
        open={openDeleteModal}
        onClose={this.closeDeleteModal}
        size='small'
      >
        <Modal.Header>{header}</Modal.Header>
        <Modal.Content>{content}</Modal.Content>
        <Modal.Actions>{actions}</Modal.Actions>
      </Modal>
    );
  }

  renderContent() {
    return (
      <div>
        <div className='ui basic segment'>
          <div className='ui grid'>
            <div className='eight wide column device-charts'>
              <div className='ui segments device' style={{ minWidth: '300px' }}>
                {this.renderChart1()}
              </div>
            </div>
            <div className='eight wide column device-charts'>
              <div className='ui segments device' style={{ minWidth: '300px' }}>
                {this.renderChart2()}
              </div>
            </div>
          </div>
        </div>
        <div
          className='ui basic segment monitoring'
          style={{ minWidth: '300px' }}
        >
          <div className='ui segments device'>{this.renderDetails()}</div>
        </div>
        <div className='ui basic segment'>
          <div className='ui segments device'>{this.renderBMS()}</div>
        </div>
        <div className='ui basic segment'>
          <div className='ui grid'>
            <div className='eight wide column device-charts'>
              <div className='ui segments device' style={{ minWidth: '300px' }}>
                {this.renderChargeRate()}
              </div>
            </div>
            <div className='eight wide column device-charts'>
              <div className='ui segments device' style={{ minWidth: '300px' }}>
                {this.renderTemperature()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderChart1() {
    const { deviceInformation } = this.state;

    if (deviceInformation.length === 0)
      return (
        <div className='ui basic segment device-no-data'>
          <p>No messages were published from this device.</p>
          <a
            href='https://github.com/horimz/morning-sun'
            rel='noopener noreferrer'
            target='_blank'
          >
            <p style={{ cursor: 'pointer', color: 'rgb(65, 131, 196)' }}>
              Start publishing data
            </p>
          </a>
        </div>
      );

    return (
      <div>
        <div className='ui basic segment' style={{ marginTop: '10px' }}>
          <h3>
            Number of messages sent{' '}
            <span onClick={this.handleAnimationChange} className='view-details'>
              View details
            </span>
          </h3>
        </div>
        <div className='ui basic segment'>
          <ChartWrapper1 data={deviceInformation} />
        </div>
      </div>
    );
  }

  renderChart2() {
    const { numOfLogs } = this.state;
    const keys = Object.keys(numOfLogs);
    const data = keys.map(key => {
      return {
        level: key,
        numOfLogs: numOfLogs[key]
      };
    });

    if (!this.logsExist(data))
      return (
        <div className='ui basic segment device-no-data'>
          <p>No logs were published from this device.</p>
          <a
            href='https://github.com/horimz/morning-sun'
            rel='noopener noreferrer'
            target='_blank'
          >
            <p style={{ cursor: 'pointer', color: 'rgb(65, 131, 196)' }}>
              Start adding logs
            </p>
          </a>
        </div>
      );

    return (
      <div>
        <div className='ui basic segment' style={{ marginTop: '10px' }}>
          <h3>
            Logs{' '}
            <span onClick={this.handleAnimationChange} className='view-details'>
              View details
            </span>
          </h3>
        </div>
        <div className='ui basic segment'>
          <ChartWrapper2 data={data} />
        </div>
      </div>
    );
  }

  logsExist(data) {
    const logsExist = data.filter(d => d.numOfLogs !== 0).length > 0;
    return logsExist;
  }

  renderDetails() {
    const { data, type, windowWidth } = this.state;

    if (data.length === 0)
      return (
        <div className='ui segment'>
          <div
            className='ui basic segment'
            style={{ margin: '15px 0px 50px 0px', padding: '0px' }}
          >
            <h3>Monitoring</h3>
          </div>
          <div className='ui basic segment'>
            <p>No messages were published today.</p>
          </div>
        </div>
      );

    return (
      <div className='ui segment'>
        <div
          className='ui basic segment'
          style={{ margin: '15px 0px 50px 0px', padding: '0px' }}
        >
          <h3>Monitoring</h3>
          {windowWidth < 1380 ? this.renderDropdown() : null}
        </div>
        <div className='ui grid'>
          {windowWidth < 1380 ? null : (
            <div className='three wide column'>
              <Menu pointing secondary vertical>
                <Menu.Item
                  name='power'
                  active={type === 'power'}
                  onClick={this.handleItemClick}
                />
                <Menu.Item
                  name='voltage'
                  active={type === 'voltage'}
                  onClick={this.handleItemClick}
                />
                <Menu.Item
                  name='current'
                  active={type === 'current'}
                  onClick={this.handleItemClick}
                />
              </Menu>
            </div>
          )}
          <div
            className={
              windowWidth < 1380
                ? 'sixteen wide column'
                : 'thirteen wide column'
            }
          >
            <div className='ui basic segment'>
              <ChartWrapper3 data={data} type={type} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderDropdown() {
    const { type } = this.state;

    const options = [
      { key: 'power', text: 'Power', value: 'power' },
      { key: 'voltage', text: 'Voltage', value: 'voltage' },
      { key: 'current', text: 'Current', value: 'current' }
    ];

    return (
      <Dropdown
        fluid
        selection
        options={options}
        onChange={this.handleTypeUpdate}
        value={type}
      />
    );
  }

  renderBMS() {
    const { bms } = this.state;

    if (bms === null)
      return (
        <div className='ui basic segment device-no-data'>
          <p>No data was published by your BMS.</p>
        </div>
      );

    return (
      <div>
        <div className='ui basic segment' style={{ marginTop: '10px' }}>
          <h3>Battery Management System</h3>
        </div>
        <div className='ui basic segment'>
          <ChartWrapper4 data={bms} />
        </div>
      </div>
    );
  }

  renderChargeRate() {
    const { bms } = this.state;

    if (bms === null)
      return (
        <div className='ui basic segment device-no-data'>
          <p>No data published.</p>
        </div>
      );

    return (
      <div>
        <div className='ui basic segment' style={{ marginTop: '10px' }}>
          <h3>Charge Rate</h3>
        </div>
        <div className='ui basic segment'>
          <ChartWrapper5 data={bms} />
        </div>
      </div>
    );
  }

  renderTemperature() {
    const { bms } = this.state;

    if (bms === null)
      return (
        <div className='ui basic segment device-no-data'>
          <p>No data published.</p>
        </div>
      );

    return (
      <div>
        <div className='ui basic segment' style={{ marginTop: '10px' }}>
          <h3>Temperature</h3>
        </div>
        <div className='ui basic segment'>
          <ChartWrapper6 data={bms} />
        </div>
      </div>
    );
  }

  render() {
    const {
      match: { params }
    } = this.props;

    const {
      deviceInformation,
      logs,
      messages,
      animation,
      direction,
      dimmed,
      visible
    } = this.state;

    if (deviceInformation === null)
      return (
        <div style={{ height: '100vh' }}>
          <Spinner1 />
        </div>
      );

    if (deviceInformation === false)
      return window.location.replace('/dashboard');

    return (
      <Sidebar.Pushable>
        <ViewDetails
          animation={animation}
          direction={direction}
          visible={visible}
          logs={logs}
          messages={messages}
        />
        <Sidebar.Pusher
          dimmed={dimmed && visible}
          onClick={visible ? this.handleAnimationChange : null}
        >
          <div className='dashboard-device' style={{ minWidth: '600px' }}>
            {this.renderModal()}
            {this.renderDeleteModal()}
            <Header logo={false} dashboard={true} />
            <div
              className='ui basic segment'
              style={{ margin: '0px', padding: '120px 14px 30px' }}
            >
              <div className='ui basic segment'>
                <div className='ui grid'>
                  <div className='three wide column'></div>
                  <div className='four wide column'>
                    <h2 className='your-devices'>{params.id}</h2>
                  </div>
                  <div
                    className='nine wide column'
                    style={{ position: 'relative' }}
                  >
                    <button
                      onClick={this.openDeleteModal}
                      className='ui button delete-device'
                    >
                      DELETE DEVICE
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className='ui basic segment current-device'>
              <div className='ui basic segment device-content'>
                {this.renderContent()}
              </div>
            </div>
            <Footer />
          </div>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    );
  }
}

const mapStateToProps = state => {
  return { auth: state.auth, devices: state.devices };
};

export default connect(mapStateToProps, { deleteDevice })(Device);
