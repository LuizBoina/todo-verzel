import React, { useContext } from 'react';
import { A } from 'hookrouter';
import { getUsername, logout, isAuthenticated } from '../../services/auth';
import AuthContext from '../../services/auth';

import './index.css';

const Header = () => {
  const { isSigned, setIsSigned } = useContext(AuthContext);


  
  return (
    <header className='header'>
      <div className='banner'>
        <div>
          <h2>TODO List</h2>
        </div>
        <div>
          {isSigned || isAuthenticated() ? 
          <h4>
            Olá, {getUsername()} <A className="login-a" onClick={() => {logout(); setIsSigned(false)}} href='/login'>(Sair)</A>
          </h4>
          :
          <h4>
            <A className="login-a" href='/login'>Login</A>
          </h4>}
          
        </div>
      </div>
    </header>
  );
};

export default Header;