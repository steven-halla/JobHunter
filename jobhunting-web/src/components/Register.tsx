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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, validator: (value: string) => string | null) => {
        const { name, value } = e.target;
        setState(prevState => ({
            ...prevState,
            [name]: value,
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

        const usernameError = vusername(state.username);
        const emailError = validEmail(state.email);
        const passwordError = vpassword(state.password);

        setState(prevState => ({
            ...prevState,
            message: "",
            successful: false,
            validation: {
                username: usernameError,
                email: emailError,
                password: passwordError
            }
        }));

        if (usernameError || emailError || passwordError) {
            return;
        }

        AuthService.register(state.username, state.email, state.password).then(
            response => {
                setState(prevState => ({
                    ...prevState,
                    successful: true,
                    message: response.data.message
                }));
            },
            error => {
                const resMessage = (error.response && error.response.data && error.response.data.message) ||
                    error.message ||
                    error.toString();

                setState(prevState => ({
                    ...prevState,
                    successful: false,
                    message: resMessage
                }));
            }
        );
    };

    // const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //
    //     // Clear previous messages and perform validations
    //     const usernameError = vusername(state.username);
    //     const emailError = validEmail(state.email);
    //     const passwordError = vpassword(state.password);
    //
    //     setState(prevState => ({
    //         ...prevState,
    //         message: "",
    //         successful: false,
    //         validation: {
    //             username: usernameError,
    //             email: emailError,
    //             password: passwordError
    //         }
    //     }));
    //
    //     // Check for validation errors
    //     if (usernameError || emailError || passwordError) {
    //         // If there are validation errors, stop here and don't submit the form
    //         return;
    //     }
    //
    //     // No validation errors, proceed with registration API call
    //     AuthService.register(state.username, state.email, state.password).then(
    //         response => {
    //             // Handle successful registration
    //             setState(prevState => ({
    //                 ...prevState,
    //                 successful: true,
    //                 message: response.data.message // Assuming the response contains a message
    //             }));
    //             // Additional actions on successful registration (like redirecting)
    //         },
    //         error => {
    //             // Handle errors from the API
    //             const resMessage = (error.response && error.response.data && error.response.data.message) ||
    //                 error.message ||
    //                 error.toString();
    //
    //             // Update the state to reflect the error
    //             setState(prevState => ({
    //                 ...prevState,
    //                 successful: false,
    //                 message: resMessage
    //             }));
    //         }
    //     );
    // };


    // const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //
    //     // Check for validation errors
    //     if (!state.validation.username && !state.validation.email && !state.validation.password) {
    //         // Set the loading state or any other state needed before registration
    //         setState(prevState => ({ ...prevState, successful: false, message: "" }));
    //
    //         // Call AuthService.register or your registration API
    //         AuthService.register(state.username, state.email, state.password).then(
    //             response => {
    //                 // Handle successful registration
    //                 // Update the state to reflect the successful registration
    //                 setState(prevState => ({
    //                     ...prevState,
    //                     successful: true,
    //                     message: response.data.message // Assuming the response has a message
    //                 }));
    //
    //                 // Redirect the user or perform other actions post-registration
    //                 // e.g., navigate to a different page or show a success message
    //             },
    //             error => {
    //                 // Handle errors in registration
    //                 const resMessage =
    //                     (error.response &&
    //                         error.response.data &&
    //                         error.response.data.message) ||
    //                     error.message ||
    //                     error.toString();
    //
    //                 // Update the state to reflect the error
    //                 setState(prevState => ({
    //                     ...prevState,
    //                     successful: false,
    //                     message: resMessage
    //                 }));
    //             }
    //         );
    //     } else {
    //         // In case of validation errors, you might want to update the state
    //         // to reflect that the submission was unsuccessful
    //         setState(prevState => ({ ...prevState, successful: false }));
    //     }
    // };


    // const handleRegister = (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //
    //
    //
    //     setState((prevState) => ({
    //         ...prevState,
    //         message: "",
    //         successful: false,
    //     }));
    //
    //     if (form.current && checkBtn.current) {
    //         form.current.validateAll();
    //
    //         if (checkBtn.current.context._errors.length === 0) {
    //             AuthService.register(username, email, password).then(
    //                 (response) => {
    //                     setState((prevState) => ({
    //                         ...prevState,
    //                         message: response.data.message,
    //                         successful: true,
    //                     }));
    //                 },
    //                 (error) => {
    //                     const resMessage =
    //                         (error.response &&
    //                             error.response.data &&
    //                             error.response.data.message) ||
    //                         error.message ||
    //                         error.toString();
    //
    //                     setState((prevState) => ({
    //                         ...prevState,
    //                         message: resMessage,
    //                         successful: false,
    //                     }));
    //                 }
    //             );
    //         }
    //     }
    // };

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
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, vusername)}
                                    fullWidth
                                />

                                {state.validation.username && <div className="invalid-feedback d-block">{state.validation.username}</div>}

                            </div>
                            <div className="form-group">
                                <TextField
                                    type="text"
                                    className="form-control"
                                    name="email"
                                    label="Email"
                                    variant="outlined"
                                    value={state.email}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, validEmail)}
                                    fullWidth
                                />
                                {state.validation.email && <div className="invalid-feedback d-block">{state.validation.email}</div>}

                            </div>
                            <div className="form-group">
                                <TextField
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    label="Password"
                                    variant="outlined"
                                    value={password}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange(e, vpassword)}
                                    fullWidth
                                />
                                {state.validation.password && <div className="invalid-feedback d-block">{state.validation.password}</div>}

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
