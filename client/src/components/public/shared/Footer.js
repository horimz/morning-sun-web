import React from 'react';

function Footer() {
  return (
    <div className='ui raised segment footer'>
      <p className='footer header'>Team hawkins</p>
      <p className='footer-copyright'>&copy; 2019 hawkins</p>
      <p className='footer-text'>
        Hongik University. Computer Information Communication |&nbsp; Capston
        Design Project
      </p>
      <p className='footer-text'>Team Members: 박정민, 신경익, 지석근</p>
      <p className='footer-text' style={{ fontWeight: '525' }}>
        Contact: dp.horimz@gmail.com
      </p>

      <p className='footer-text'>
        <a
          href='https://github.com/horimz/morning-sun-web'
          rel='noopener noreferrer'
          target='_blank'
        >
          Project Github Repository
        </a>
      </p>
    </div>
  );
}

export default Footer;
