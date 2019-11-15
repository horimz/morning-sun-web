import React, { Component } from 'react';
import axios from 'axios';
import { Button, Header, Segment, Portal, Dropdown } from 'semantic-ui-react';

const options = [
  { key: 1, text: 'General feedback', value: 'general feedback' },
  { key: 2, text: 'Feature request', value: 'feature request' },
  { key: 3, text: 'Service issue', value: 'service issue' },
  { key: 4, text: 'Account issue', value: 'account issue' }
];

class SendFeedback extends Component {
  state = { type: options[0].value, text: '' };

  handleTypeChange = (e, { value }) => this.setState({ type: value });

  handleTextChange = e => this.setState({ text: e.target.value });

  handleSubmit = (type, message) => () => {
    const payload = { type, message };
    axios.post('/api/feedback', payload);

    this.props.handleClose();
    this.props.handleOpenThanksMessage();
  };

  renderTypeDropdown() {
    return (
      <div style={{ marginBottom: '20px' }}>
        Choose the type of feedback you are submitting.
        <div style={{ marginTop: '10px', marginBottom: '35px' }}>
          <Dropdown
            onChange={this.handleTypeChange}
            options={options}
            selection
            defaultValue={options[0].value}
          />
        </div>
      </div>
    );
  }

  renderTextarea() {
    return (
      <div style={{ marginBottom: '20px', width: '100%' }}>
        Enter your message below.
        <div style={{ marginTop: '10px' }}>
          <textarea onChange={this.handleTextChange} rows='4' cols='70' />
        </div>
      </div>
    );
  }

  render() {
    const { type, text } = this.state;
    const { open, handleClose } = this.props;

    return (
      <Portal onClose={handleClose} open={open}>
        <Segment.Group
          style={{
            left: '30%',
            position: 'fixed',
            top: '20%',
            zIndex: 1000
          }}
        >
          <Segment>
            <Header>Feedback</Header>
          </Segment>

          <Segment>
            <div style={{ marginBottom: '20px' }}>
              Thank you for providing us feedback.
            </div>
            {this.renderTypeDropdown()}
            {this.renderTextarea()}
          </Segment>

          <Segment textAlign='right'>
            <Button content='Cancel' onClick={handleClose} />
            <Button
              content='Submit feedback'
              onClick={this.handleSubmit(type, text)}
              disabled={text.length === 0}
              color='orange'
            />
          </Segment>
        </Segment.Group>
      </Portal>
    );
  }
}

export default SendFeedback;
