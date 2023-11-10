import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../services/usercontext';
import UserService from '../services/user.service';
import styled from "styled-components";

const Profile = () => {
    const { id } = useParams<{ id: string }>();
    const { user, setUser, lifeStory, setLifeStory, customfield1, setCustomField1, customfield2, setCustomField2, customfield3, setCustomField3 } = useContext(UserContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = Number(id);
        if (!isNaN(userId)) {
            setLoading(true);
            UserService.getUserById(userId)
                .then((fetchedUser) => {
                    setUser(fetchedUser);
                    setCustomField1(fetchedUser.customfield1);
                    setCustomField2(fetchedUser.customfield2);
                    setCustomField3(fetchedUser.customfield3);
                    // Update lifestory state here
                    setLifeStory(fetchedUser.lifeStory); // Ensure this line sets lifestory correctly
                    console.log("hi there lifestory", fetchedUser.lifeStory);
                    console.log("fetchedUser:", fetchedUser);

                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching user by id:', error);
                    setLoading(false);
                });
        } else {
            console.error('Error: id is not a number');
        }
    }, [id, setUser, setCustomField1, setCustomField2, setCustomField3, setLifeStory]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'customfield1') {
            setCustomField1(value);
        } else if (name === 'customfield2') {
            setCustomField2(value);
        } else if (name === 'customfield3') {
            setCustomField3(value);
        }
        else if (name === 'lifestory') {
            setLifeStory(value);
        }

    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Handled submit");
        try {
            if (user && user.id) { // Check if user and user.id are not undefined
                const response = await fetch(`http://localhost:8080/api/users/updateuser/${user.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        customfield1: customfield1,
                        customfield2: customfield2,
                        customfield3: customfield3,
                        lifeStory: lifeStory,
                    }),
                });
                if (response.ok) {
                    setUser({
                        ...user,
                        customfield1,
                        customfield2,
                        customfield3,
                    });
                    setCustomField1(customfield1);
                    setCustomField2(customfield2);
                    setCustomField3(customfield3);
                    setLifeStory(lifeStory);
                    alert("User updated successfully");
                } else {
                    console.error("Failed to update job interview");
                }
            }
        } catch (error) {
            console.error("Failed to update job interview:", error);
        }
    };
    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <ProfileWrapperDiv>
            <InfoContainerDiv>
                <UserNameDiv>
                    User Name:   <strong>{user?.username}</strong>  <br/>
                    User Name:   <strong>{user?.lifeStory}</strong>  <br/>
                </UserNameDiv>
                <StyledForm onSubmit={handleSubmit}>
                    <p>
                        <StyledStrong>Github:</StyledStrong>
                        <input type="text" name="customfield1" value={customfield1} onChange={handleChange} />
                    </p>
                    <p>
                        <StyledStrong>Linkedin:</StyledStrong>
                        <input type="text" name="customfield2" value={customfield2} onChange={handleChange} />
                    </p>
                    <p>
                        <StyledStrong>Portfolio:</StyledStrong>
                        <input type="text" name="customfield3" value={customfield3} onChange={handleChange} />
                    </p>

                    <button type="submit">Update</button>
                </StyledForm>
            </InfoContainerDiv>

        </ProfileWrapperDiv>
    );
};

export const StyledStrong = styled.strong`
  display: flex;

`;
export const UserNameDiv = styled.div`
  display: flex;
  justify-content: center;
  //align-items: center;
  //height: 20vh;
  margin-right: 2%;
`;

export const ProfileWrapperDiv = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  //background-color: #586e75; /* A blue-gray hue, reminiscent of slate */
  //background-color: #30475E; /* A deep, muted blue with a hint of gray */
  background-color: #496D89; /* A lighter shade of the deep, muted blue with a hint of gray */

`;

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  //height: 40vh;
  //width: 100vw;
  justify-content: center;
  align-items: center;
`;

const InfoContainerDiv = styled.div`
  background-color: #c7f3ff;
  width: 30vw;
  height: 45vh;
  justify-content: center;
  align-items: center;
  //margin-top: 15%;
  padding-top:  2.5%;

  // Adding shadows to the bottom left and right
  box-shadow:
          10px 10px 15px -5px rgba(0, 0, 0, 0.3), // Shadow for the bottom right
          -10px 10px 15px -5px rgba(0, 0, 0, 0.3); // Shadow for the bottom left
`;


export default Profile;

