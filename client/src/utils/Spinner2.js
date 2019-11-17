import React from 'react';
import './Spinner2.css';

function Spinner2(props) {
  const { style, text } = props;

  return (
    <div className='spinner2' style={style}>
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
      {text ? <div style={{ marginTop: '10px' }}>{text}</div> : null}
    </div>
  );
}

export default Spinner2;
