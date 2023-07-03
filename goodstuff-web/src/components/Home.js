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
      {name: "blueberry purple", type: "sativa", descriptionOfHigh: "you'll get so high you'll turn purple"},
      {name: "rotten haze", type: "indica", descriptionOfHigh: "it'll rot your lungs so dont smoke too much"},
      {name: "princess cannibal ", type: "hybrid 50/50", descriptionOfHigh: "this weed will melt the flesh off your bones"},
      {name: "rib demon", type: "hybrid india dominant", descriptionOfHigh: "you'll be so high demons really will exist"},
      {name: "Mr Blunt", type: "hybrid sativa dominant", descriptionOfHigh: "Mr. GoodBar's brother"},
  ]

  return (
      <PinkPageDiv>

          <HomeBanner>
            <p>WELCOME TO THE WEED HOME PAGE. DO YOU LIKE WEED? IF NOT, YOU CAN JUST GET OUT OF HERE!</p>
          </HomeBanner>
          <WeedTop5List>
              <li>
                  <div>Name</div>
                  <div>Type</div>
                  <div>Description of High</div>
              </li>
              {weedtop5.map((weed, index) => (
                  <li key={index}>
                      <div>{weed.name}</div>
                      <div>{weed.type}</div>
                      <div>{weed.descriptionOfHigh}</div>
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

  height: 100vh;
  width: 100vw;
  
`

const HomeBanner = styled.header`
  display: flex;
  justify-content: center; // Centers children along the horizontal line
  align-items: center; // Centers children along the vertical line

  background-color: #baadff;
  height: 10vh;
  width: 80vw;
  margin-left: auto;
  margin-right: auto;
  margin-top: 1vh;

  p {
    font-size: 1.5rem;
  }
`;

const HomeFooter = styled.header`
  display: flex;
  justify-content: center; // Centers children along the horizontal line
  align-items: center; // Centers children along the vertical line

  background-color: #deffd2;
  height: 10vh;
  width: 100vw;

  position: fixed; // Fixed positioning
  bottom: 0; // Position at the bottom

  p {
    font-size: 1.5rem;
  }
`;

const WeedTop5List = styled.ul`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  display: flex;
  flex-direction: column; 
  justify-content: center; 
  align-items: center; 
  background-color: #bcd8ff;
  height: 50vh;
  width: 100vw;

  li {
    display: flex;
    justify-content: space-between;
    width: 70%;  // You can adjust this value as per your requirements
    padding: 10px;  // Add some padding to separate the lines
  }

  li div {
    width: 33%;
    text-align: center;  // Make all text centered
    padding: 0 10px; // Add padding to give some space between the columns
  }
`;







export default Home;
