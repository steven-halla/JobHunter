import React, {useEffect, useState} from "react";
import axios from "axios";

export const WeedList = () => {

    const [weeds, setWeeds] = useState([]);
    //
    // useEffect(() => {
    //     const fetchDate = async () => {
    //         try {
    //             const response = await axios.get
    //         }
    //     }
    // })

    return(
      <div>
          <p>
              hi im the weed list I will come at a much later iteration
          </p>
          <p>For the time being we are only going to focus on users adding their own stuff</p>
          <p> I'll need to allow users to uplaod an image. that will be hard for sure</p>
      </div>
    );
}