import React from 'react';
import PropTypes from 'prop-types';
import { Menu, Sidebar } from 'semantic-ui-react';

const AddDevice = props => {
  const { animation, direction, visible, close } = props;

  const content = () => {
    return (
      <div className='ui basic segment'>
        <div className='ui basic segment'>
          <div className='add-device-cancel'>
            <i
              className='x icon'
              onClick={close}
              style={{ color: '#7f8fa6' }}
            />
          </div>
        </div>
        <div className='ui segment'>
          <div className='ui grid'>
            <div className='one wide column'></div>
            <div className='seven wide column' style={{ minWidth: '400px' }}>
              <div className='add-device-content'>
                <div className='ui basic segment'>
                  <h2 style={{ fontSize: '36px' }}>
                    Do you have a new device?
                  </h2>
                </div>
                <div className='ui basic segment' style={{ marginTop: '50px' }}>
                  <div className='ui input' style={{ width: '100%' }}>
                    <input
                      type='text'
                      placeholder='Enter your device ID'
                      style={{ color: '#1a73e8' }}
                    />
                  </div>
                </div>
                <div className='ui basic segment' style={{ marginTop: '50px' }}>
                  <button
                    className='ui huge button'
                    style={{ padding: '25px 70px', fontSize: '14px' }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
            <div className='eight wide column' style={{ minWidth: '400px' }}>
              <div className='ui segment'></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
        style={{ width: '90%' }}
      >
        <div style={{ minWidth: '500px' }}>{content()}</div>
      </Sidebar>
    </div>
  );
};

AddDevice.propTypes = {
  animation: PropTypes.string,
  direction: PropTypes.string,
  visible: PropTypes.bool
};

export default AddDevice;
