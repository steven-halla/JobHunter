import React, {FC, useState, ReactNode} from 'react';
import {User} from "../models/User";

interface UserContextState {
    user?: User;
    setUser: (user?: User) => void;

    users: User[];
    setUsers: (users: User[]) => void;

    usernames: string[];
    setUsernames: (usernames: string[]) => void;
}

export const UserContext = React.createContext({} as UserContextState);

interface UserContextProviderProps {
    children: ReactNode;
}

export const UserContextProvider: FC<UserContextProviderProps> = ({children}) => {
    const [user, setUser] = useState<User>();
    const [users, setUsers] = useState<User[]>([]);
    const [usernames, setUsernames] = useState<string[]>([]);

    return (
        <UserContext.Provider
            value={{
                user, setUser,
                users, setUsers,
                usernames, setUsernames
            }}
        >

            {children}
        </UserContext.Provider>
    );
};
