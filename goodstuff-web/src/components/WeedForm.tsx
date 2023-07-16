import React, { useContext, ChangeEvent, FormEvent, useEffect, useState } from 'react';
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
    //why is the key below here a string and not an integer?
    const [updateRatings, setUpdateRatings] = useState<{ [key: string]: number }>({});

    const navigate = useNavigate();
    const { weed, setWeed, weeds, setWeeds } = useContext(WeedContext);
    const { user } = useContext(UserContext);
    const currentUser: User | null = AuthService.getCurrentUser();

    useEffect(() => {
        const fetchData = async () => {
            if (currentUser && Object.keys(updateNames).length === 0 && Object.keys(updateRatings).length === 0) {
                try {
                    const response = await axios.get<Weed[]>(`http://localhost:8080/api/weeds/user/${currentUser.id}`);
                    setWeeds(response.data);
                    const initialUpdateNames: { [key: number]: string } = {};
                    const initialUpdateRatings: { [key: number]: number } = {};
                    response.data.forEach(weed => {
                        initialUpdateNames[weed.id] = weed.weedname;
                        initialUpdateRatings[weed.id] = weed.rating;
                    });
                    setUpdateNames(initialUpdateNames);
                    setUpdateRatings(initialUpdateRatings);
                } catch (error) {
                    console.error("useEffect WeedForm line 37: Error fetching data: ", error);
                }
            }
        };
        fetchData();
    }, [currentUser, updateNames, updateRatings]);



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
            setWeed({ id: 0, weedname: '', user_id: user.id, rating: 1 }); // reset form
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

    const handleUpdateRatingChange = (event: ChangeEvent<HTMLSelectElement>, weedId: number) => {
        const { value } = event.target;

        setUpdateRatings((prevUpdateRatings) => ({
            ...prevUpdateRatings,
            [weedId]: Number(value),
        }));
    };

    const handleUpdateClick = async (weedId: number) => {
        try {
            const updatedWeed = await WeedService.updateWeed(weedId, updateNames[weedId], updateRatings[weedId]);
            setWeeds((prevWeeds) =>
                prevWeeds.map((w) => (w.id === updatedWeed.id ? updatedWeed : w))
            );
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>

            <form onSubmit={handleSubmit}>
                <label>
                    Weed Name:
                    <input type="text" name="weedname" value={weed?.weedname || ''} onChange={handleChange} required />
                </label>
                <label>
                    Rating:
                    <input type="number" name="rating" min="1" max="5" value={weed?.rating || 1} onChange={handleChange} required />

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
                        <select value={updateRatings[weed.id] || 1} onChange={(e) => handleUpdateRatingChange(e, weed.id)}>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                        <button onClick={() => handleUpdateClick(weed.id)}>Update Weed</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
