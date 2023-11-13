import React, { useState, useEffect, useContext } from 'react';
import styled from "styled-components";



export const Test = () => {

    interface Card {
        name: string;
        company: string;
        number: number;
        description: string;
        date: number;
    }

    const cards: Card[] = [
        {
            name: "pluto",
            company: "not a planet",
            number: 143333939,
            description: "it's still not a planet, its a satellite dish",
            date: 14433
        },
        {
            name: "neptune",
            company: "also not a planet",
            number: 987654321,
            description: "neptune is a gas giant",
            date: 9876
        },
        {
            name: "juno",
            company: "is a planet",
            number: 143333939,
            description: "By the light of the god emperor its a planet",
            date: 14433
        },
        {
            name: "kravos",
            company: "orky boys",
            number: 987654321,
            description: "noob stompas rule dis ere place",
            date: 9876
        }
    ];




    return (
        <TestWrapperDiv>
            <CardBoxDiv>
                {cards.map((card: Card, index: number) => (
                    <CardDiv key={index}>
                        <h2>{card.name}</h2>
                        <p>Company: {card.company}</p>
                        <p>Number: {card.number}</p>
                        <p>Description: {card.description}</p>
                        <p>Date: {card.date}</p>
                    </CardDiv>
                ))}
            </CardBoxDiv>
        </TestWrapperDiv>
    );
};

const TestWrapperDiv = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  background-color: peachpuff;
  justify-content: center;
  align-items: center;
`;

const CardBoxDiv = styled.div`
  display: flex;
  flex-direction: column; /* Align cards vertically */
  gap: 10px; /* Add 10px spacing between cards */
`;

const CardDiv = styled.div`
  background-color: white; /* Background color for each card */
  padding: 10px; /* Add some padding around each card */
  border: 1px solid #ccc; /* Add a border for each card */
`;