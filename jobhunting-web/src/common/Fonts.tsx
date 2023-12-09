// import React from "react";
// import styled, {createGlobalStyle} from "styled-components";
// import {Link} from "react-router-dom";
// import {noResponseJobs} from "./ScreenSizes";
//
//
// export const  Fonts = () => {
//     return(
//         <div>
//             <p>
//                 Here is the fonts
//             </p>
//
//
//         </div>
//     );
// };
//
// const HeaderFonts = styled(Link)`
//
//
//   span {
//     font-size: 1.1rem;
//   }
//
//   span {
//     font-weight: bold;
//   }
//
//   @media ${noResponseJobs.mobile} {
//     margin-bottom: 3%;
//
//     span {
//       font-size: 0.9rem;
//     }
//   }
//
//   font-family: 'Papyrus, sans-serif';
//
// `;
//
//
// export const HomeFonts = createGlobalStyle`
//   body, div, h1, h2, h3, h4, h5, h6, p, label, input, button {
//     /* Define your font theme here */
//     --primary-font: 'Helvetica Neue', Arial, sans-serif;
//     --secondary-font: 'Roboto', sans-serif;
//   }
//
//   body {
//     font-family: var(--primary-font);
//   }
//
//   input, button {
//     font-family: var(--secondary-font);
//   }
//
//   /* ... Add other global font styles ... */
// `;
//
// export const ModalFontStyles = styled.div`
//   font-family: 'Arial', sans-serif; /* Default font family for the modal */
//
//   ${ModalContent} {
//     /* Specific font styles for modal content, if needed */
//   }
//
//   button {
//     /* Specific font styles for buttons, if needed */
//     font-size: 1rem;
//   }
// `;