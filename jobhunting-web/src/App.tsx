import React, { useState, useEffect } from "react";
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

// import AuthVerify from "./common/AuthVerify";
import EventBus from "./common/EventBus";

import {User} from "./models/User";
import {UserContextProvider} from "./services/usercontext";
import {Home} from "./components/Home";
import {JobViewAll} from "./components/JobViewAll";
import {CompanyNoResponse} from "./components/CompanyNoResponse";
import { JobsContextProvider } from "./services/jobcontext";
import {InterviewSecured} from "./components/InterviewSecured";
// import {WeedList} from "./components/WeedList";

// NOTE WE ARE GOING TO BE CHANGING TO A CRAFT BEER MODEL FOR THE PUBLIC

//scan QR code so people can easily put weed on app

const App = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    const callback = () => {
      console.log("Hi");
    };

    if (user) {
      setCurrentUser(user);
      setShowModeratorBoard(user.roles.includes("ROLE_MODERATOR"));
      setShowAdminBoard(user.roles.includes("ROLE_ADMIN"));
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout", callback);
    };
  }, []);

  const logOut = () => {
    AuthService.logout();
    setShowModeratorBoard(false);
    setShowAdminBoard(false);
    setCurrentUser(null);
  };

  return (
      <UserContextProvider>
        <JobsContextProvider>


    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link to={"/home"} className="navbar-brand">
          Job Hunter
        </Link>
        <div className="navbar-nav mr-auto">

          {showModeratorBoard && (
            <li className="nav-item">
              <Link to={"/mod"} className="nav-link">
                Moderator Board
              </Link>
            </li>
          )}

          {showAdminBoard && (
            <li className="nav-item">
              <Link to={"/admin"} className="nav-link">
                Admin Board
              </Link>
            </li>
          )}


        </div>

        {currentUser ? (
          <div className="navbar-nav ml-auto">
            {/*<li className="nav-item">*/}
            {/*  <Link to={"/profile"} className="nav-link">*/}
            {/*    {currentUser.username}*/}
            {/*  </Link>*/}
            {/*</li>*/}
              <li className="nav-item">
                  <Link to={"/jobviewall"} className="nav-link">
                      Job Creation
                  </Link>
              </li>
            <li className="nav-item">
              <a href="/login" className="nav-link" onClick={logOut}>
                LogOut
              </a>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            </li>

            <li className="nav-item">
              <Link to={"/register"} className="nav-link">
                Sign Up
              </Link>
            </li>
          </div>
        )}
      </nav>

      <div>
        <Routes>
            <Route path={"/Home"} element={<Home />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile/:id" element={<Profile />} />
            <Route path="/jobviewall" element={<JobViewAll />} />
            <Route path="/companynoresponse" element={<CompanyNoResponse />} />
            <Route path="/interviewsecured/:jobId" element={<InterviewSecured />} /> // change this line



            <Route path="/user" element={<BoardUser />} />
            <Route path="/mod" element={<BoardModerator />} />
            <Route path="/admin" element={<BoardAdmin />} />


        </Routes>
      </div>

      {/* <AuthVerify logOut={logOut}/> */}
    </div>
        </JobsContextProvider>

      </UserContextProvider>

  );
};

export default App;
