import axios, { AxiosResponse } from "axios";

interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

const BASE_API_URL = "http://localhost:3000/api";



const getAllUsernames = (): Promise<string[]> => {
  console.log("getAllUsernames called");
  return axios.get(BASE_API_URL + "/users/usernames")
      .then((response: AxiosResponse) => {
        console.log("allUsernames: " + response.data);
        return response.data as string[];
      })
      .catch((error: any) => {
        console.error("Error fetching users: ", error);
        throw error;
      });
};

const getUsers = (): Promise<User[]> => {
  console.log("getUsers called");
  return axios.get(BASE_API_URL + "/users")
      .then((response: AxiosResponse) => {
        console.log("users: " + response.data);
        return response.data as User[];
      })
      .catch((error: any) => {
        console.error("Error fetching users: ", error);
        throw error;
      });
};




const getPublicContent = (): Promise<AxiosResponse> => {
  console.log("getPublicContent calld")
  return axios.get(BASE_API_URL);
};

const getUserBoard = (): Promise<AxiosResponse> => {
  return axios.get(BASE_API_URL + "/user");
};

const getModeratorBoard = (): Promise<AxiosResponse> => {
  return axios.get(BASE_API_URL + "/mod");
};

const getAdminBoard = (): Promise<AxiosResponse> => {
  return axios.get(BASE_API_URL + "/admin");
};

const UserService = {
  getUsers,
  getAllUsernames,
  getPublicContent,
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
};

export default UserService;
