import React, { useState, useRef } from "react";
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";
import isEmail from "validator/lib/isEmail";
import {CustomCheckButton, CustomForm} from "../models/LoginHelper";
import TextField from '@mui/material/TextField';
import AuthService from "../services/auth.service";
import styled from "styled-components";
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import {colors, fonts} from "../common/CommonStyles";
import { deviceProfile} from "../common/ScreenSizes";

interface RegisterState {
    username: string;
    email: string;
    password: string;
    successful: boolean;
    message: string;
    validation: {
        username: string | null;
        email: string | null;
        password: string | null;
        [key: string]: string | null;
    };
    touched: {
        username: boolean;
        email: boolean;
        password: boolean;
        [key: string]: boolean;
    };
}

const Register: React.FC = () => {
    const form = useRef<CustomForm | null>(null);
    const checkBtn = useRef<CustomCheckButton | null>(null);
    const navigate = useNavigate();

    const required = (value: string): string | undefined => {
        if (!value) {
            return "This field is required!";
        }
    };

    const vpassword = (value: string): string | null => {
        if (value.length > 30) {
            return "Password must be no more than 30 characters.";
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/;
        if (!passwordRegex.test(value)) {
            return "Password must be 8-30 characters long, include an uppercase letter, a number, and a special character.";
        }
        return null;
    };

    const vusername = (value: string): string | null => {
        if (value.length < 3 || value.length > 20) {
            return "The username must be between 3 and 20 characters.";
        }
        return null;
    };

    const validEmail = (value: string): string | null => {
        if (!isEmail(value)) {
            return "This is not a valid email.";
        }
        return null;
    };

    const [state, setState] = useState<RegisterState>({
        username: "",
        email: "",
        password: "",
        successful: false,
        message: "",
        validation: {
            username: null,
            email: null,
            password: null
        },
        touched: {
            username: false,
            email: false,
            password: false
        }
    });

    const { successful, message } = state;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let validationError: string | null = null;

        const isTouchedKey = (key: any): key is keyof typeof state.touched => {
            return key in state.touched;
        };

        if (isTouchedKey(name) && state.touched[name]) {
            // Determine which validator to use based on the field name
            switch (name) {
                case 'username':
                    validationError = vusername(value);
                    break;
                case 'email':
                    validationError = validEmail(value);
                    break;
                case 'password':
                    validationError = vpassword(value);
                    break;
                default:
                    break;
            }
        }

        setState(prevState => ({
            ...prevState,
            [name]: value,
            validation: {
                ...prevState.validation,
                [name]: validationError
            }
        }));
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        console.log("Blur blockage")

        let validationError: string | null = null;

        // @ts-ignore
        validationError = required(value);

        if (!validationError) {
            switch (name) {
                case 'username':
                    validationError = vusername(value);
                    break;
                case 'email':
                    validationError = validEmail(value);
                    break;
                case 'password':
                    validationError = vpassword(value);
                    break;
                default:
                    break;
            }
        }

        setState(prevState => ({
            ...prevState,
            touched: {
                ...prevState.touched,
                [name]: true,
            },
            validation: {
                ...prevState.validation,
                [name]: validationError,
            }
        }));
    };

    const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
        console.log("Hi")
        e.preventDefault();
        const usernameError = required(state.username) || vusername(state.username);
        const emailError = required(state.email) || validEmail(state.email);
        const passwordError = required(state.password) || vpassword(state.password);

        console.log("Validation Results:", {
            usernameError: usernameError,
            emailError: emailError,
            passwordError: passwordError
        });

        setState(prevState => ({
            ...prevState,
            validation: {
                username: usernameError,
                email: emailError,
                password: passwordError
            },
            touched: {
                username: true,
                email: true,
                password: true
            },
        }));

        if (usernameError || emailError || passwordError) {
            return;
        }
        AuthService.register(state.username, state.email, state.password).then(
            response => {
                // Handle successful registration
                setState(prevState => ({
                    ...prevState,
                    successful: true,
                    message: response.data.message // Handle response message accordingly
                }));
                alert("Congrats, account created!");
                navigate('/');
            },
            error => {
                const resMessage = (error.response && error.response.data && error.response.data.message) ||
                    error.message || error.toString();
                setState(prevState => ({
                    ...prevState,
                    successful: false,
                    message: resMessage
                }));
            }
        );
    };

    const handleCreateAccountClick = () => {
        navigate('/'); // Use the path that you have defined for your register route
    };


    return (
        <RegisterWrapperDiv >
            <RegisterTitle>
                <h2>Job Hunter</h2>
                <h4>Let us Help us assist you in your job hunt.</h4>
            </RegisterTitle>
            <div className="card card-container col-md-12 " style={{ minWidth: '200px' }}>
                <Form onSubmit={handleRegister} ref={form}>
                    {!successful && (
                        <div>
                                <div className="form-group" style={{bottom: 0}}>
                                    <TextField
                                        type="text"
                                        className="form-control"
                                        name="username"
                                        placeholder="Username"
                                        variant="outlined"
                                        value={state.username}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
                                        // @ts-ignore

                                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => handleBlur(e, vusername)}
                                        fullWidth
                                    />
                                    {state.touched.username && state.validation.username && (
                                        <MessageDiv className="invalid-feedback d-block">{state.validation.username}</MessageDiv>
                                    )}
                                 </div>
                                <div className="form-group">
                                    <TextField
                                        type="text"
                                        className="form-control"
                                        name="email"
                                        placeholder="Email"
                                        variant="outlined"
                                        value={state.email}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
                                        // @ts-ignore

                                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => handleBlur(e, validEmail)}
                                        fullWidth
                                    />
                                    {state.touched.email && state.validation.email && (
                                        <MessageDiv className="invalid-feedback d-block">{state.validation.email}</MessageDiv>
                                    )}

                            </div>
                            <div className="form-group">
                                    <TextField
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        placeholder="Password"
                                        variant="outlined"
                                        value={state.password}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
                                        // @ts-ignore

                                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => handleBlur(e, vpassword)}
                                        fullWidth
                                    />
                                    {state.touched.password && state.validation.password && (
                                        <MessageDiv className="invalid-feedback d-block">{state.validation.password}</MessageDiv>
                                    )}

                            </div>

                            <div className="form-group">
                                <button className="btn btn-primary btn-block">Sign Up</button>
                            </div>
                        </div>
                    )}

                    {message && (
                        <div className="form-group">
                            <div
                                className={`alert ${
                                    successful ? "alert-success" : "alert-danger"
                                }`}
                                role="alert"
                            >
                                {message}
                            </div>
                        </div>
                    )}
                    <CheckButton style={{ display: "none" }} ref={checkBtn} />
                </Form>
                <Button variant="contained" color="primary" onClick={handleCreateAccountClick}>
                    Back to Login
                </Button>
            </div>

            <Footer></Footer>

        </RegisterWrapperDiv>
    );
};
const Footer = styled.div`
height: 20vh;
  width: 100%;
  background-color: ${colors.AppBackGroundColor};

  @media ${deviceProfile.mobile} {
    height: 30vh;
  }
`;

const RegisterTitle = styled.div`
  height: 20%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin-top: 5%;
  
  h2 {
color: #496cae;
    font-family: ${fonts.InputPlaceHolderFontFamily};
  }
  h4 {
    // font-family:  ${fonts.ButtonFontFamily};
color: #eae8ef;
  }
`;

const RegisterWrapperDiv = styled.div`
  display: flex;
  background-color: ${colors.AppBackGroundColor};
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  
  .form-group {
    width: 100%; // Ensure form groups take full width
    padding: 10px 0; // Vertical padding for each form group
    box-sizing: border-box; // Ensures padding does not add to the width
  }
  overflow: visible; /* Allow children to spill out of the parent container */
`;

const MessageDiv = styled.div`
margin-top: 25px;
  white-space: normal; /* Prevent text from wrapping */
`;

export default Register;
