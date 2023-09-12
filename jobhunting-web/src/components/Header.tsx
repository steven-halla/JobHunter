import React, {useCallback, useEffect, useRef, useState} from "react";
import {Link, Route, Routes} from "react-router-dom";
import {Home} from "./Home";
import {JobsAppliedDateGraph} from "./JobsAppliedDateGraph";
import Login from "./Login";
import Register from "./Register";
import Profile from "./Profile";
import {JobViewAll} from "./JobViewAll";
import {CompanyNoResponse} from "./CompanyNoResponse";
import {InterviewSecured} from "./InterviewSecured";
import BoardUser from "./BoardUser";
import BoardModerator from "./BoardModerator";
import BoardAdmin from "./BoardAdmin";
import {User} from "../models/User";
import AuthService from "../services/auth.service";
import EventBus from "../common/EventBus";
import styled from "styled-components";


interface DropdownMenuProps {
    isOpen: boolean;
}


export const Header = () => {




    const [showModeratorBoard, setShowModeratorBoard] = useState(false);
    const [showAdminBoard, setShowAdminBoard] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);


    const [isMenuOpen, setMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            closeMenu();
        }
    }, []);



    const closeMenu = () => {
        setMenuOpen(false);
    };


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

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [handleClickOutside]);


    const logOut = () => {
        AuthService.logout();
        setShowModeratorBoard(false);
        setShowAdminBoard(false);
        setCurrentUser(null);
    };

    return (
        <HeaderDiv>
            <nav>
                <Link to={"/home/:id"} onClick={closeMenu}>Job Hunter</Link>


                {currentUser ? (
                    <UserDisplay onClick={toggleMenu}>
                        <span>{currentUser.username}</span>
                        <Caret>^</Caret>
                    </UserDisplay>
                ) : (
                    <>
                        <li><Link to={"/login"}>Login</Link></li>
                        <li><Link to={"/register"}>Sign Up</Link></li>
                    </>
                )}
            </nav>

            {isMenuOpen && currentUser && (
                <DropdownMenu isOpen={isMenuOpen} ref={dropdownRef}>
                    {showModeratorBoard && (
                        <li><Link to={"/mod"}>Moderator Board</Link></li>
                    )}
                    {showAdminBoard && (
                        <li><Link to={"/admin"}>Admin Board</Link></li>
                    )}
                    <li><Link to={"/dategraphs"} onClick={closeMenu}>Jobs Graphs</Link></li>
                    <li><Link to={"/companynoresponse"} onClick={closeMenu}>No Response</Link></li>
                    <li><Link to={"/jobviewall"} onClick={closeMenu}>View All Jobs</Link></li>

                    <li><Link to={`/profile/${currentUser.id}`} onClick={closeMenu}>Profile</Link></li>
                    <li><a href="/login" onClick={logOut} >LogOut</a></li>

                </DropdownMenu>

            )}
        </HeaderDiv>
    );


};


export const HeaderDiv = styled.div`
  display: flex;
  background-color: plum;
  width: 100vw;
  height: 7vh;
  align-items: center; /* Vertically aligns items to the center */

  nav {
    display: flex;
    flex-direction: row;
    width: 100%; /* Ensures nav takes up full width of the HeaderDiv */
    justify-content: space-between; /* Distributes items evenly with equal space around them */
    padding: 0 5%; /* Add padding to left and right */

    li {
      margin: 0 15px; /* Provides some spacing between nav items */
      list-style-type: none; /* Removes the bullet points */


    }
  }
`;

// export const HamburgerIcon = styled.span`
//     cursor: pointer;
// `;

export const DropdownMenu = styled.div<DropdownMenuProps>`
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  flex-direction: column;
  gap: 10px;
  position: absolute;
  align-items: end;
  top: 7vh;
  right: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 5px;
  z-index: 2;

  li {
    list-style-type: none; /* Removes the bullet points */


  }
`;


export const UserDisplay = styled.div`
    cursor: pointer;
    display: flex;
    align-items: end;
    gap: 10px;
    position: relative;  // Add this line


  span {
        font-weight: bold;
    }

    &.active > i {
        transform: rotate(180deg);
    }
`;

export const Caret = styled.i`
  transition: transform 0.3s ease;
  transform: rotate(180deg) translateY(+10%);
`;


