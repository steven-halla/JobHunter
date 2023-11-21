import React, { ReactNode } from 'react';
import styled from "styled-components";

type InterviewCalendarModalProps = {
    show: boolean;
    onClose: () => void;
    children: ReactNode;
};



export const InterviewCalendarModal: React.FC<InterviewCalendarModalProps> = ({ show, onClose, children }) => {
    if (!show) {
        return null;
    }
    return (
        <InterviewCalendarModalWrapperDiv>
            <ModalContent>
                {children}
                <button onClick={onClose}>Close</button>
            </ModalContent>
        </InterviewCalendarModalWrapperDiv>
    );
};

const InterviewCalendarModalWrapperDiv = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10; // To ensure it's above all other content
  
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 50%; // Adjust as needed
  max-width: 500px; // Adjust as needed
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;