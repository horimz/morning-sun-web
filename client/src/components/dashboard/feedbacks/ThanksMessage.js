import React from 'react';
import { Button, Header, Segment, Portal } from 'semantic-ui-react';

function ThanksMessage(props) {
  const { open, handleClose } = props;

  return (
    <Portal onClose={handleClose} open={open}>
      <div
        className='ui segments'
        style={{
          left: '25%',
          position: 'fixed',
          top: '30%',
          zIndex: 1000,
          width: '50%'
        }}
      >
        <div className='ui segment'>
          <Header>Thank you for submitting feedback.</Header>
        </div>
        <Segment>
          <div className='ui grid' style={{ padding: '20px 14px 20px 14px' }}>
            <div className='two wide column'>
              <i
                className='check circle outline icon'
                style={{
                  color: 'green',
                  fontSize: '30px',
                  marginTop: '10px',
                  paddingRight: '0'
                }}
              />
            </div>
            <div
              className='fourteen wide column'
              style={{ paddingLeft: '0', paddingRight: '30px' }}
            >
              If we have any questions, we will contact you by sending email to
              the email address for your account.
            </div>
          </div>
        </Segment>
        <Segment textAlign='right'>
          <Button content='Close' color='orange' onClick={handleClose} />
        </Segment>
      </div>
    </Portal>
  );
}

export default ThanksMessage;
