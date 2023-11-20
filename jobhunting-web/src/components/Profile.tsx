import React, {useContext, useState, useEffect, useRef} from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../services/usercontext';
import UserService from '../services/user.service';
import styled from "styled-components";
import TextareaAutosize from '@mui/material/TextareaAutosize';
import {deviceCalendar, deviceProfile} from "../common/ScreenSizes";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGithub, faLinkedin} from "@fortawesome/free-brands-svg-icons";
import {faBriefcase} from "@fortawesome/free-solid-svg-icons";
import {TextField} from "@mui/material";
import Box from "@mui/material/Box";


const Profile = () => {
    const { id } = useParams<{ id: string }>();
    const { user, setUser, lifeStory, setLifeStory, customfield1, setCustomField1, customfield2, setCustomField2, customfield3, setCustomField3 } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const isMountedRef = useRef(true);

    useEffect(() => {
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

    return (
        <ProfileWrapperDiv>
            <InfoContainerDiv>




                <NameCustomFieldBox>
                    <NameDiv>
                         <strong>{user?.username}</strong>
                    </NameDiv>


                    <StyledForm onSubmit={handleSubmit}>

                            <FontAwesomeIcon
                                icon={faGithub}
                                size="2x"
                                style={{ cursor: 'pointer' }}
                            />
                            <StyledTextField
                                name="customfield1"
                                value={customfield1}
                                onChange={handleChange}
                                // Add any other props you need
                            />



                            <FontAwesomeIcon
                                icon={faLinkedin}
                                size="2x"
                                style={{ cursor: 'pointer' }}
                            />
                            <StyledTextField
                                name="customfield2"
                                value={customfield2}
                                onChange={handleChange}
                                // Add any other props you need
                            />
                            <FontAwesomeIcon
                                icon={faBriefcase}
                                size="2x"
                                style={{ cursor: 'pointer' }}
                            />
                            <StyledTextField
                                name="customfield3"
                                value={customfield3}
                                onChange={handleChange}
                                // Add any other props you need
                            />
                    </StyledForm>

                </NameCustomFieldBox>

                <LifeStoryDiv>

                </LifeStoryDiv>

                <SubmitButtonDiv>

                </SubmitButtonDiv>

            </InfoContainerDiv>






            {/*<InfoContainerDiv>*/}
            {/*    <UserNameDiv>*/}
            {/*    </UserNameDiv>*/}
            {/*    <StyledForm onSubmit={handleSubmit}>*/}
            {/*        <p>*/}
            {/*            <StyledStrong>Github:</StyledStrong>*/}
            {/*            <TextareaAutosize name="customfield1" value={customfield1} onChange={handleChange} />*/}
            {/*        </p>*/}
            {/*        <p>*/}
            {/*            <StyledStrong>Linkedin:</StyledStrong>*/}
            {/*            <TextareaAutosize  name="customfield2" value={customfield2} onChange={handleChange} />*/}
            {/*        </p>*/}
            {/*        <p>*/}
            {/*            <StyledStrong>Portfolio:</StyledStrong>*/}
            {/*            <TextareaAutosize  name="customfield3" value={customfield3} onChange={handleChange} />*/}
            {/*        </p>*/}

            {/*        <StyledTextareaAutosize*/}
            {/*            name="lifestory"*/}
            {/*            value={lifeStory}*/}
            {/*            onChange={handleChange}*/}
            {/*            placeholder="Enter your life story..."*/}
            {/*        />*/}


            {/*        <button type="submit">Update</button>*/}
            {/*    </StyledForm>*/}
            {/*</InfoContainerDiv>*/}


        </ProfileWrapperDiv>
    );
};

const StyledTextField = styled(TextField)`
  width: 80%; // Ensures it takes up the full width of its parent
  box-sizing: border-box; // This ensures padding and borders are included in the width

  // Add other styles as needed
`;



const NameDiv = styled.div`
  display: flex;

  background-color: cadetblue;
  height: 20%;
  width: 100%;
`;

const SubmitButtonDiv = styled.div`
  display: flex;

  background-color: orangered;
  height: 10%;
  width: 30%;
`;

const LifeStoryDiv = styled.div`
  display: flex;

  background-color: green;
  height: 50%;
  width: 80%;
`;

const NameCustomFieldBox = styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'center', // Centers children horizontally
    alignItems: 'center', // Optional, if you want to center vertically as well
    backgroundColor: 'purple',
    height: '50%',
    width: '60%',
    marginTop: '5%',
    flexDirection: 'column',
}));

const ProfileWrapperDiv = styled.div`
  display: flex;
  justify-content: center; // Centers children horizontally
  align-items: center; // Optional, if you want to center vertically as well
  background-color: red;
  height: 100vh;
  width: 100vw;
`;

const InfoContainerDiv = styled.div`
  display: flex;
  background-color: blue;
  height: 100%; // You might want to adjust this depending on your layout needs
  width: 80%; // Or any width you prefer
  // Add other properties as needed
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

















// export const StyledStrong = styled.strong`
//   display: flex;
//
// `;
// export const UserNameDiv = styled.div`
//   display: flex;
//   //align-items: center;
//   //height: 20vh;
//   margin-right: 2%;
//   background-color: red;
// `;
//
// export const ProfileWrapperDiv = styled.div`
//   display: flex;
//   height: 100vh;
//   width: 100%;
//   justify-content: center;
//   align-items: center;
//   display: flex;
//
//   ////flex-direction: column;
//   //align-items: center;
//   //background-color: #586e75; /* A blue-gray hue, reminiscent of slate */
//   //background-color: #30475E; /* A deep, muted blue with a hint of gray */
//   background-color: #496D89; /* A lighter shade of the deep, muted blue with a hint of gray */
//
// `;
//
 const StyledForm = styled.form`
  display: flex;
  background-color: yellow;
  height: 80%;
   width: 100%;
   flex-direction: column;
   justify-content: center;
   align-items: center;

  //height: 40vh;
  //width: 100vw;

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
// const StyledTextareaAutosize = styled(TextareaAutosize)`
//     // Add more styles here
//     border: 1px solid #ccc; // Example style
//     padding: 8px; // Example style
//     border-radius: 4px; // Example style
//
//
//     // You can also add media queries for responsive design
//   @media ${deviceProfile.mobile} {
//     // Styles for laptop and larger devices
//     width: 400px;
//     margin-top: 45%;
//
//   }
// `;

export default Profile;

