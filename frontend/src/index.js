import React from 'react';
import ReactDOM from 'react-dom';
import { useRoutes, navigate } from 'hookrouter';
import routes from './routes';
import PageNotFound from './pages/pageNotFound';
import Header from './components/header';
import './index.css';

export const AuthContext = React.createContext(null);

const App = () => {
  const initialState = {
    userId: null,
    name: null,
    token: null,
  };
  const reducer = (state, action) => {
    switch (action.type) {
      case 'LOGIN':
        localStorage.setItem('userId', JSON.stringify(action.payload.data.login.userId));
        localStorage.setItem('name', JSON.stringify(action.payload.data.login.name));
        localStorage.setItem('token', JSON.stringify(action.payload.data.login.token));
        return {
          ...state,
          userId: action.payload.data.login.userId,
          role: action.payload.data.login.role,
          token: action.payload.data.login.token
        };
      case 'LOGOUT':
        localStorage.clear();
        return {
          ...state,
          userId: null,
          storeId: null,
          role: null
        };
      default:
        return state;
    }
  };
  const [state, dispatch] = React.useReducer(reducer, initialState);
  React.useEffect(() => {
    const userId = JSON.parse(localStorage.getItem('userId') || null);
    const name = JSON.parse(localStorage.getItem('name') || null);
    const token = JSON.parse(localStorage.getItem('token') || null);
    if (userId && token && name) {
      dispatch({
        type: 'LOGIN',
        payload: {
          data: {
            login: {
              userId: userId,
              name: name,
              token: token
            }
          }
        }
      });
      navigate('/home');
    }
    else
      navigate('/login');
  }, []);
  const routeResult = useRoutes(routes);

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch
      }}>
      <div>
        <Header />
        {routeResult || <PageNotFound />}
      </div>
    </AuthContext.Provider>
  );
}

export default AuthContext;

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);