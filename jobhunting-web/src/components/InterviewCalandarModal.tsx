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
                <Button variant="contained" color="primary" onClick={onClose} style={{ fontFamily: fonts.ButtonFontFamily }}>
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
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10; 
  background-color: ${colors.AppBackGroundColor};
`;

const ModalContent = styled.div`
  padding: 20px;
  border-radius: 5px;
  width: 50%; 
  max-width: 500px; 
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: ${colors.FormContainer};
  color: ${colors.TextBlackColor};
  font-family:  ${fonts.ButtonFontFamily};
  font-size:  ${fonts.HeaderIconTextREM};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  
  Button {
   width: 50%;
  }
`;