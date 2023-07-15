import axios from "axios";

export interface Weed {
    id: number;
    weedname: string;
    user_id: number;
}

const API_URL = "http://localhost:8080/api/weeds/";

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

const createWeed = (userId: number, weed: Weed): Promise<Weed> => {
    return axios.post(`${API_URL}${userId}`, weed).then((response) => {
        return response.data as Weed;
    });
};

const WeedService = {
    getCurrentWeed,
    getWeeds,
    createWeed,
};

export default WeedService;
