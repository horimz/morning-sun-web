import React from 'react';
import Header from './shared/Header';

function Landing() {
  return (
    <div style={{ minWidth: '1000px' }}>
      <header>
        <Header logo={true} />

        <div className='ui container'>
          <div className='ui basic segment' style={{ height: '87vh' }}>
            <div
              className='ui basic segment'
              style={{ marginTop: '80px', textAlign: 'center' }}
            >
              <h1>Manage Photovoltaic Panels</h1>
            </div>
            <div
              className='ui basic segment'
              style={{ marginTop: '60px', padding: '14px 30px' }}
            >
              <div className='ui grid'>
                <div
                  className='eight wide column'
                  style={{ textAlign: 'center' }}
                >
                  <img
                    src='/assets/images/monit.png'
                    className='monit'
                    alt='monit'
                  />
                </div>
                <div
                  className='eight wide column'
                  style={{ textAlign: 'center', padding: '40px 14px' }}
                >
                  <h2>Manage your ecosystem</h2>
                  <p>Keep an eye on your tracking system</p>
                </div>
              </div>
            </div>

            <div
              className='ui basic segment'
              style={{
                marginTop: '60px',
                padding: '14px 50px',
                textAlign: 'center'
              }}
            >
              <div className='ui grid'>
                <div
                  className='eight wide column'
                  style={{ padding: '14px 110px' }}
                >
                  <i
                    className='chart bar outline icon'
                    style={{ fontSize: '40px', marginBottom: '20px' }}
                  />
                  <p style={{ color: '#e74c3c', fontWeight: '500' }}>
                    Real-time monitoring
                  </p>
                  <p>
                    Send sensor values from your panel and track them in real
                    time.
                  </p>
                </div>
                <div
                  className='eight wide column'
                  style={{ padding: '14px 110px' }}
                >
                  <i
                    className='eye icon'
                    style={{ fontSize: '40px', marginBottom: '20px' }}
                  />
                  <p style={{ color: '#e74c3c', fontWeight: '500' }}>
                    Photovoltaic energy forecast
                  </p>
                  <p>Photovoltaic energy prediction for better maintenance.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
}

export default Landing;
