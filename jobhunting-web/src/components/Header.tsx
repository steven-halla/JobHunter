import React, {useCallback, useEffect, useRef, useState} from "react";
import {Link, Route, Routes} from "react-router-dom";
import {User} from "../models/User";
import AuthService from "../services/auth.service";
import EventBus from "../common/EventBus";
import styled from "styled-components";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBuilding, faBuildingFlag,
    faCalendar, faCalendarCheck,
    faCalendarDays,
    faCaretDown,
    faCaretUp, faChartArea,
    faChartLine,
    faClipboard, faClipboardCheck, faLandmark, faLandmarkFlag, faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";
import {noResponseJobs} from "../common/ScreenSizes";


interface DropdownMenuProps {
    isOpen: boolean;
}


export const Header = () => {




    const [showModeratorBoard, setShowModeratorBoard] = useState(false);
    const [showAdminBoard, setShowAdminBoard] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);


    const [isMenuOpen, setMenuOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);
    const [graphIconState, setGraphIconState] = useState<boolean>(true);
    const [clipboardIconState, setClipboardIconState] = useState<boolean>(true);
    const [buildingIconState, setBuildingIconState] = useState<boolean>(true);
    const [calendarIconState, setCalendarIconState] = useState<boolean>(true);
    const [landmarkIconState, setLandmarkIconState] = useState<boolean>(true);
    const [logoState, setLogoState] = useState<boolean>(true);

    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };


    const handleJobGraphsClick = () => {
        setLogoState(true);

        setGraphIconState(false);
        console.log("nurgle" + graphIconState)

        setClipboardIconState(true);
        setBuildingIconState(true);
        setCalendarIconState(true);
        setLandmarkIconState(true);


        // ... other logic for when Job Graphs is clicked ...
    };

    const handleJobClipboardClick = () => {
        setLogoState(true);

        setClipboardIconState(false);


        setGraphIconState(true);
        setBuildingIconState(true);
        setCalendarIconState(true);
        setLandmarkIconState(true);


        console.log("nugle" + clipboardIconState)
        // ... other logic for when Job Graphs is clicked ...
    };

    const handleJobBuildingClick = () => {
        setLogoState(true);

        setBuildingIconState(false);

        setClipboardIconState(true);
        setGraphIconState(true);
        setCalendarIconState(true);
        setLandmarkIconState(true);


        console.log("nugle" + clipboardIconState)
        // ... other logic for when Job Graphs is clicked ...
    };

    const handleJobCalendarClick = () => {
        setLogoState(true);

        setCalendarIconState(false);

        setClipboardIconState(true);
        setBuildingIconState(true);
        setGraphIconState(true);
        setLandmarkIconState(true);


        console.log("nugle" + clipboardIconState)
        // ... other logic for when Job Graphs is clicked ...
    };

    const handleJobLandmarkClick = () => {
        setLogoState(true);

        setLandmarkIconState(false);

        setClipboardIconState(true);
        setBuildingIconState(true);
        setGraphIconState(true);
        setCalendarIconState(true);


        console.log("nurgle" + clipboardIconState)
        // ... other logic for when Job Graphs is clicked ...
    };


    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            closeMenu();
        }
    }, []);



    const closeMenu = () => {

        setLogoState(false);
        setMenuOpen(false);
        setCalendarIconState(true);

        setClipboardIconState(true);
        setBuildingIconState(true);
        setGraphIconState(true);
        setLandmarkIconState(true);
    };


    useEffect(() => {
        const user = AuthService.getCurrentUser();

        const callback = () => {
            console.log("Hi im the callback");
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
                <LogoDiv>
                    <h3>
                        <LogoLink to={`/home/${currentUser?.id}`} onClick={closeMenu}
                                  style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      // textDecoration: graphIconState ? 'none' : 'underline',
                                      borderBottom: logoState ? 'none' : '3px solid', // Thicker underline
                                      // paddingBottom: graphIconState ? '0' : '3px', // Add padding to space out the underline
                                  }}    >
                            JH
                        </LogoLink>
                    </h3>
                </LogoDiv>

                {currentUser ? (
                        <IconContainer>


                            <IconWrapper>
                                <Link
                                    to="/dategraphs" // Use the "to" prop of Link to specify the URL
                                    onClick={handleJobGraphsClick} // Call your function
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        // textDecoration: graphIconState ? 'none' : 'underline',
                                        borderBottom: graphIconState ? 'none' : '3px solid', // Thicker underline
                                        // paddingBottom: graphIconState ? '0' : '3px', // Add padding to space out the underline
                                    }}                              >
                                    <FontAwesomeIcon icon={graphIconState ? faChartLine : faChartArea} size="lg" />
                                    <span>Job Graphs</span>
                                </Link>
                            </IconWrapper>


                            <IconWrapper>
                                    <Link
                                        to="/companynoresponse"
                                        onClick={handleJobClipboardClick}
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                            // textDecoration: graphIconState ? 'none' : 'underline',
                                            borderBottom: clipboardIconState ? 'none' : '3px solid', // Thicker underline
                                            // paddingBottom: graphIconState ? '0' : '3px', // Add padding to space out the underline
                                        }}                                         >
                                        <FontAwesomeIcon icon={clipboardIconState ?  faClipboard : faClipboardCheck} size="lg" />
                                        <span>Older Jobs</span>

                                    </Link>
                            </IconWrapper>

                            <IconWrapper>
                                <Link
                                    to="/jobviewall"
                                    onClick={handleJobBuildingClick}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        // textDecoration: graphIconState ? 'none' : 'underline',
                                        borderBottom: buildingIconState ? 'none' : '3px solid', // Thicker underline
                                        // paddingBottom: graphIconState ? '0' : '3px', // Add padding to space out the underline
                                    }}
                                >
                                    <FontAwesomeIcon icon={buildingIconState ?  faBuilding : faBuildingFlag} size="lg"
                                                     transform={buildingIconState ? undefined : { flipX: true }}
                                    />
                                    <span>Recent Jobs</span>

                                </Link>
                            </IconWrapper>


                            <IconWrapper>
                                <Link
                                    to="/allinterviews"
                                    onClick={handleJobCalendarClick}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        // textDecoration: graphIconState ? 'none' : 'underline',
                                        borderBottom: calendarIconState ? 'none' : '3px solid', // Thicker underline
                                        // paddingBottom: graphIconState ? '0' : '3px', // Add padding to space out the underline
                                    }}
                                >
                                    <FontAwesomeIcon icon={calendarIconState ?  faCalendarDays : faCalendarCheck} size="lg"
                                    />
                                    <span>Interviews</span>

                                </Link>
                            </IconWrapper>


                            <IconWrapper>
                                <Link
                                    to={`/profile/${currentUser.id}`}
                                    onClick={handleJobLandmarkClick}
                                    style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        // textDecoration: graphIconState ? 'none' : 'underline',
                                        borderBottom: landmarkIconState ? 'none' : '3px solid', // Thicker underline
                                        // paddingBottom: graphIconState ? '0' : '3px', // Add padding to space out the underline
                                    }}
                                >
                                    <FontAwesomeIcon icon={landmarkIconState ?  faLandmark : faLandmarkFlag} size="lg"
                                    />
                                    <span>Profile</span>

                                </Link>
                            </IconWrapper>









                            <a href="/login" onClick={logOut} style={{ textDecoration: 'none' }}>
                                <FontAwesomeIcon icon={faSignOutAlt} size="lg" /> Logout
                            </a>


                            {/*<UserDisplay onClick={toggleMenu}>*/}
                            {/*    <span>{currentUser.username}</span>*/}
                            {/*    <FontAwesomeIcon icon={faCaretDown} size="lg" />*/}
                            {/*</UserDisplay>*/}
                        </IconContainer>




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
                    <li><Link to={"/allinterviews"} onClick={closeMenu}>Interview Calandar</Link></li>

                    <li><Link to={`/profile/${currentUser.id}`} onClick={closeMenu}>Profile</Link></li>
                    <li><a href="/login" onClick={logOut} >LogOut</a></li>

                </DropdownMenu>

            )}
        </HeaderDiv>
    );


};






