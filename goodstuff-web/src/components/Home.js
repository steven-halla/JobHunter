import React, { useState, useEffect } from "react";
import styled from 'styled-components';

import UserService from "../services/user.service";

const Home = () => {
    const [content, setContent] = useState("");

    useEffect(() => {
        UserService.getPublicContent().then(
            (response) => {
                setContent(response.data);
            },
            (error) => {
                const _content =
                    (error.response && error.response.data) ||
                    error.message ||
                    error.toString();

                setContent(_content);
            }
        );
    }, []);

    const weedtop5 = [
        {name: "blueberry purple", type: "sativa", descriptionOfHigh: "you'll get so high you'll turn purple",img: "hemped.jpeg"},
        {name: "rotten haze", type: "indica", descriptionOfHigh: "it'll rot your lungs so dont smoke too much", img: "hemped.jpeg"},
        {name: "princess cannibal ", type: "hybrid 50/50", descriptionOfHigh: "this weed will melt the flesh off your bones",img: "hemped.jpeg"},
        {name: "rib demon", type: "hybrid india dominant", descriptionOfHigh: "you'll be so high demons really will exist",img: "hemped.jpeg"},
        {name: "Mr Blunt", type: "hybrid sativa dominant", descriptionOfHigh: "Mr. GoodBar's brother",img: "hemped.jpeg"},
    ]

    return (
        <PinkPageDiv>
            <HomeBanner>
                <p>WELCOME TO THE WEED HOME PAGE. DO YOU LIKE WEED? IF NOT, YOU CAN JUST GET OUT OF HERE!</p>
            </HomeBanner>
            <WeedTop5List>
                <li className="header">
                    <p>Name</p>
                    <p>Type</p>
                    <p>Description</p>
                </li>
                {weedtop5.map((weed, index) => (
                    <li key={index}>
                        <img src={weed.img} alt={weed.name} className="weed-image"/>
                        <p>{weed.name}</p>
                        <p>{weed.type}</p>
                        <p>{weed.descriptionOfHigh}</p>
                    </li>
                ))}
            </WeedTop5List>
            <HomeFooter>
                This is the footer
            </HomeFooter>
        </PinkPageDiv>
    );

};

const PinkPageDiv = styled.div`
  *, *:before, *:after {
    box-sizing: border-box;
  }
  
  background-color: pink;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100vh;
  width: 100vw;
`

const HomeBanner = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #baadff;
  height: 10vh;
  width: 80vw;
  margin-top: 1vh;

  p {
    font-size: 1.5rem;
  }
`;

const HomeFooter = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #deffd2;
  height: 10vh;
  width: 100vw;

  p {
    font-size: 1.5rem;
  }
`;

const WeedTop5List = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #bcd8ff;
  height: 60vh;
  width: 80vw;

  li.header {
    display: flex;
    flex-direction: row;
    justify-content: space-around; // adjust as needed
    align-items: flex-start;
  }

  li:not(.header) {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    gap: 20px;
  }

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
  }

  li:first-child {
    justify-content: center;
  }

  img.weed-image {
    flex-basis: 100px;
    height: 60px;
    object-fit: cover;
    object-position: 0 -20px;
  }

  p {
    flex-basis: 0;
    flex-grow: 1;
  }


  .weed-image.hidden {
    visibility: hidden;
  }


  li {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    margin-bottom: 1vh;
  }

  .weed-image {
    flex-basis: 10%;
    height: 30px;  // Adjust this value as needed for your specific images
    object-fit: cover;
    object-position: 0 -40px;  // This line "crops" the image, effectively removing 20 pixels from the top
  }

  div {
    flex-basis: 30%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
`;

export default Home;
