import React, { FC, useState, ReactNode } from 'react';
import { Weed } from '../models/Weed';

interface WeedContextState {
    weed?: Weed;
    setWeed: React.Dispatch<React.SetStateAction<Weed | undefined>>;
    weeds: Weed[];
    setWeeds: (weeds: Weed[]) => void;
}


export const WeedContext = React.createContext({} as WeedContextState);

interface WeedContextProviderProps {
    children: ReactNode;
}

export const WeedContextProvider: FC<WeedContextProviderProps> = (props) => {
    const [weed, setWeed] = useState<Weed | undefined>({ id: 0, weedname: '', user_id: 0 });
    const [weeds, setWeeds] = useState<Weed[]>([]);

    return (
        <WeedContext.Provider
            value={{
                weed,
                setWeed,
                weeds,
                setWeeds,
            }}
        >
            {props.children}
        </WeedContext.Provider>
    );
};
