import React from "react";
import WeedService from "../services/weed.service";
import styled from "styled-components";


export const WeedProfile = () => {
    const singleWeed =
        {
            name: "blueberry purple",
            type: "sativa",
            descriptionOfHigh: "you'll get so high you'll turn purple",
            img: "hemped.jpeg"
        };


    return (
        <WeedProfilePage>
            <WeedImageContainer>
                <img src={singleWeed.img} alt={singleWeed.name} className="weed-image"/>
            </WeedImageContainer>
            <WeedContainer>
                <li>
                    <p>Name: {singleWeed.name}</p>
                    <div><p>Type: {singleWeed.type}</p></div>
                    <div><p>description: {singleWeed.descriptionOfHigh}</p></div>
                </li>
            </WeedContainer>
        </WeedProfilePage>

    );
};


const WeedContainer = styled.div `
  display: flex;
  height: 30%;
  width: 70%;
  margin-left: 20px;
  margin-top: 3%;
;
  background-color: #c7c6ff;
  
`

const WeedProfilePage = styled.div `
  display: flex;
  height: 100vh;
  width: 100vw;
  flex-direction: row;
  background-color: aquamarine;
`

const WeedImageContainer = styled.div `
  flex-basis: 30%;
  height: 10%; // Adjust this value as needed for your specific images
  
`


