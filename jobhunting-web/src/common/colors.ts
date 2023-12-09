import styled, {createGlobalStyle} from "styled-components";
import {Link} from "react-router-dom";

export const Colors = styled.div`
 
  background-color: #c7f3ff;

  /* Adding box shadow on left, right, and bottom sides */
  box-shadow:
          -4px 0 8px -2px rgba(0, 0, 0, 0.2), /* Left shadow */
          4px 0 8px -2px rgba(0, 0, 0, 0.2),  /* Right shadow */
          0 4px 8px -2px rgba(0, 0, 0, 0.2);  /* Bottom shadow */
`;


// #121212 use this as an eample of dark mode
const HeaderColors = styled(Link)`
  svg {
    color: #007bff;
  }
  text {
    color: #3D4849;
  }

  background-color: purple;
  border: 1px solid #ccc;
  background-color: #C0C0C0;


`;


export const HomeColors = createGlobalStyle`
  body, div, h1, h2, h3, h4, h5, h6, p, label, input, button {
    /* Define your color theme here */
    --primary-color: grey;
    --secondary-color: lightgray;
    --accent-color: red;
    --text-color: #333;
    --text-color-light: white;
    --background-color: #f2f2f2;
    --button-color: red;
    --button-hover-color: darkred;
    --link-color: blue;
    --shadow-color: rgba(0, 0, 0, 0.2);
  }

  .JobCardDiv, .RedBox, .Footer, .FieldContainerDiv, .ButtonDiv, .SubmitButton {
    /* Apply the color variables */
    background-color: var(--secondary-color);
    color: var(--text-color);
    box-shadow: -4px 0 8px -2px var(--shadow-color), 4px 0 8px -2px var(--shadow-color), 0 4px 8px -2px var(--shadow-color);
  }

  .SubmitButton {
    background-color: var(--button-color);
    &:hover {
      background-color: var(--button-hover-color);
    }
  }

  /* ... Add other global color styles ... */
`;

export const ModalColorStyles = styled.div`
  background-color: #3D4849; /* Background color for the modal wrapper */

 
    background-color: white; /* Background color for the modal content */
  

  button {
    /* Style for the button, adjust as needed */
    background-color: #4A626A; /* Button background color */
    color: white; /* Button text color */
    border: none;
    padding: 10px 15px;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: #5E7480; /* Button hover background color */
    }
  }
`;