import React, { Component } from 'react';
import { connect } from 'react-redux';

import Header from '../../public/shared/Header';

class Device extends Component {
  render() {
    const {
      match: { params }
    } = this.props;

    console.log(params.id);

    return (
      <div className='dashboard-device'>
        <Header logo={false} dashboard={true} />
        <div className='ui basic segment' style={{ margin: '50px 0px 0px' }}>
          <div className='ui basic segment'>
            <div className='ui grid'>
              <div className='three wide column'></div>
              <div className='four wide column'>
                <h2 className='your-devices'>{params.id}</h2>
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
          <div className='ui segment'>Display chart here</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { devices: state.devices };
};

export default connect(mapStateToProps)(Device);
