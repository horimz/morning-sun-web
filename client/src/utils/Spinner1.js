import React from 'react';
import './Spinner1.css';

function Spinner1() {
  return (
    <div className='spinner'>
      <div className='lds-ellipsis'>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default Spinner1;
