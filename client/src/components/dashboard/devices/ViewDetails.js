import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Menu, Sidebar, Dropdown, Table, Icon } from 'semantic-ui-react';

const status = {
  critical: 'red',
  error: 'orange',
  warning: 'yellow',
  info: 'blue'
};

class ViewDetails extends Component {
  state = { type: null, date: null };

  updateType = (event, data) => this.setState({ type: data.value });
  updateDate = (event, data) => this.setState({ date: data.value });

  renderContent() {
    return (
      <div>
        <div className='ui basic segment device-details'>
          {this.renderDropdown()}
        </div>
        <div className='ui basic segment'>{this.renderTable()}</div>
      </div>
    );
  }

  renderDropdown() {
    const { type } = this.state;

    const options = [
      { key: 'messages', text: 'View messages', value: 'messages' },
      { key: 'logs', text: 'View logs', value: 'logs' }
    ];

    return (
      <Dropdown
        placeholder='Select to view details'
        fluid
        selection
        options={options}
        onChange={this.updateType}
        value={type}
        style={{ border: '1px solid #95afc0' }}
      />
    );
  }

  renderTable() {
    const { type } = this.state;

    if (type === 'messages') return this.renderMessagesTable();

    if (type === 'logs') return this.renderLogsTable();
  }

  renderMessagesTable() {
    const { messages } = this.props;
    const messagesKey = Object.keys(messages);

    if (messagesKey.length === 0) {
      return (
        <div
          className='ui segment'
          style={{ fontStyle: 'oblique', padding: '30px 14px' }}
        >
          <p>No messeges published by this device.</p>
        </div>
      );
    }

    return (
      <div>
        <div className='ui basic left aligned segment'>
          <p style={{ marginRight: '10px' }}>
            Select a date you would like to view{' '}
          </p>
          {this.renderDateFilterDropdown(messagesKey)}
        </div>
        <div className='ui basic segment'>
          {this.renderFilteredTable(messages)}
        </div>
      </div>
    );
  }

  renderDateFilterDropdown(messagesKey) {
    const { date } = this.state;

    const options = messagesKey.map(key => {
      return { key, text: key, value: key };
    });

    return (
      <Dropdown
        placeholder='Select a date'
        selection
        options={options}
        onChange={this.updateDate}
        value={date}
        compact
        style={{ border: '1px solid #95afc0' }}
      />
    );
  }

  renderFilteredTable(messages) {
    const { date } = this.state;

    if (date === null) return;

    const rows = messages[date].map(message => {
      return (
        <Table.Row key={message._id}>
          <Table.Cell>{message.power}W</Table.Cell>
          <Table.Cell>{message.voltage}V</Table.Cell>
          <Table.Cell>{message.current}A</Table.Cell>
          <Table.Cell>{message.date}</Table.Cell>
        </Table.Row>
      );
    });

    return (
      <div className='table-wrapper'>
        <Table selectable padded>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Power</Table.HeaderCell>
              <Table.HeaderCell>Voltage</Table.HeaderCell>
              <Table.HeaderCell>Current</Table.HeaderCell>
              <Table.HeaderCell>Date</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body className='log-tbody'>{rows}</Table.Body>
        </Table>
      </div>
    );
  }

  renderLogsTable() {
    const { logs } = this.props;

    if (logs.length === 0) {
      return (
        <div
          className='ui segment'
          style={{ fontStyle: 'oblique', padding: '30px 14px' }}
        >
          <p>No logs created by this device.</p>
        </div>
      );
    }

    const rows = logs.map(log => {
      const levelClassName = `ui ${status[log.level]} empty circular label`;
      const isCritical = log.level === 'critical' ? true : false;

      return (
        <Table.Row key={log._id} negative={isCritical ? true : false}>
          <Table.Cell style={{ paddingLeft: '25px' }}>
            <div className={levelClassName}></div>
          </Table.Cell>
          <Table.Cell>{log.deviceId}</Table.Cell>
          <Table.Cell>
            {isCritical ? <Icon name='attention' /> : ''}
            {log.message}
          </Table.Cell>
          <Table.Cell>{log.date}</Table.Cell>
        </Table.Row>
      );
    });

    return (
      <div>
        <div className='table-wrapper'>
          <Table selectable padded>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Level</Table.HeaderCell>
                <Table.HeaderCell>Device ID</Table.HeaderCell>
                <Table.HeaderCell>Message</Table.HeaderCell>
                <Table.HeaderCell>Date</Table.HeaderCell>
              </Table.Row>
            </Table.Header>

            <Table.Body className='log-tbody'>{rows}</Table.Body>
          </Table>
        </div>
        <div style={{ textAlign: 'right', margin: '20px 10px 0px 0px' }}>
          <a href='/dashboard/logs'>go to logs</a>
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
          icon='labeled'
          style={{ width: '70%', backgroundColor: '#fff' }}
        >
          <div>{this.renderContent()}</div>
        </Sidebar>
      </div>
    );
  }
}

ViewDetails.propTypes = {
  animation: PropTypes.string,
  direction: PropTypes.string,
  visible: PropTypes.bool
};

export default ViewDetails;
