import axios from "axios";

interface Weed {
    // Define the properties of the Weed object here
    // For example:
    id: number;
    name: string;
    // ...
}

const API_URL = "http://localhost:3000/api/weeds/";

const getCurrentWeed = (): Weed | undefined => {
    const weedString = localStorage.getItem("weed");
    if (weedString) {
        return JSON.parse(weedString) as Weed;
    }
};

const getWeeds = (): Promise<Weed[]> => {
    return axios.get(API_URL).then((response) => {
        return response.data as Weed[];
    });
};

const WeedService = {
    getCurrentWeed,
    getWeeds,
};

export default WeedService;
