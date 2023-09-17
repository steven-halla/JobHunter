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

    console.log("user:", user);
    console.log("customfield1:", customfield1);
    console.log("customfield2:", customfield2);
    console.log("customfield3:", customfield3);






    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("Handled submit");
        try {
            if (user && user.id) { // Check if user and user.id are not undefined
                console.log("user id is good to go")

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

                console.log("I'm about to see if response is ok wish me luck kenny");
                console.log("Response:", response);

                if (response.ok) {
                    // Update the user object in the context with the updated custom fields
                    setUser({
                        ...user,
                        customfield1,
                        customfield2,
                        customfield3,
                        // roles: user.roles || [], // Default to an empty array if roles is undefined
                    });

                    console.log("User after update:", user);

                    // Resetting the custom fields after successful update
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
        <div className="container">

            <UserNameDiv>
                User Name:   <strong>{user?.username}</strong>  <br/>

            </UserNameDiv>

            <form onSubmit={handleSubmit}>
                // Use the individual custom fields' state for the input values
                <p>
                    <strong>Custom field 1:</strong>
                    <input type="text" name="customfield1" value={customfield1} onChange={handleChange} />
                </p>
                <p>
                    <strong>Custom field 2:</strong>
                    <input type="text" name="customfield2" value={customfield2} onChange={handleChange} />
                </p>
                <p>
                    <strong>Custom field 3:</strong>
                    <input type="text" name="customfield3" value={customfield3} onChange={handleChange} />
                </p>

                <button type="submit">Update</button>
            </form>
        </div>
    );
};

export const UserNameDiv = styled.div`
  margin-bottom: 20px;
  margin-top: 10px;
`;

export default Profile;