export const HeaderDiv = styled.div`
  display: flex;
  background-color: #adc1ff;
  width: 100vw;
  height: 8.5vh;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 6;
  min-height: 50px;

  nav {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between; /* Distributes items evenly with equal space around them */
    padding: 0 5%;
    align-items: center; /* Vertically center the items within the nav */
  }

  @media ${noResponseJobs.mobile} {
    padding-right: 13%;
  }
`;


export const DropdownMenu = styled.div<DropdownMenuProps>`
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  flex-direction: column;
  gap: 10px;
  position: absolute;
  align-items: flex-end; /* Align menu items to the right */
  top: 7vh;
  right: 10px;
  //background-color: #f9f9f9;
  background-color: purple;
  border: 1px solid #ccc;
  border-radius: 5px;
  z-index: 2;
`;

export const UserDisplay = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  span {
    font-weight: bold;
  }
`;

export const IconContainer = styled.div`
  display: flex;
  justify-content: space-between; /* Space elements evenly */
  align-items: center; /* Center child items vertically */
  gap: 10px;
  flex-grow: 3; /* Allow the container to grow and take up available space */
  margin-left: 15%;
`;


export const IconWrapper = styled.div`
  display: flex;
  grid-template-columns: 1fr; /* Forces columns */
  align-items: center;
  text-align: center;
  gap: 5px;
  flex-direction: column;

  a {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 5px;

    &:hover {
      text-decoration: none; // Removes underline on hover

      // Change color of SVG and text on hover
      svg, span {
        color: #0056b3; // Adjust the color as needed
      }
    }

    //svg:hover {
    //  color: #0056b3; // Example darker shade, adjust the color as needed
    //}
    //
    //span:hover {
    //  color: #0056b3; // Example darker shade, adjust the color as needed
    //
    //}
    
  }

  svg {
    color: #007bff;
  }

  span {
    font-size: 0.8rem;
  }

  @media ${noResponseJobs.mobile} {
    margin-bottom: 3%;
  }
`;


const LogoLink = styled(Link)`
  font-family: 'Papyrus, sans-serif';
  //margin-bottom: 8%;
  padding-bottom: 4%;
`;

export const LogoDiv = styled.div`
  display: flex;
  height: 5vh;
  width: 3vw;
  justify-content: center;
  margin-bottom: 0.7%;

  a {
    // Apply your base styles to LogoLink here if needed

    // Apply hover styles
    &:hover {
      text-decoration: none; // Removes underline on hover
      color: #0056b3; // Change color on hover
    }
  }

  @media ${noResponseJobs.mobile} {
    margin-bottom: 3%;
  }

`;
