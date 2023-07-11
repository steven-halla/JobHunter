import React, {useContext, useEffect} from "react";
import AuthService from "../services/auth.service";
import {WeedContext} from "../services/weedcontext";
import axios, {AxiosError, AxiosResponse} from "axios";
import {Weed} from "../models/Weed";
import WeedService from "../services/weed.service";





interface User {
    id: number;
    username: string;
    email: string;
    roles: string[];
}

const Profile: React.FC = () => {

    const { weeds, setWeeds } = useContext(WeedContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get<Weed[]>("http://localhost:8080/api/weeds");
                setWeeds(response.data);
            } catch (error) {
                console.error("Error fetching data: ", error);
            }
        };
        fetchData();
    }, []);





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

            <h4>Weeds:</h4>
            <ul>
                {weeds.map((weed) => (
                    <li key={weed.id}>{weed.weedname}</li>
                ))}
            </ul>
        </div>
    );
};

export default Profile;
