import React from 'react';
import './Spinner2.css';

function Spinner2(props) {
  return (
    <div className='spinner2' style={props.style}>
      <div className='lds-roller'>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

export default Spinner2;
