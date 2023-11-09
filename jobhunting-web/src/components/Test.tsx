import React, { useState } from 'react';
import styled from 'styled-components';

// Sample data with colors
const items = [
    { id: 'red', color: 'red' },
    { id: 'blue', color: 'blue' },
    { id: 'green', color: 'green' },
    { id: 'purple', color: 'purple' },
    { id: 'aqua', color: 'aqua' },
    { id: 'yellow', color: 'yellow' },
];

const ParentDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const RolodexContainer = styled.div`
  perspective: 1000px;
  height: 400px;
  position: relative;
`;

interface CardProps {
    angle: number;
    color: string;
}

const Card = styled.div<CardProps>`
  width: 100px;
  height: 100px;
  background-color: ${props => props.color};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotateX(${props => props.angle}deg) translateZ(150px);
  transform-origin: center center;
  transition: transform 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Test = () => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const handleNext = () => {
        setSelectedIndex((prevIndex) => (prevIndex + 1) % items.length);
    };

    const handlePrev = () => {
        setSelectedIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
    };

    return (
        <ParentDiv>
            <RolodexContainer>
                {items.map((item, index) => (
                    <Card key={item.id} angle={(index - selectedIndex) * 60} color={item.color}>
                        {item.id}
                    </Card>
                ))}
                <button onClick={handlePrev}>Previous</button>
                <button onClick={handleNext}>Next</button>
            </RolodexContainer>
        </ParentDiv>
    );
};

