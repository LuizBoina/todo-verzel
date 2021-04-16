import React, { createContext } from 'react';

export const itens = ["token", "userId", "username"];
export const isAuthenticated = () => localStorage.getItem('token') !== null;
export const getToken = () => localStorage.getItem('token');
export const getUsername = () => localStorage.getItem('username');
export const getUserId = () => localStorage.getItem('userId');

export const login = data => {
  itens.forEach(item => 
    localStorage.setItem(item, data[item])
  );
};
export const logout = () => {
  itens.forEach(item => 
    localStorage.removeItem(item)
    );
};

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [isSigned, setIsSigned] = React.useState(false);
  return (
    <AuthContext.Provider value={{ isSigned, setIsSigned }}>
      {children}
    </AuthContext.Provider>
  );
 };
export default AuthContext;