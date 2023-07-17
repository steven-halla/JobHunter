import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";

import CheckButton from "react-validation/build/button";

import AuthService from "../services/auth.service";
import { UserContext } from "../services/usercontext";

import { ComponentType } from "react";
import {CustomCheckButton, CustomForm} from "../models/LoginHelper";


interface LoginState {
  username: string;
  password: string;
  loading: boolean;
  message: string;
}

const required = (value: string) => {
  if (!value) {
    return (
        <div className="invalid-feedback d-block">This field is required!</div>
    );
  }
};

const Login: React.FC = () => {
  const form = useRef<CustomForm | null>(null);
  const checkBtn = useRef<CustomCheckButton | null>(null);
  const { setUser } = useContext(UserContext);

  const [state, setState] = useState<LoginState>({
    username: "",
    password: "",
    loading: false,
    message: "",
  });

  const navigate = useNavigate();

  const onChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    const username = e.target.value;
    setState((prevState) => ({ ...prevState, username }));
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setState((prevState) => ({ ...prevState, password }));
  };

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setState((prevState) => ({ ...prevState, message: "", loading: true }));

    if (form.current && checkBtn.current) {
      form.current.validateAll();

      if (checkBtn.current.context._errors.length === 0) {
        AuthService.login(state.username, state.password).then(
            (userData) => {
              setUser(userData); // Update the UserContext with the returned user data
              navigate("/profile");
              window.location.reload();
            },
            (error) => {
              const resMessage =
                  (error.response &&
                      error.response.data &&
                      error.response.data.message) ||
                  error.message ||
                  error.toString();

              setState((prevState) => ({
                ...prevState,
                loading: false,
                message: resMessage,
              }));
            }
        );
      } else {
        setState((prevState) => ({ ...prevState, loading: false }));
      }
    }
  };

  const { username, password, loading, message } = state;

  return (
      <div className="col-md-12">
        <div className="card card-container">
          <img
              src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
              alt="profile-img"
              className="profile-img-card"
          />

          <Form onSubmit={handleLogin} ref={form}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <Input
                  type="text"
                  className="form-control"
                  name="username"
                  value={username}
                  onChange={onChangeUsername}
                  validations={[required]}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <Input
                  type="password"
                  className="form-control"
                  name="password"
                  value={password}
                  onChange={onChangePassword}
                  validations={[required]}
              />
            </div>

            <div className="form-group">
              <button className="btn btn-primary btn-block" disabled={loading}>
                {loading && (
                    <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Login</span>
              </button>
            </div>

            {message && (
                <div className="form-group">
                  <div className="alert alert-danger" role="alert">
                    {message}
                  </div>
                </div>
            )}
            <CheckButton style={{ display: "none" }} ref={checkBtn} />
          </Form>
        </div>
      </div>
  );
};

export default Login;
