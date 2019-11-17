import React from 'react';
import Header from '../public/shared/Header';

function PageNotFound() {
  return (
    <div>
      <Header
        logo={true}
        style={{ backgroundColor: '#34495e', padding: '0.5em 1em' }}
      />
      <div className='ui segment not-found'>
        <div className='ui segment not-found-box'>
          <h2>Page Not Found</h2>
        </div>
      </div>
    </div>
  );
}

export default PageNotFound;
