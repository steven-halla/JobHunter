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
}

const required = (value: string) => {
    if (!value) {
        return (
            <div className="invalid-feedback d-block">This field is required!</div>
        );
    }
};

const validEmail = (value: string) => {
    if (!isEmail(value)) {
        return (
            <div className="invalid-feedback d-block">
                This is not a valid email.
            </div>
        );
    }
};

const vusername = (value: string) => {
    if (value.length < 3 || value.length > 20) {
        return (
            <div className="invalid-feedback d-block">
                The username must be between 3 and 20 characters.
            </div>
        );
    }
};

const vpassword = (value: string) => {
    if (value.length < 6 || value.length > 40) {
        return (
            <div className="invalid-feedback d-block">
                The password must be between 6 and 40 characters.
            </div>
        );
    }
};

const Register: React.FC = () => {
    const form = useRef<CustomForm | null>(null);
    const checkBtn = useRef<CustomCheckButton | null>(null);


    const [state, setState] = useState<RegisterState>({
        username: "",
        email: "",
        password: "",
        successful: false,
        message: "",
    });

    const { username, email, password, successful, message } = state;

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

        setState((prevState) => ({
            ...prevState,
            message: "",
            successful: false,
        }));

        if (form.current && checkBtn.current) {
            form.current.validateAll();

            if (checkBtn.current.context._errors.length === 0) {
                AuthService.register(username, email, password).then(
                    (response) => {
                        setState((prevState) => ({
                            ...prevState,
                            message: response.data.message,
                            successful: true,
                        }));
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
                            message: resMessage,
                            successful: false,
                        }));
                    }
                );
            }
        }
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
                                    value={username}
                                    onChange={onChangeUsername}
                                    fullWidth
                                />
                            </div>
                            <div className="form-group">
                                <TextField
                                    type="text"
                                    className="form-control"
                                    name="email"
                                    label="Email"
                                    variant="outlined"
                                    value={email}
                                    onChange={onChangeEmail}
                                    fullWidth
                                />
                            </div>
                            <div className="form-group">
                                <TextField
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    label="Password"
                                    variant="outlined"
                                    value={password}
                                    onChange={onChangePassword}
                                    fullWidth
                                />
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
