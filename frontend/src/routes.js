import React from 'react';
import Home from './pages/home';
import SignUp from './pages/signUp';

const routes = {
  '/home': () => <Home />,
  ['/', '/auth']: () => <SignUp />,
};

export default routes;