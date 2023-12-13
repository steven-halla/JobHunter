import React, {useState, useEffect, useContext} from "react";
import {Routes, Route, Link, useNavigate} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/Login";
import Register from "./components/Register";
import BoardUser from "./components/BoardUser";
import BoardModerator from "./components/BoardModerator";
import BoardAdmin from "./components/BoardAdmin";
import { useLocation } from "react-router-dom";


// import AuthVerify from "./common/AuthVerify";
import EventBus from "./common/EventBus";

import {User} from "./models/User";
import {UserContext, UserContextProvider} from "./services/usercontext";
import {Home} from "./components/Home";
import {JobViewAll} from "./components/JobViewAll";
import { JobsContextProvider } from "./services/jobcontext";
import {InterviewSecured} from "./components/InterviewSecured";
import {JobsAppliedDateGraph} from "./components/JobsAppliedDateGraph";
import {Header} from "./components/Header";
import {Test} from "./components/Test";
import {UpdateJob} from "./components/UpdateJob";
import {AllInterviews} from "./components/AllInterviews";
import {Profile} from "./components/Profile";
// import {WeedList} from "./components/WeedList";


// NOTE WE ARE GOING TO BE CHANGING TO A CRAFT BEER MODEL FOR THE PUBLIC

//scan QR code so people can easily put weed on app

const App = () => {

    const location = useLocation();
    const isLoginPage = location.pathname === "/";
    const isRegiesterPage = location.pathname === "/register";

// Assuming userId is obtained from some source and could be a number or undefined

    const userId: number | undefined = undefined;
    const userIdString: string = (userId as number | undefined)?.toString() || '';

    const navigate = useNavigate();

    useEffect(() => {
        const user = AuthService.getCurrentUser();

        // If the user is already logged in and is on login or register page,
        // redirect them to the home page with their user ID if it's necessary.
        if (user && (location.pathname === "/" || location.pathname === "/register")) {
            const userId = user.id; // Assuming the user object has an 'id' field.
            // Replace "/home/:id" with "/home" if the user ID is not required in the route.
            navigate(`/home/${userId}`);
        }
    }, [navigate, location.pathname]);


    function isAuthenticated() {
        // Check if the current page is the login or register page
        if (isLoginPage || isRegiesterPage) {
            // Do not perform the authentication check
            return true;
        }

        // Perform the authentication check for other pages
        const user = AuthService.getCurrentUser();

        if (user === null) {
            // Show an alert
            alert("You need to login. Redirecting you to the login page in 2 seconds.");

            // Wait for 5 seconds before redirecting
            setTimeout(() => {
                window.location.href = "/";
            }, 10); // 5000 milliseconds = 5 seconds

            return false;
        }

        return true;
    }




    return (
        <UserContextProvider>
            <JobsContextProvider userid={userIdString}>
                {!isLoginPage && !isRegiesterPage && <Header />}
                <div>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        {isAuthenticated() && (
                            <React.Fragment>
                                <Route path="/home/:id" element={<Home />} />
                                <Route path="/profile/:id" element={<Profile />} />
                                <Route path="/jobviewall" element={<JobViewAll />} />
                                <Route path="/interviewsecured/:jobId" element={<InterviewSecured />} />
                                <Route path="/allinterviews" element={<AllInterviews />} />
                                <Route path="/updatejob/:jobId" element={<UpdateJob />} />
                                <Route path={"/dategraphs"} element={<JobsAppliedDateGraph />} />
                                <Route path="/test" element={<Test />} />

                                <Route path="/user" element={<BoardUser />} />
                                <Route path="/mod" element={<BoardModerator />} />
                                <Route path="/admin" element={<BoardAdmin />} />
                            </React.Fragment>
                        )}
                    </Routes>
                </div>
            </JobsContextProvider>
        </UserContextProvider>
    );

};

export default App;
