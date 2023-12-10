import React, {useContext, useState, useEffect, useRef} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import { UserContext } from '../services/usercontext';
import UserService from '../services/user.service';
import styled from "styled-components";
import TextareaAutosize from '@mui/material/TextareaAutosize';
import {deviceCalendar, deviceHome, deviceProfile} from "../common/ScreenSizes";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithub, faLinkedin} from "@fortawesome/free-brands-svg-icons";
import {faBriefcase, faSignOutAlt} from "@fortawesome/free-solid-svg-icons";
import {TextField} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AuthService from "../services/auth.service";
import {User} from "../models/User";
import {colors, fonts} from "../common/CommonStyles";
// import { jwtDecode, InvalidTokenError } from 'jwt-decode';


const Profile = () => {
    const { id } = useParams<{ id: string }>();
    const { user, setUser, lifeStory, setLifeStory, customfield1, setCustomField1, customfield2, setCustomField2, customfield3, setCustomField3 } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const isMountedRef = useRef(true);


    const navigate = useNavigate();

    useEffect(() => {
        console.log("am I being user id?" + id)

        if (user && user.id && id !== user.id.toString()) {
            alert("You are not authorized to be here")

            // Redirect to an unauthorized page or handle unauthorized access
            AuthService.logout();

            navigate('/');
        }
    }, [id, user, navigate]);


    useEffect(() => {
        console.log("your id is" + id);

        const userId = Number(id);
        if (!isNaN(userId)) {
            setLoading(true);
            UserService.getUserById(userId)
                .then((fetchedUser) => {
                    if (isMountedRef.current) { // Check if component is still mounted
                        setUser(fetchedUser);
                        setCustomField1(fetchedUser.customfield1);
                        setCustomField2(fetchedUser.customfield2);
                        setCustomField3(fetchedUser.customfield3);
                        setLifeStory(fetchedUser.lifeStory);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching user by id:', error);
                })
                .finally(() => {
                    if (isMountedRef.current) {
                        setLoading(false);
                    }
                });
        } else {
            console.error('Error: id is not a number');
        }

        return () => {
            isMountedRef.current = false; // Set the flag to false when the component unmounts
        };
    }, [id, setUser, setCustomField1, setCustomField2, setCustomField3, setLifeStory]);


    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'customfield1') {
            setCustomField1(value);
            if (value.length > 333) {
                setCustomField1Error("You exceeded 333 character limit");
            } else {
                setCustomField1Error(null);
            }
        } else if (name === 'customfield2') {
            setCustomField2(value);
            if (value.length > 333) {
                setCustomField2Error("You exceeded 333 character limit");
            } else {
                setCustomField2Error(null);
            }
        } else if (name === 'customfield3') {
            setCustomField3(value);
            if (value.length > 333) {
                setCustomField3Error("You exceeded 333 character limit");
            } else {
                setCustomField3Error(null);
            }
        } else   if (name === 'lifestory') {
            setLifeStory(value);
            if (value.length > 5000) {
                setLifeStoryError("Life story cannot exceed 5000 characters");
            } else {
                setLifeStoryError(null);
            }
        }

    };




    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        console.log("im submitted")
        e.preventDefault();
        console.log("Handled submit");
        try {
            if (user && user.id) {
                const requestBody = {
                    customFields: {
                        customfield1,
                        customfield2,
                        customfield3,
                    },
                    lifestory: lifeStory, // Ensure "lifestory" matches your JSON data
                };

                const response = await fetch(`http://localhost:8080/api/users/updateuser/${user.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                });

                if (response.ok) {
                    const updatedUserData = {
                        ...user,
                        customFields: requestBody.customFields,
                        lifestory: requestBody.lifestory, // Ensure "lifestory" matches your JSON data
                    };

                    setUser(updatedUserData);
                    setCustomField1(customfield1);
                    setCustomField2(customfield2);
                    setCustomField3(customfield3);
                    setLifeStory(lifeStory);
                    alert("User updated successfully");
                } else {
                    console.error("Failed to update user");
                }
            }
        } catch (error) {
            console.error("Failed to update user:", error);
        }
    };


    const [isMobile, setIsMobile] = useState(window.matchMedia(deviceProfile.mobile).matches);
    const [isLaptop, setIsLaptop] = useState(window.matchMedia(deviceProfile.laptop).matches);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.matchMedia(deviceProfile.mobile).matches);
            setIsLaptop(window.matchMedia(deviceProfile.laptop).matches);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);


    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmitButton = () => {
        console.log("Submit button clicked");
        if (formRef.current) {
            formRef.current.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        }
    };


    const [showModeratorBoard, setShowModeratorBoard] = useState(false);
    const [showAdminBoard, setShowAdminBoard] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    const logOut = () => {
        AuthService.logout();
        setShowModeratorBoard(false);
        setShowAdminBoard(false);
        setCurrentUser(null);
    };

    const [customField1Error, setCustomField1Error] = useState<string | null>(null);
    const [customField2Error, setCustomField2Error] = useState<string | null>(null);
    const [customField3Error, setCustomField3Error] = useState<string | null>(null);

    const [lifeStoryError, setLifeStoryError] = useState<string | null>(null);


    return (
        <ProfileWrapperDiv>



            <InfoContainerDiv>

                <NameDiv>
                    <strong>Hello Their {user?.username}</strong>
                    <a href="/" onClick={logOut} style={{
                        textDecoration: 'none' ,
                        color: colors.TextWhiteColor,
                        fontSize: fonts.InputFontREM,

                        marginLeft: "3%"
                    }}>
                        <FontAwesomeIcon
                            style={{
                                color: colors.TextWhiteColor,
                        }}
                            icon={faSignOutAlt} size="lg" /> Logout
                    </a>
                </NameDiv>
                <Box
                    sx={{
                        display: 'flex',
                        height: '300px',
                        width: '55%',
                        marginTop: '5%',
                        flexDirection: 'column',
                        '@media (max-width: 500px)': {
                            width: '70%', // Adjusted width for screens of 500px or smaller
                        },
                    }}
                >
                    <IconFormDiv >
                        <IconDiv>
                            <FontAwesomeIcon
                                icon={faGithub}
                                size="2x"
                                style={{ marginTop: '10%' }}
                            />
                            <FontAwesomeIcon
                                icon={faLinkedin}
                                size="2x"
                            />

                            <FontAwesomeIcon
                                icon={faBriefcase}
                                size="2x"
                                style={{  marginBottom: "10%" }}
                            />
                        </IconDiv>


                        <StyledForm ref={formRef} onSubmit={handleSubmit}>
                            <StyledTextField name="customfield1" value={customfield1} onChange={handleChange} />
                            {customField1Error && <ErrorMessage>{customField1Error}</ErrorMessage>}

                            <StyledTextField name="customfield2" value={customfield2} onChange={handleChange} />
                            {customField2Error && <ErrorMessage>{customField2Error}</ErrorMessage>}

                            <StyledTextField name="customfield3" value={customfield3} onChange={handleChange} />
                            {customField3Error && <ErrorMessage>{customField3Error}</ErrorMessage>}

                        </StyledForm>
                    </IconFormDiv>
                </Box>
                <LifeStoryDiv>
                    <StyledTextareaAutosize
                        name="lifestory"
                        value={lifeStory}
                        onChange={handleChange}
                        placeholder="Enter your life story..."
                        minRows={4} // Adjust the number of rows as needed
                        maxRows={100} // Adjust the maximum number of rows as needed
                    />
                    {lifeStoryError && <ErrorMessage>{lifeStoryError}</ErrorMessage>}

                </LifeStoryDiv>

                <SubmitButtonDiv>
                    <SubmitButton
                        sx={{
                            width: { xs: '100%'}, // 100% width on xs and sm breakpoints, auto on larger screens

                            borderRadius: 10,
                            background: colors.ButtonColor,

                            color: colors.TextWhiteColor,
                            border: '1px solid #007BFF', // Adding a border for contrast
                            '&:hover': {
                                background: colors.HoverButtonColor,
                                boxShadow: '0 0 10px #00C9FF', // Optional: Adding a glow effect on hover
                            },
                            fontSize: fonts.ButtonFontREM,
                            fontWeight: 'bold',
                            fontFamily: fonts.ButtonFontFamily,
                            textTransform: 'none', // Optional: Prevents uppercase text transformation common in MUI Buttons
                        }}
                    onClick={handleSubmitButton} variant="contained">
                        Submit</SubmitButton>
                </SubmitButtonDiv>



                <Footer/>

            </InfoContainerDiv>

        </ProfileWrapperDiv>
    );
};

const ErrorMessage = styled.div`
  //color: ${colors.FormContainer};
  color: orangered;
  font-family: 'Roboto', sans-serif;
  font-size: ${fonts.ButtonFontREM};
`;

const Footer = styled.div`
height: 50px;
  width: 100%;
  background-color: ${colors.AppBackGroundColor};

  @media ${deviceProfile.mobile} {
    height: 200px;
  }
`;


const SubmitButton = styled(Button)`
  height: 9vh;
  width: 23vw;
  display: flex;
  padding-bottom: 70px;


  @media ${deviceHome.mobile} {
    //background-color: red;
    width: 30vw;
    height: 7vh;
  }


`;

const IconFormDiv = styled.div`
height: 100%;
  width: 100%;
  display: flex;
`;

const IconDiv = styled.div`
height: 100%;
  width: 20%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media ${deviceProfile.mobile} {
    margin-right: 5%;
    padding-bottom: 4%;
    padding-top: 4%;
  }
`;

const StyledTextField = styled(TextField)`
  width: 100%; // Ensures it takes up the full width of its parent
  box-sizing: border-box; // This ensures padding and borders are included in the width
  background-color: ${colors.TextWhiteColor};

  & .MuiInputBase-input { // Target the placeholder with increased specificity
    //font-family: 'Roboto', sans-serif;
    font-family: ${fonts.InputFontFamily};
    font-size:  ${fonts.InputFontREM};

  }

  @media ${deviceProfile.mobile} {
    min-width: 200px; // Ensures it takes up the full width of its parent

    & .MuiInputBase-input { // Target the placeholder with increased specificity
      //font-family: 'Roboto', sans-serif;
    //min-width: 200px;
    //  background-color: red;
      min-width: 200px; // Ensures it takes up the full width of its parent
    }
  }
`;


const NameDiv = styled.div`
  display: flex;
  height: 20%;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 2%;  
  strong {
  color: ${colors.TextBlackColor};
    
        font-family: ${fonts.ButtonFontFamily};
        font-size: ${fonts.ButtonFontREM};

    //font-size: 1.4rem;
    
  }
`;

const SubmitButtonDiv = styled.div`
  display: flex;
  height: 10%;
  width: 30%;
  margin-top: 3%;
  @media ${deviceProfile.mobile} {
    width: 80%;
  }
  
`;

const LifeStoryDiv = styled.div`
  display: flex;
  flex-direction: column;
  //height: 40vh;
  width: 100%;
  justify-content: center;
  align-items: center;

  @media ${deviceProfile.mobile} {
    margin-top: 12%;
  }
`;



const ProfileWrapperDiv = styled.div`
  display: flex;
  justify-content: center; // Centers children horizontally
  align-items: center; // Optional, if you want to center vertically as well
  height: 100%;
  width: 100vw;
  background-color: ${colors.AppBackGroundColor};
`;

const InfoContainerDiv = styled.div`
  display: flex;
  height: 100%; // You might want to adjust this depending on your layout needs
  width: 80%; // Or any width you prefer
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const StyledForm = styled.form`
  display: flex;
  height: 100%;
  width: 80%;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  margin-right: 16%;
`;

const StyledTextareaAutosize = styled(TextareaAutosize)`
  border: 1px solid #ccc; // Example style
  padding: 8px; // Example style
  border-radius: 4px; // Example style
  width: 670px;
  margin-top: 5%;
  font-family: ${fonts.InputFontFamily};
  font-size:  ${fonts.InputFontREM};

  @media ${deviceProfile.mobile} {
    width: 300px;
  }
`;




export default Profile;

