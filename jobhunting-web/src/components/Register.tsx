import React, { useState, useRef } from "react";
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";

import CheckButton from "react-validation/build/button";
import isEmail from "validator/lib/isEmail";
import {CustomCheckButton, CustomForm} from "../models/LoginHelper";

import TextField from '@mui/material/TextField';

import AuthService from "../services/auth.service";
import styled from "styled-components";

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
    };
    touched: {
        username: boolean;
        email: boolean;
        password: boolean;
    };
}



// const required = (value: string) => {
//     if (!value) {
//         return (
//             <div className="invalid-feedback d-block">This field is required!</div>
//         );
//     }
// };

// const validEmail = (value: string) => {
//     if (!isEmail(value)) {
//         return (
//             <div className="invalid-feedback d-block">
//                 This is not a valid email.
//             </div>
//         );
//     }
// };



// const vpassword = (value: string) => {
//     if (value.length < 6 || value.length > 40) {
//         return (
//             <div className="invalid-feedback d-block">
//                 The password must be between 6 and 40 characters.
//             </div>
//         );
//     }
// };

const Register: React.FC = () => {
    const form = useRef<CustomForm | null>(null);
    const checkBtn = useRef<CustomCheckButton | null>(null);

    // const vusername = (value: string) => {
    //     if (value.length < 3 || value.length > 20) {
    //         return (
    //             <div className="invalid-feedback d-block">
    //                 The username must be between 3 and 20 characters.
    //             </div>
    //         );
    //     }
    // };

    // const vpassword = (value: string): string | undefined => {
    //     if (value.length < 6 || value.length > 40) {
    //         return "The password must be between 6 and 40 characters.";
    //     }
    // };
    //
    // const vusername = (value: string): string | undefined => {
    //     if (value.length < 3 || value.length > 20) {
    //         return "The username must be between 3 and 20 characters.";
    //     }
    // };


    const required = (value: string): string | undefined => {
        if (!value) {
            return "This field is required!";
        }
    };

    // const validEmail = (value: string): string | undefined => {
    //     if (!isEmail(value)) {
    //         return "This is not a valid email.";
    //     }
    // };

    const vpassword = (value: string): string | null => {
        if (value.length < 6 || value.length > 40) {
            return "The password must be between 6 and 40 characters.";
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




    // const [state, setState] = useState<RegisterState>({
    //     username: "",
    //     email: "",
    //     password: "",
    //     successful: false,
    //     message: "",
    // });

    const { username, email, password, successful, message } = state;

    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>, validator: (value: string) => string | null) => {
    //     const { name, value } = e.target;
    //     setState(prevState => ({
    //         ...prevState,
    //         [name]: value,
    //         validation: {
    //             ...prevState.validation,
    //             [name]: validator(value)
    //         }
    //     }));
    // };
    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const { name, value } = e.target;
    //     setState(prevState => ({
    //         ...prevState,
    //         [name]: value
    //     }));
    // };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let validationError: string | null = null;

        // Define a type guard to ensure the key is a valid key of the touched object
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



    const handleBlur = (e: React.FocusEvent<HTMLInputElement>, validator: (value: string) => string | null) => {
        const { name, value } = e.target;
        setState(prevState => ({
            ...prevState,
            touched: {
                ...prevState.touched,
                [name]: true
            },
            validation: {
                ...prevState.validation,
                [name]: validator(value)
            }
        }));
    };



    const onChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
        const username = e.target.value;
        setState((prevState) => ({ ...prevState, username }));
    };

    const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        const email = e.target.value;
        setState((prevState) => ({ ...prevState, email }));
    };

    const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const password = e.target.value;
        setState((prevState) => ({ ...prevState, password }));
    };

    const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Perform validation checks
        const usernameError = vusername(state.username);
        const emailError = validEmail(state.email);
        const passwordError = vpassword(state.password);

        // Update state with validation results and mark all fields as touched
        setState(prevState => ({
            ...prevState,
            touched: {
                username: true,
                email: true,
                password: true
            },
            validation: {
                username: usernameError,
                email: emailError,
                password: passwordError
            },
            message: "",
            successful: false
        }));

        // If there are any validation errors, stop the function here
        if (usernameError || emailError || passwordError) {
            return;
        }

        // If validations pass, proceed with the registration API call
        AuthService.register(state.username, state.email, state.password).then(
            response => {
                // Handle successful registration
                setState(prevState => ({
                    ...prevState,
                    successful: true,
                    message: response.data.message // Handle response message accordingly
                }));
                // Additional actions upon successful registration can be added here
            },
            error => {
                // Handle API errors
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


    return (
        <RegisterWrapperDiv >
            <div className="card card-container">
                <Form onSubmit={handleRegister} ref={form}>
                    {!successful && (
                        <div>
                            <div className="form-group">
                                <TextField
                                    type="text"
                                    className="form-control"
                                    name="username"
                                    label="Username"
                                    variant="outlined"
                                    value={state.username}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
                                    onBlur={(e: React.FocusEvent<HTMLInputElement>) => handleBlur(e, vusername)}
                                    fullWidth
                                />
                                {state.touched.username && state.validation.username && (
                                    <div className="invalid-feedback d-block">{state.validation.username}</div>
                                )}

                            </div>
                            <div className="form-group">
                                <div className="form-group">
                                    <TextField
                                        type="text"
                                        className="form-control"
                                        name="email"
                                        label="Email"
                                        variant="outlined"
                                        value={state.email}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
                                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => handleBlur(e, validEmail)}
                                        fullWidth
                                    />
                                    {state.touched.email && state.validation.email && (
                                        <div className="invalid-feedback d-block">{state.validation.email}</div>
                                    )}
                                </div>

                            </div>
                            <div className="form-group">
                                <div className="form-group">
                                    <TextField
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        label="Password"
                                        variant="outlined"
                                        value={state.password}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e)}
                                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => handleBlur(e, vpassword)}
                                        fullWidth
                                    />
                                    {state.touched.password && state.validation.password && (
                                        <div className="invalid-feedback d-block">{state.validation.password}</div>
                                    )}
                                </div>

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
            </div>
        </RegisterWrapperDiv>
    );
};

const RegisterWrapperDiv = styled.div`
  display: flex;
  background-color: blue;
  height: 60vh;
  margin-top: 8%;
  justify-content: space-between; // Distribute space between elements
  align-items: flex-start;

  .form-group {
    width: 100%; // Ensure form groups take full width
    padding: 10px 0; // Vertical padding for each form group
    box-sizing: border-box; // Ensures padding does not add to the width
  }
`;

export default Register;
