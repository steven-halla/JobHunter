import React, {useCallback, useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import {User} from "../models/User";
import AuthService from "../services/auth.service";
import EventBus from "../common/EventBus";
import styled from "styled-components";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBuilding, faBuildingFlag,
     faCalendarCheck,
    faCalendarDays,
    faChartArea,
    faChartLine,
    faClipboard, faClipboardCheck, faLandmark, faLandmarkFlag
} from "@fortawesome/free-solid-svg-icons";
import {noResponseJobs} from "../common/ScreenSizes";
import {colors, fonts} from "../common/CommonStyles";

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

    useEffect(() => {
        console.log(logoState);
        setLogoState(false);
    }, []);

    const handleJobGraphsClick = () => {
        setLogoState(true);
        setGraphIconState(false);
        setClipboardIconState(true);
        setBuildingIconState(true);
        setCalendarIconState(true);
        setLandmarkIconState(true);
    };

    const handleJobClipboardClick = () => {
        setLogoState(true);
        setClipboardIconState(false);
        setGraphIconState(true);
        setBuildingIconState(true);
        setCalendarIconState(true);
        setLandmarkIconState(true);
    };

    const handleJobBuildingClick = () => {
        setLogoState(true);
        setBuildingIconState(false);
        setClipboardIconState(true);
        setGraphIconState(true);
        setCalendarIconState(true);
        setLandmarkIconState(true);
    };

    const handleJobCalendarClick = () => {
        setLogoState(true);
        setCalendarIconState(false);
        setClipboardIconState(true);
        setBuildingIconState(true);
        setGraphIconState(true);
        setLandmarkIconState(true);
    };

    const handleJobLandmarkClick = () => {
        setLogoState(true);
        setLandmarkIconState(false);
        setClipboardIconState(true);
        setBuildingIconState(true);
        setGraphIconState(true);
        setCalendarIconState(true);
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

    const logOut = () => {
        AuthService.logout();
        setShowModeratorBoard(false);
        setShowAdminBoard(false);
        setCurrentUser(null);
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

    return (
        <HeaderDiv>
            <nav>
                {currentUser ? (
                        <IconContainer>
                            <IconWrapper>
                                    <Link
                                        onMouseEnter={(e) =>
                                            e.currentTarget.style.transform = 'scale(1.10)'}
                                        onMouseLeave={(e) =>
                                            e.currentTarget.style.transform = 'scale(1)'}
                                        to={`/home/${currentUser?.id}`}
                                        onClick={handleJobClipboardClick}
                                        style={{
                                            color: colors.IconColor,
                                            display: "flex",
                                            flexDirection: "column",
                                            borderBottom: clipboardIconState ? 'none' : '3px solid',
                                        }}                                         >
                                        <FontAwesomeIcon
                                            style={{
                                                cursor: 'pointer',
                                                transform: 'scale(1)',
                                                transition: 'transform 0.2s',
                                                color: colors.IconColor,
                                        }}
                                            icon={clipboardIconState ?  faClipboard : faClipboardCheck} size="lg"
                                            onMouseEnter={(e) =>
                                                e.currentTarget.style.transform = 'scale(1.10)'}
                                            onMouseLeave={(e) =>
                                                e.currentTarget.style.transform = 'scale(1)'}
                                        />
                                        <span>Create Jobs</span>
                                    </Link>
                            </IconWrapper>

                            <IconWrapper>
                                <Link
                                    to="/dategraphs"
                                    onClick={handleJobGraphsClick}
                                    onMouseEnter={(e) =>
                                        e.currentTarget.style.transform = 'scale(1.10)'}
                                    onMouseLeave={(e) =>
                                        e.currentTarget.style.transform = 'scale(1)'}
                                    style={{
                                        color: colors.IconColor,
                                        display: "flex",
                                        flexDirection: "column",
                                        borderBottom: graphIconState ? 'none' : '3px solid',
                                    }}                              >
                                    <FontAwesomeIcon
                                        style={{
                                            cursor: 'pointer',
                                            transform: 'scale(1)',
                                            transition: 'transform 0.2s',
                                            color: colors.IconColor,
                                    }}
                                        onMouseEnter={(e) =>
                                            e.currentTarget.style.transform = 'scale(1.10)'}
                                        onMouseLeave={(e) =>
                                            e.currentTarget.style.transform = 'scale(1)'}
                                        icon={graphIconState ? faChartLine : faChartArea} size="lg" />
                                    <span>Job Graphs</span>
                                </Link>
                            </IconWrapper>

                            <IconWrapper>
                                <Link
                                    to="/jobviewall"
                                    onClick={handleJobBuildingClick}
                                    style={{
                                        color: colors.IconColor,
                                        display: "flex",
                                        flexDirection: "column",
                                        borderBottom: buildingIconState ? 'none' : '3px solid',
                                    }}
                                    onMouseEnter={(e) =>
                                        e.currentTarget.style.transform = 'scale(1.10)'}
                                    onMouseLeave={(e) =>
                                        e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    <FontAwesomeIcon
                                        style={{
                                            cursor: 'pointer',
                                            transform: 'scale(1)',
                                            transition: 'transform 0.2s',
                                            color: colors.IconColor,

                                    }}
                                        onMouseEnter={(e) =>
                                            e.currentTarget.style.transform = 'scale(1.10)'}
                                        onMouseLeave={(e) =>
                                            e.currentTarget.style.transform = 'scale(1)'}
                                        icon={buildingIconState ?  faBuilding : faBuildingFlag} size="lg"
                                                     transform={buildingIconState ? undefined : { flipX: true }}
                                    />
                                    <span>All Jobs</span>
                                </Link>
                            </IconWrapper>

                            <IconWrapper>
                                <Link
                                    to="/allinterviews"
                                    onClick={handleJobCalendarClick}
                                    style={{
                                        color: colors.IconColor,
                                        display: "flex",
                                        flexDirection: "column",
                                        borderBottom: calendarIconState ? 'none' : '3px solid',
                                    }}
                                    onMouseEnter={(e) =>
                                        e.currentTarget.style.transform = 'scale(1.10)'}
                                    onMouseLeave={(e) =>
                                        e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    <FontAwesomeIcon
                                        style={{
                                            cursor: 'pointer',
                                            transform: 'scale(1)',
                                            transition: 'transform 0.2s',
                                            color: colors.IconColor,
                                    }}
                                        onMouseEnter={(e) =>
                                            e.currentTarget.style.transform = 'scale(1.10)'}
                                        onMouseLeave={(e) =>
                                            e.currentTarget.style.transform = 'scale(1)'}
                                        icon={calendarIconState ?  faCalendarDays : faCalendarCheck} size="lg"
                                    />
                                    <span>Interviews</span>
                                </Link>
                            </IconWrapper>

                            <IconWrapper>
                                <Link
                                    to={`/profile/${currentUser.id}`}
                                    onClick={handleJobLandmarkClick}
                                    style={{
                                        color: "#3D4849",
                                        display: "flex",
                                        flexDirection: "column",
                                        borderBottom: landmarkIconState ? 'none' : '3px solid',
                                    }}
                                    onMouseEnter={(e) =>
                                        e.currentTarget.style.transform = 'scale(1.10)'}
                                    onMouseLeave={(e) =>
                                        e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    <FontAwesomeIcon
                                        style={{
                                            cursor: 'pointer',
                                            transform: 'scale(1)',
                                            transition: 'transform 0.2s',
                                            color: colors.IconColor,
                                    }}
                                        onMouseEnter={(e) =>
                                            e.currentTarget.style.transform = 'scale(1.10)'}
                                        onMouseLeave={(e) =>
                                            e.currentTarget.style.transform = 'scale(1)'}
                                        icon={landmarkIconState ?  faLandmark : faLandmarkFlag} size="lg"
                                    />
                                    <span>Profile</span>
                                </Link>
                            </IconWrapper>
                        </IconContainer>
                ) : null}
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
  background-color: ${colors.HeaderBackGroundColor};
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
    justify-content: space-between; 
    padding: 0 5%;
    align-items: center; 
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
  align-items: flex-end; 
  top: 7vh;
  right: 10px;
  background-color: purple;
  border: 1px solid #ccc;
  border-radius: 5px;
  z-index: 2;
`;

export const IconContainer = styled.div`
  display: flex;
  justify-content: space-between; 
  align-items: center; 
  gap: 10px;
  flex-grow: 3; 
`;


export const IconWrapper = styled.div`
  display: flex;
  grid-template-columns: 1fr; 
  align-items: center;
  text-align: center;
  gap: 5px;
  flex-direction: row;
  
  a {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 5px;

    &:hover {
      text-decoration: none;
    }
  }
  
  span {
    font-size: ${fonts.HeaderIconTextREM};
  }

  @media ${noResponseJobs.mobile} {
    margin-right: 7%;
    
    span {
      font-size: ${fonts.MobileHeaderIconTextREM};
    }
  }
`;





