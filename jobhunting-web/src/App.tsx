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
import {JobsAppliedDateGraph} from "./components/JobsAppliedDateGraph";
import {Header} from "./components/Header";
import {Test} from "./components/Test";
import {UpdateJob} from "./components/UpdateJob";
// import {WeedList} from "./components/WeedList";

// NOTE WE ARE GOING TO BE CHANGING TO A CRAFT BEER MODEL FOR THE PUBLIC

//scan QR code so people can easily put weed on app

const App = () => {


  return (
      <UserContextProvider>
        <JobsContextProvider>
            <Header/>

            <div>
                <Routes>
                    <Route path={"/home/:id"} element={<Home />} />
                    <Route path={"/dategraphs"} element={<JobsAppliedDateGraph />} />

                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile/:id" element={<Profile />} />
                    <Route path="/jobviewall" element={<JobViewAll />} />
                    <Route path="/companynoresponse" element={<CompanyNoResponse />} />
                    <Route path="/interviewsecured/:jobId" element={<InterviewSecured />} />
                    <Route path="/test" element={<Test />} />
                    <Route path="/updatejob/:jobId" element={<UpdateJob />} />



                    <Route path="/user" element={<BoardUser />} />
                    <Route path="/mod" element={<BoardModerator />} />
                    <Route path="/admin" element={<BoardAdmin />} />


                </Routes>
            </div>

        {/*still need to put this  nav bar in its own component and out of the APP.tsx*/}

        </JobsContextProvider>

      </UserContextProvider>

  );
};

export default App;
