import axios from "axios";

const API_URL = "http://localhost:3000/api/auth/";

const register = (username: string, email: string, password: string) => {
  return axios.post(API_URL + "signup", {
    username,
    email,
    password,
  });
};

const login = (username: string, password: string) => {
  return axios
      .post(API_URL + "signin", {
        username,
        password,
      })
      .then((response) => {
        if (response.data.username) {
          localStorage.setItem("user", JSON.stringify(response.data));
          console.log('Login Response:', response.data); // Log the entire response
        }

        return response.data;
      });
};

// const login = (username: string, password: string) => {
//   return axios
//       .post(API_URL + "signin", {
//         username,
//         password,
//       }, {
//         withCredentials: true,  // Add this line
//       })
//       .then((response) => {
//         if (response.data.username) {
//           localStorage.setItem("user", JSON.stringify(response.data));
//           console.log('Login Response:', response.data);
//         }
//
//         return response.data;
//       });
// };

// const login = (username: string, password: string) => {
//     return axios
//         .post(API_URL + "signin", {
//             username,
//             password,
//         }, {
//             withCredentials: true,
//         })
//         .then((response) => {
//             if (response.data.username && response.data.token) { // checking for both username and token
//                 localStorage.setItem("user", JSON.stringify(response.data));
//                 localStorage.setItem('userToken', response.data.token);
//                 console.log("Here is your token: " + response.data.token);
//             }
//             return response.data;
//         })
//         .catch((error) => {
//             console.error('Login error:', error);
//         });
// };
//







const logout = () => {
  localStorage.removeItem("user");
  return axios.post(API_URL + "signout").then((response) => {
    return response.data;
  });
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user") as string);
};


const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;
