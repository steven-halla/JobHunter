import React from "react"
import styled from "styled-components";


export const CommonStyles = () => {
    return(
        <div>

        </div>
    )
}



export const colors = {
    IconColor: "#3D4849",
    AppBackGroundColor: "#3D4849",
    // ... other color definitions ...
    HeaderBackGroundColor:" #C0C0C0",
    FormContainer: "grey",
    TextWhiteColor: "white",
    TextBlackColor: "black",


};

export const fonts = {

    HeaderIconTextREM: "1.1rem",
    MobileHeaderIconTextREM: "0.9rem",
    InputFontREM: "1.2rem",
    ButtonFontREM: "1.6rem",

    InputFontFamily: "'Helvetica Neue', Arial, sans-serif",
    InputPlaceHolderFontFamily: "'Roboto', sans-serif",
    ButtonFontFamily: "'Times New Roman', serif",
    FontFamilyItalics: "italic",

}




export const HeaderIconText = styled.div`
  color: #3D4849;

`;

const VerticalLine = styled.div`
  position: fixed; // or absolute, depending on your layout
  left: 50%;
  height: 100vh;
  width: 10px; // or as thick as you want
  background-color: #000; // or any color of your choice
  z-index: 10; // adjust as needed
`;

const VerticalLine2 = styled.div`
  position: absolute; // Positioned relative to its nearest positioned ancestor
  left: 50%;
  top: 0; // Align to the top of the container
  height: 100%; // Full height of the container
  width: 2px; // or as thick as you want
  background-color: #000; // or any color of your choice
  z-index: 10; // adjust as needed
`;