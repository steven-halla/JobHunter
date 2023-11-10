import React, {FC, useState, ReactNode, useEffect} from 'react';
import {User} from "../models/User";
import UserService from "./user.service";

interface UserContextState {

    user?: User;
    setUser: (user?: User) => void;

    users: User[];
    setUsers: (users: User[]) => void;

    usernames: string[];
    setUsernames: (usernames: string[]) => void;

    username: string;
    setUsername: (username: string) => void;

    customfield1: string;
    setCustomField1: (customfield1: string) => void;

    customfield2: string;
    setCustomField2: (customfield2: string) => void;

    customfield3: string;
    setCustomField3: (customfield3: string) => void;

    lifeStory: string;
    setLifeStory: (lifeStory: string) => void;
}

export const UserContext = React.createContext({} as UserContextState);

interface UserContextProviderProps {
    children: ReactNode;
}

export const UserContextProvider: FC<UserContextProviderProps> = ({children}) => {
    const [user, setUser] = useState<User>();
    const [users, setUsers] = useState<User[]>([]);
    const [usernames, setUsernames] = useState<string[]>([]);
    const [username, setUsername] = useState<string>("");
    const [customfield1, setCustomField1] = useState<string>('');
    const [customfield2, setCustomField2] = useState<string>('');
    const [customfield3, setCustomField3] = useState<string>('');
    const [lifeStory, setLifeStory] = useState<string>('');

    // Load user data from localStorage when the application starts
    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            const userObj = JSON.parse(userData);
            setUser(userObj);
            if (userObj.customfield1) {
                setCustomField1(userObj.customfield1);
            }
            if (userObj.customfield2) {
                setCustomField2(userObj.customfield2);
            }
            if (userObj.customfield3) {
                setCustomField3(userObj.customfield3);
            }

            if (userObj.lifestory) {
                setLifeStory(userObj.lifeStory);
            }

            if (userObj && userObj.id) {
                UserService.getUserById(userObj.id)
                    .then((retrievedUser) => {
                        setUser(retrievedUser);
                    })
                    .catch((error) => {
                        console.error('Error fetching user by id:', error);
                    });
            }
        }


    }, []);

    return (
        <UserContext.Provider
            value={{
                lifeStory,setLifeStory,
                user, setUser,
                users, setUsers,
                usernames, setUsernames,
                username, setUsername,
                customfield1, setCustomField1,
                customfield2, setCustomField2,
                customfield3, setCustomField3
            }}
        >
            {children}
        </UserContext.Provider>
    );
};
