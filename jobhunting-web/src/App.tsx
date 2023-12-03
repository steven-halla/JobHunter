import React, {useState, useEffect, useContext} from "react";
import { Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AuthService from "./services/auth.service";

import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
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
import {CompanyNoResponse} from "./components/CompanyNoResponse";
import { JobsContextProvider } from "./services/jobcontext";
import {InterviewSecured} from "./components/InterviewSecured";
import {JobsAppliedDateGraph} from "./components/JobsAppliedDateGraph";
import {Header} from "./components/Header";
import {Test} from "./components/Test";
import {UpdateJob} from "./components/UpdateJob";
import {AllInterviews} from "./components/AllInterviews";
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


    function isAuthenticated() {
        // Implement your authentication logic here
        // Example: Check if the user is logged in or has a valid token
        const user = AuthService.getCurrentUser();
        return user !== null;
    }



    return (
      <UserContextProvider>
          <JobsContextProvider userid={userIdString}>
              {!isLoginPage && !isRegiesterPage && <Header />}
              <div>
                  <Routes>
                      <Route path="/" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      {isAuthenticated() ? (
                          <React.Fragment>
                              <Route path="/home/:id" element={<Home />} />
                              <Route path="/profile/:id" element={<Profile />} />
                              <Route path="/user" element={<BoardUser />} />
                              <Route path="/mod" element={<BoardModerator />} />
                              <Route path="/admin" element={<BoardAdmin />} />
                              <Route path="/dategraphs" element={<JobsAppliedDateGraph />} /> {/* Add your route */}
                          </React.Fragment>
                      ) : null


                      }
                  </Routes>
              </div>

        {/*still need to put this  nav bar in its own component and out of the APP.tsx*/}

        </JobsContextProvider>

      </UserContextProvider>

  );
};

export default App;
