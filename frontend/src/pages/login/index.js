import React from "react";
import { AuthContext } from "../../index";
import { navigate, A } from 'hookrouter';
import { login } from "../../services/auth";
import api from '../../services/api';

import './index.css';

export const Login = () => {
  const { dispatch } = React.useContext(AuthContext);
  const initialState = {
    email: "",
    password: "",
    isSubmitting: false,
    errorMessage: null
  };
  const [data, setData] = React.useState(initialState);
  const handleInputChange = event => {
    setData({
      ...data,
      [event.target.name]: event.target.value
    });
  };
  const handleFormSubmit = async event => {
    event.preventDefault();
    setData({
      ...data,
      isSubmitting: true,
      errorMessage: null
    });
    if (data.password.trim().length === 0 || data.email.trim().length === 0) {
      setData({
        ...data,
        isSubmitting: false,
        errorMessage: "Complete todos os campos"
      });
      return;
    }
    try {
      
      const res = await api.post("/api/auth/signin", { email: data.email, password: data.password });
      login(res.data);
      navigate('/home');
    } catch (err) {
      console.log(err);
      setData({
        ...data,
        isSubmitting: false,
        errorMessage: "Email/número e/ou senha não conferem."
      });
    }
  };
  return (
    <div className="login-container">
      <div className="card">
        <div className="container">
          <form onSubmit={handleFormSubmit}>
            <h1>Login</h1>

            <label htmlFor="email">
              Email
              <input
                type="text"
                value={data.email}
                onChange={handleInputChange}
                name="email"
                id="email"
                placeholder="Digite seu email..."
              />
            </label>

            <label htmlFor="password">
              Password
              <input
                type="password"
                value={data.password}
                onChange={handleInputChange}
                name="password"
                id="password"
                placeholder="Digite sua senha..."
              />
            </label>

            {data.errorMessage && (
              <span className="form-error">{data.errorMessage}</span>
            )}
            <div className="login-btn">
              <button disabled={data.isSubmitting}>
                {data.isSubmitting ? (
                  "Carrengando..."
                  ) : (
                    "Login"
                    )}
              </button>
            </div>
            <hr />
            <A href='/sign-up'>Criar conta</A>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Login;