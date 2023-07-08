import React from "react";
import AuthService from "../services/auth.service";

interface User {
    id: number;
    username: string;
    email: string;
    roles: string[];
}

const Profile: React.FC = () => {
    const currentUser: User | null = AuthService.getCurrentUser();

    if (!currentUser) {
        return <div>Loading...</div>; // Handle the case when currentUser is null
    }

    return (
        <div className="container">
            <header className="jumbotron">
                <h3>
                    <strong>{currentUser.username}</strong> Profile
                </h3>
            </header>
            <p>
                <strong>Id:</strong> {currentUser.id}
            </p>
            <p>
                <strong>Email:</strong> {currentUser.email}
            </p>
            <strong>Authorities:</strong>
            <ul>
                {currentUser.roles.map((role, index) => (
                    <li key={index}>{role}</li>
                ))}
            </ul>
        </div>
    );
};

export default Profile;
