import React from 'react';
// import { navigate } from 'hookrouter';

import './index.css';

// se tiver token no local storage mostra botao de logOut e nome

const Header = () => {
  return (
    <header className='header'>
      <div className='banner'>
        <div>
          <h2>TODO List</h2>
        </div>
        <div>
          {<h4>Olá, Fulano/Botao para entrar</h4>}
        </div>
      </div>
    </header>
  );
};

export default Header;