import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface DecodedJwt {
  exp: number;
  [key: string]: any;
}

const parseJwt = (token: string): DecodedJwt | null => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

interface Props {
  logOut: () => void;
}

const AuthVerify: React.FC<Props> = ({ logOut }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const user = JSON.parse(userString);
      const decodedJwt = parseJwt(user.accessToken);

      if (decodedJwt && decodedJwt.exp * 1000 < Date.now()) {
        logOut();
      }
    } else {
      navigate('/login');  // or wherever you want to redirect unauthenticated users
    }
  }, [logOut, navigate]);

  return <div></div>;
};

export default AuthVerify;
