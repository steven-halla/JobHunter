import React, { useContext, ChangeEvent, FormEvent, useEffect, useState, useRef } from 'react';
import { UserContext } from "../services/usercontext";
import { WeedContext } from "../services/weedcontext";
import WeedService, { Weed } from "../services/weed.service";
import { useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import AuthService from "../services/auth.service";
import { User } from "../models/User";

export const WeedForm = () => {
    const { userId } = useParams();
    const numericUserId = Number(userId);
    const [updateNames, setUpdateNames] = useState<{ [key: string]: string }>({});


    const navigate = useNavigate();
    const { weed, setWeed, weeds, setWeeds } = useContext(WeedContext);
    const { user } = useContext(UserContext);
    const currentUser: User | null = AuthService.getCurrentUser();

    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            if (currentUser) {
                try {
                    const response = await axios.get<Weed[]>(`http://localhost:8080/api/weeds/user/${currentUser.id}`);
                    setWeeds(response.data);
                } catch (error) {
                    console.error("Error fetching data: ", error);
                }
            }
        };
        fetchData();
    }, [currentUser]);

    if (!currentUser) {
        return <div>Loading...</div>; // Handle the case when currentUser is null
    }

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setWeed((prev: Weed | undefined) => ({ ...prev, [name]: value } as Weed));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!weed || !user) {
            // handle the case where weed or user is undefined
            console.error("Weed or User is undefined");
            return;
        }

        try {
            const newWeed = await WeedService.createWeed(user.id, weed);
            setWeeds([...weeds, newWeed]);
            setWeed({ id: 0, weedname: '', user_id: user.id }); // reset form
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteClick = async (weed: Weed) => {
        try {
            await WeedService.deleteWeed(weed.id);
            setWeeds(weeds.filter((w) => w.id !== weed.id));
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdateNameChange = (event: ChangeEvent<HTMLInputElement>, weedId: number) => {
        const { value } = event.target;

        setUpdateNames((prevUpdateNames) => ({
            ...prevUpdateNames,
            [weedId]: value,
        }));
    };

    const handleUpdateClick = async (weedId: number) => {
        if (updateNames[weedId]) {
            try {
                const updatedWeed = await WeedService.updateWeed(weedId, updateNames[weedId]);
                setWeeds((prevWeeds) =>
                    prevWeeds.map((w) => (w.id === updatedWeed.id ? updatedWeed : w))
                );
            } catch (error) {
                console.error(error);
            }
        }
    };


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Weed Name:
                    <input type="text" name="weedname" value={weed?.weedname || ''} onChange={handleChange} required />
                </label>
                <input type="submit" value="Create Weed" />
            </form>
            <h4>Weeds:</h4>
            <ul>
                {weeds.map((weed) => (
                    <li key={weed.id}>
                        {weed.weedname}
                        <button onClick={() => handleDeleteClick(weed)}>Delete Weed</button>
                        <input
                            type="text"
                            placeholder="Enter updated name"
                            value={updateNames[weed.id] || ''}
                            onChange={(e) => handleUpdateNameChange(e, weed.id)}
                        />
                        <button onClick={() => handleUpdateClick(weed.id)}>Update Weed</button>
                    </li>
                ))}
            </ul>;



        </div>
    );
};
