import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { UserContext } from '../services/usercontext';
import UserService from '../services/user.service';

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



    // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     console.log("Handled submit");
    //     try {
    //         if (user && user.id) { // Check if user and user.id are not undefined
    //             console.log("user id is good to go")
    //
    //             const response = await fetch(`http://localhost:8080/api/users/updateuser/${user.id}`, {
    //                 method: "PATCH",
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify({
    //                     customfield1: user.customfield1,
    //                     customfield2: user.customfield2,
    //                     customfield3: user.customfield3,
    //                 }),
    //             });
    //             console.log("I'm about to see if response is ok wish me luck kenny")
    //
    //             if (response.ok) {
    //                 // Update the user object in the context with the updated custom fields
    //                 setUser({
    //                     ...user,
    //                     customfield1,
    //                     customfield2,
    //                     customfield3,
    //                     roles: user.roles || [], // Default to an empty array if roles is undefined
    //                 });
    //
    //                 // Resetting the custom fields after successful update
    //                 setCustomField1("");
    //                 setCustomField2("");
    //                 setCustomField3("");
    //
    //                 alert("User updated successfully");
    //             } else {
    //                 console.error("Failed to update job interview");
    //             }
    //         }
    //     } catch (error) {
    //         console.error("Failed to update job interview:", error);
    //     }
    // };

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
                        customfield1: user.customfield1,
                        customfield2: user.customfield2,
                        customfield3: user.customfield3,
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
                    setCustomField1("");
                    setCustomField2("");
                    setCustomField3("");

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
            <header className="jumbotron">
                <h3>
                    <strong>{user?.username}</strong> Name <br/>
                    <strong>{user?.customfield1}</strong> Custom field 1 <br/>
                    <strong>{user?.customfield2}</strong> Custom field 2 <br/>
                    <strong>{user?.customfield3}</strong> Custom field 3 <br/>
                </h3>
            </header>
            <form onSubmit={handleSubmit}>
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

export default Profile;
