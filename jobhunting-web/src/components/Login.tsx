import React, {useState, useRef, useContext, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import AuthService from "../services/auth.service";
import { UserContext } from "../services/usercontext";
import {CustomCheckButton, CustomForm} from "../models/LoginHelper";
import styled from "styled-components";
import {deviceLogin, deviceProfile} from "../common/ScreenSizes";
import {TextField} from "@mui/material";

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
              setUser(userData);
              navigate(`/profile/${userData.id}`);
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

  const [isMobile, setIsMobile] = useState(window.matchMedia(deviceLogin.mobile).matches);
  const [isLaptop, setIsLaptop] = useState(window.matchMedia(deviceLogin.laptop).matches);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.matchMedia(deviceLogin.mobile).matches);
      setIsLaptop(window.matchMedia(deviceLogin.laptop).matches);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);


  return (
      <LoginWrapperDiv >
        <div className="card card-container">
          <Form onSubmit={handleLogin} ref={form} >
            <div className="form-group">
              <TextField
                  type="text"
                  className="form-control"
                  name="username"
                  value={username}
                  onChange={onChangeUsername}
                  required
                  fullWidth
                  placeholder="Username"
                  variant="outlined"
              />
            </div>
            <div className="form-group">
              <TextField
                  type="password"
                  className="form-control"
                  name="password"
                  value={password}
                  onChange={onChangePassword}
                  required
                  fullWidth
                  placeholder="Password"
                  variant="outlined"
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
      </LoginWrapperDiv>
  );
};

const LoginWrapperDiv = styled.div`
  display: flex;
  height: 50vh;
  margin-top: 8%;
  justify-content: center; // Distribute space between elements
  align-items: center;


  .form-group {
    padding: 10px 0; // Add vertical padding to each form-group
  }


  @media ${deviceLogin.mobile} {
    // Styles for laptop and larger devices
background-color: red  }
  
`;

export default Login;
