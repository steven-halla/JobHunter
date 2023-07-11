import React, { useState, useEffect } from "react";
import styled from 'styled-components';

import UserService from "../services/user.service";

const Home = () => {
    const [ content, setContent] = useState("");

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
                <p>Keep track of your favorite weeds, as well as see how the community feels about weed brands. create an account to get started!</p>
            </HomeBanner>
            <TopFiveWeedHeader>
                Here are the top 5 weeds at the blah store for this month.
            </TopFiveWeedHeader>
            <WeedTop5List>
                <li className="header">
                    <img className="weed-image empty-image" alt="" />
                    <div><p>Name</p></div>
                    <div><p>Type</p></div>
                    <div><p>Description</p></div>
                </li>
                {weedtop5.map((weed, index) => (
                    <li key={index}>
                        <img src={weed.img} alt={weed.name} className="weed-image" />
                        <div><p>{weed.name}</p></div>
                        <div><p>{weed.type}</p></div>
                        <div><p>{weed.descriptionOfHigh}</p></div>
                    </li>
                ))}
            </WeedTop5List>

            <HomeFooter>
                This is the footer
            </HomeFooter>
        </PinkPageDiv>
    );
};
const TopFiveWeedHeader = styled.div`
  height: 5%;
  width: 50%;
  background-color: #fff7a3;
`

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
  background-color: #bcd8ff;
  height: 60vh;
  width: 80vw;
  padding: 0;

  li {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    margin-bottom: 1vh;
  }

  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 5%;
  }


  .weed-image {
    flex-basis: 10%;
    height: 20px; // Adjust this value as needed for your specific images
    object-fit: cover;
    object-position: 0 -45px;
  }

  div {
    flex-basis: 30%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .empty-image {
    display: none;
  }
`;


export default Home;
