import React from 'react';

// TODO: Fix errors on actions
function Modal(props) {
  const dimmer = props.dimmer ? props.dimmer : true;

  console.log(props);
  return null;
  // <Modal dimmer={dimmer} open={props.open} onClose={props.onClose}>
  //   <Modal.Header>{props.header}</Modal.Header>
  //   <Modal.Content>{props.content}</Modal.Content>
  //   <Modal.Actions>asdf</Modal.Actions>

  //   <Modal.Actions>{props.actions}</Modal.Actions>
  // </Modal>
}

export default Modal;
