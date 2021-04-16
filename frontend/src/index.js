import React from 'react';
import ReactDOM from 'react-dom';
import { useRoutes, navigate } from 'hookrouter';
import routes from './routes';
import PageNotFound from './pages/pageNotFound';
import Header from './components/header';
import { AuthProvider } from './services/auth';

import './index.css';

const App = () => {  
  
  React.useEffect(() => {
    const userId = localStorage.getItem('userId');
    const name = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    if (userId && token && name) {
      
      navigate('/home');
    }
    else
      navigate('/login');
  }, []);

  const routeResult = useRoutes(routes);

  return (
    <AuthProvider>
      <div>
        <Header />
        {routeResult || <PageNotFound />}
      </div>
    </AuthProvider>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);