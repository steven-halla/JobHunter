import axios, { AxiosResponse } from "axios";

const API_URL = "http://localhost:3000/api/test/";

const getPublicContent = (): Promise<AxiosResponse> => {
  return axios.get(API_URL + "all");
};

const getUserBoard = (): Promise<AxiosResponse> => {
  return axios.get(API_URL + "user");
};

const getModeratorBoard = (): Promise<AxiosResponse> => {
  return axios.get(API_URL + "mod");
};

const getAdminBoard = (): Promise<AxiosResponse> => {
  return axios.get(API_URL + "admin");
};

const UserService = {
  getPublicContent,
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
};

export default UserService;
