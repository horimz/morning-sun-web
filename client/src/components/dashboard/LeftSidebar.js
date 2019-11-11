import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Sidebar } from 'semantic-ui-react';

const LeftSidebar = props => {
  const { animation, direction, visible } = props;

  return (
    <div>
      <Sidebar
        as={Menu}
        animation={animation}
        direction={direction}
        vertical
        visible={visible}
        // width='wide'
        // icon='labeled'
        style={{ width: '300px' }}
      >
        <div>content comes here.</div>
      </Sidebar>
    </div>
  );
};

LeftSidebar.propTypes = {
  animation: PropTypes.string,
  direction: PropTypes.string,
  visible: PropTypes.bool
};

export default LeftSidebar;
