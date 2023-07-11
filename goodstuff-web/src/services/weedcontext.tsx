import React, { FC, useState, ReactNode } from 'react';
import { Weed } from '../models/Weed';

interface WeedContextState {
    weed?: Weed;
    setWeed: (weed?: Weed) => void;

    weeds: Weed[];
    setWeeds: (weeds: Weed[]) => void;
}

export const WeedContext = React.createContext({} as WeedContextState);

interface WeedContextProviderProps {
    children: ReactNode;
}

export const WeedContextProvider: FC<WeedContextProviderProps> = (props) => {
    const [weed, setWeed] = useState<Weed | undefined>();
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
