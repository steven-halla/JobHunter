import React, { useEffect, useState } from "react";
import axios from "axios";
import {Weed} from "../models/Weed";

export const WeedList = () => {
    const [weeds, setWeeds] = useState<Weed[]>([]);

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

    return (
        <div>
            <h2>Weed List</h2>
            <ul>
                {weeds.map(weed => (
                    <li key={weed.id}>{weed.weedname}</li>
                ))}
            </ul>
        </div>
    );
}
