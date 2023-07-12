

import React, {useState} from "react";

export const PlayGround = () => {

    const [weedname, setWeedName] = useState("")
    return(
        <div>
            <p>Hi I'm the playground</p>
            <p>We should require an user ID before letting any user see this page. Need to look up how to do that.</p>
        </div>
    );
};