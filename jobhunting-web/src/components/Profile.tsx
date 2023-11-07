import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../services/usercontext';
import UserService from '../services/user.service';
import styled from "styled-components";

const Profile = () => {
    const { id } = useParams<{ id: string }>();
    const { user, setUser, customfield1, setCustomField1, customfield2, setCustomField2, customfield3, setCustomField3 } = useContext(UserContext);
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
                    setLoading(false);
                })
                .catch((error) => {
                    console.error('Error fetching user by id:', error);
                    setLoading(false);
                });
        } else {
            console.error('Error: id is not a number');
        }
    }, [id, setUser]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'customfield1') {
            setCustomField1(value);
        } else if (name === 'customfield2') {
            setCustomField2(value);
        } else if (name === 'customfield3') {
            setCustomField3(value);
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
            <UserNameDiv>
                User Name:   <strong>{user?.username}</strong>  <br/>
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
        </ProfileWrapperDiv>
    );
};

export const StyledStrong = styled.strong`
  display: flex;
  margin-bottom: 5px;

`;
export const UserNameDiv = styled.div`
  display: flex;
  justify-content: center;
  //align-items: center;
  height: 20vh;
`;

export const ProfileWrapperDiv = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  justify-content: center;
  flex-direction: column;
`;

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  height: 40vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
  margin-bottom: 12%;
`;

export default Profile;

