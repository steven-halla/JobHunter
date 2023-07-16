import React, { createContext, FC, ReactNode, useState } from 'react';
import { Weed } from '../models/Weed';

interface WeedContextState {
    weed?: Weed;
    setWeed: React.Dispatch<React.SetStateAction<Weed | undefined>>;
    weeds: Weed[];
    setWeeds: React.Dispatch<React.SetStateAction<Weed[]>>;
}

export const WeedContext = createContext({} as WeedContextState);

interface WeedContextProviderProps {
    children: ReactNode;
}

export const WeedContextProvider: FC<WeedContextProviderProps> = ({ children }) => {
    const [weed, setWeed] = useState<Weed | undefined>({ id: 0, weedname: '', rating: 1, user_id: 0 });
    const [weeds, setWeeds] = useState<Weed[]>([]);

    return (
        <WeedContext.Provider value={{ weed, setWeed, weeds, setWeeds }}>
            {children}
        </WeedContext.Provider>
    );
};
