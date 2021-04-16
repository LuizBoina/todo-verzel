import React from 'react';
import Home from './pages/home';
import Login from './pages/login';
import SignUp from './pages/signUp';

const routes = {
  '/home': () => <Home />,
  '/login': () => <Login />,
  '/sign-up': () => <SignUp />
};

export default routes;