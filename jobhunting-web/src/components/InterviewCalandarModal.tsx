import React, { ReactNode } from 'react';
import styled from "styled-components";
import {colors, fonts} from "../common/CommonStyles";
import Button from "@mui/material/Button";

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
                <Button variant="contained" color="primary" onClick={onClose}>
                    Exit
                </Button>            </ModalContent>
        </InterviewCalendarModalWrapperDiv>
    );
};

const InterviewCalendarModalWrapperDiv = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  //background-color: rgba(0, 0, 0, 0.5);
  //background-color: red;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10; // To ensure it's above all other content
  //background-color: #3D4849;
  //background-color: red;
  background-color: ${colors.AppBackGroundColor};
`;

const ModalContent = styled.div`
  //background-color: red;
  padding: 20px;
  border-radius: 5px;
  width: 50%; // Adjust as needed
  max-width: 500px; // Adjust as needed
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: ${colors.FormContainer};
  color: ${colors.TextBlackColor};
  font-family:  ${fonts.ButtonFontFamily};
  font-size:  ${fonts.HeaderIconTextREM};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  

`;