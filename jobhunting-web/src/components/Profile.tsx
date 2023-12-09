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
        } else if (name === 'customfield2') {
            setCustomField2(value);
        } else if (name === 'customfield3') {
            setCustomField3(value);
        } else if (name === 'lifestory') { // Use "lifestory" here to match the JSON
            setLifeStory(value);
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
                        }} // Set the icon color to light blue

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
                                style={{ cursor: 'pointer', marginTop: '10%' }}
                            />

                            <FontAwesomeIcon
                                icon={faLinkedin}
                                size="2x"
                                style={{ cursor: 'pointer' }}
                            />

                            <FontAwesomeIcon
                                icon={faBriefcase}
                                size="2x"
                                style={{ cursor: 'pointer', marginBottom: "10%" }}
                            />
                        </IconDiv>


                        <StyledForm ref={formRef} onSubmit={handleSubmit}>
                                        <StyledTextField name="customfield1" value={customfield1} onChange={handleChange} />
                            <StyledTextField name="customfield2" value={customfield2} onChange={handleChange} />
                            <StyledTextField name="customfield3" value={customfield3} onChange={handleChange} />






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


                </LifeStoryDiv>

                <SubmitButtonDiv>
                    <SubmitButton
                        sx={{
                            borderRadius: 10,
                            background: 'linear-gradient(to right, #00C9FF, #00B4D8)', // Neon blue gradient
                            color: colors.TextWhiteColor,

                            border: '1px solid #007BFF', // Adding a border for contrast
                            '&:hover': {
                                background: 'linear-gradient(to left, #00C9FF, #00B4D8)', // Change gradient direction on hover for effect
                                boxShadow: '0 0 10px #00C9FF', // Optional: Adding a glow effect on hover
                            },
                            // fontSize: '1.6rem',
                            fontSize: fonts.ButtonFontREM,

                            fontWeight: 'bold',

                            // fontFamily: "'Times New Roman', serif",
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

const Footer = styled.div`
height: 50px;
  width: 100%;
  //background-color: #3D4849;
  background-color: ${colors.AppBackGroundColor};


`;


const SubmitButton = styled(Button)`
  height: 9vh;
  width: 23vw;
  display: flex;
  padding-bottom: 70px;
  //margin-bottom: 50px;
  //background-color: yellow;

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
`;

const StyledTextField = styled(TextField)`
  width: 100%; // Ensures it takes up the full width of its parent
  box-sizing: border-box; // This ensures padding and borders are included in the width
  //background-color: white;
  background-color: ${colors.TextWhiteColor};

  // Add other styles as needed
  & .MuiInputBase-input { // Target the placeholder with increased specificity
    //font-family: 'Roboto', sans-serif;
    font-family: ${fonts.InputFontFamily};
    font-size:  ${fonts.InputFontREM};

    //font-size: 1.13rem;
    //background-color: red;
  }
`;




const NameDiv = styled.div`
  display: flex;
  

  //background-color: #3D4849;
  //background-color: blue;
  height: 20%;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin-top: 3%;  
  strong {
  color: ${colors.TextBlackColor};

    //color: black;
    //  font-family: 'Roboto', sans-serif;
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
`;

const LifeStoryDiv = styled.div`
  display: flex;
  flex-direction: column;
  //height: 40vh;
  width: 100%;
  justify-content: center;
  align-items: center;
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
  // Add other properties as needed
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
const InputWithIcon = styled.div`
  display: flex;
  align-items: center; // Center the items vertically
  margin-bottom: 10px; // Add some spacing between inputs

  // Add styles for the icon
  & > svg {
    margin-right: 10px; // Add spacing between icon and input
  }
`;

//
// const InfoContainerDiv = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
//   margin-top: 5%;
//   background-color: #c7f3ff;
//   padding: 20px; // Add some padding for spacing
//   box-shadow: 10px 10px 15px -5px rgba(0, 0, 0, 0.3),
//   -10px 10px 15px -5px rgba(0, 0, 0, 0.3);
//
//   @media ${deviceProfile.mobile} {
//     width: 300px; // Adjust width for mobile
//   }
// `;
//
//
const StyledTextareaAutosize = styled(TextareaAutosize)`
  // Add more styles here
  border: 1px solid #ccc; // Example style
  padding: 8px; // Example style
  border-radius: 4px; // Example style
  width: 670px;
  margin-top: 5%;
  font-family: 'Open Sans', sans-serif;
font-size: 1.2rem;
  


  // You can also add media queries for responsive design
  @media ${deviceProfile.mobile} {
    // Styles for laptop and larger devices
    width: 300px;
  }
  
`;




export default Profile;

