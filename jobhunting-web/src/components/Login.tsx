import React, {useState, useRef, useContext, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";
import AuthService from "../services/auth.service";
import { UserContext } from "../services/usercontext";
import {CustomCheckButton, CustomForm} from "../models/LoginHelper";
import styled from "styled-components";
import {deviceLogin} from "../common/ScreenSizes";
import {TextField} from "@mui/material";
import Button from '@mui/material/Button';
import {colors, fonts} from "../common/CommonStyles";

interface LoginState {
  username: string;
  password: string;
  loading: boolean;
  message: string;
}

const Login: React.FC = () => {

  const handleCreateAccountClick = () => {
    navigate('/register'); // Use the path that you have defined for your register route
  };

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
              console.log("Logged in user:", userData); // Log user object
              setUser(userData);
              navigate(`/home/${userData.id}`);
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
  const [isMobile, setIsMobile] =
      useState(window.matchMedia(deviceLogin.mobile).matches);
  const [isLaptop, setIsLaptop] =
      useState(window.matchMedia(deviceLogin.laptop).matches);

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
        <LoginTitle>
        <h2>Job Hunter</h2>
          <h4>Sign in and start the hunt!</h4>
        </LoginTitle>
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
          <Button variant="contained" color="primary" onClick={handleCreateAccountClick}>
            Create New Account
          </Button>
        </div>
      </LoginWrapperDiv>
  );
};

const LoginTitle = styled.div`
  height: 20%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  
  h2 {
    color: #496cae;
    font-family: ${fonts.InputPlaceHolderFontFamily};
  }
  h4 {
     color: #eae8ef;
  } 
}
`;

const LoginWrapperDiv = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center; 
  align-items: center;
  background-color: ${colors.AppBackGroundColor};
  flex-direction: column;
  
  .form-group {
    padding: 10px 0;
  }
`;

export default Login;
