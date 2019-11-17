import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Modal, Menu } from 'semantic-ui-react';
import Header from '../../public/shared/Header';
import Footer from '../../public/shared/Footer';
import Spinner1 from '../../../utils/Spinner1';
import ChartWrapper1 from './charts/ChartWrapper1';
import ChartWrapper2 from './charts/ChartWrapper2';
import ChartWrapper3 from './charts/ChartWrapper3';
import { deviceActions } from '../../../actions';
import Spinner2 from '../../../utils/Spinner2';
import firebase from '../../../firebase/firebase-init';

const { deleteDevice } = deviceActions;
const firestore = firebase.firestore();

const MAX_NUM_TO_DISPLAY = 10;

class Device extends Component {
  state = {
    currentDevice: null,
    deviceInformation: null,
    open: false,
    openDeleteModal: false,
    isDeleting: false,
    isFetching: true,
    type: 'power',
    data: []
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
      this.setState({
        deviceInformation: res.data.deviceInformation,
        numOfLogs: res.data.numOfLogs
      });
    }

    // Fetch data published today by this device
    const {
      currentDevice: { _id: deviceId }
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
        const doc = { ...change.doc.data(), id: change.doc.id };
        switch (change.type) {
          case 'added':
            const { data } = this.state;

            if (data.length === MAX_NUM_TO_DISPLAY) {
              data.shift();
              data.push(doc);

              return this.setState({ data });
            }

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
  }

  handleItemClick = (e, { name }) => this.setState({ type: name });

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
        <div className='ui basic segment'>
          <div className='ui segments device'>{this.renderDetails()}</div>
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
          <a href='/docs' rel='noopener noreferrer' target='_blank'>
            <p style={{ cursor: 'pointer', color: 'rgb(65, 131, 196)' }}>
              Start publishing data
            </p>
          </a>
        </div>
      );

    return (
      <div>
        <div className='ui basic segment' style={{ marginTop: '10px' }}>
          <h3>Number of messages sent</h3>
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
          <a href='/docs' rel='noopener noreferrer' target='_blank'>
            <p style={{ cursor: 'pointer', color: 'rgb(65, 131, 196)' }}>
              Start publishing logs
            </p>
          </a>
        </div>
      );

    return (
      <div>
        <div className='ui basic segment' style={{ marginTop: '10px' }}>
          <h3>Logs</h3>
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
    const { data, type } = this.state;

    return (
      <div className='ui segment'>
        <div className='ui basic segment' style={{ marginTop: '10px' }}>
          <h3>Monitoring ({type})</h3>
        </div>
        <div className='ui grid'>
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
          <div className='thirteen wide column'>
            <div className='ui segment'>
              <ChartWrapper3 data={data} type={type} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const {
      match: { params }
    } = this.props;
    const { deviceInformation } = this.state;

    if (deviceInformation === null)
      return (
        <div style={{ height: '100vh' }}>
          <Spinner1 />
        </div>
      );

    if (deviceInformation === false) return <Redirect to='/dashboard' />;

    return (
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
    );
  }
}

const mapStateToProps = state => {
  return { auth: state.auth, devices: state.devices };
};

export default connect(
  mapStateToProps,
  { deleteDevice }
)(Device);
