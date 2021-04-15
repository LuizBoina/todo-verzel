import React from 'react';
import { navigate } from 'hookrouter';

import './index.css';

const Header = () => {
  return (
    <header className='header'>
      <div className='banner'>
        <div>
          <h2 onClick={() => navigate('/')}>TODO List</h2>
        </div>
        <div>
          <h4>Olá, Fulano</h4>
        </div>
        <div>
          <h4 onClick={() => navigate('/')}>Log Out</h4>
        </div>
      </div>
    </header>
  );
};

export default Header;