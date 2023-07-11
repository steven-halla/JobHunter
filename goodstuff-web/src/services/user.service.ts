import axios, { AxiosResponse } from "axios";

interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

const API_URL = "http://localhost:3000/api/users";

const getUsers = (): Promise<User[]> => {
  return axios.get(API_URL).then((response: AxiosResponse) => {
    console.log("Hi");
    return response.data as User[];
  });
};

const getPublicContent = (): Promise<AxiosResponse> => {
  return axios.get(API_URL + "/all");
};

const getUserBoard = (): Promise<AxiosResponse> => {
  return axios.get(API_URL + "/user");
};

const getModeratorBoard = (): Promise<AxiosResponse> => {
  return axios.get(API_URL + "/mod");
};

const getAdminBoard = (): Promise<AxiosResponse> => {
  return axios.get(API_URL + "/admin");
};

const UserService = {
  getUsers,
  getPublicContent,
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
};

export default UserService;
