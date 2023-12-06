import React from "react";
import { Link } from "react-router-dom";

export const NoLogin = () => {
    return (
        <div>
            <p>You need to be logged in to access this resource.</p>
            <Link to="/">Go to Login</Link>
        </div>
    );
};

