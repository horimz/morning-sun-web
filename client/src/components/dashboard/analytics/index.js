import React, { Component } from 'react';
import { connect } from 'react-redux';

import Header from '../../public/shared/Header';

class Analytics extends Component {
  render() {
    return (
      <div className='dashboard-analytics'>
        <Header logo={false} dashboard={true} />
        <div className='ui basic segment' style={{ margin: '50px 0px 0px' }}>
          <div className='ui basic segment'>
            <div className='ui grid'>
              <div className='three wide column'></div>
              <div className='four wide column'>
                <h2 className='your-devices'>Analytics</h2>
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
          <div className='ui segment'>Content</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { devices: state.devices };
};

export default connect(mapStateToProps)(Analytics);
