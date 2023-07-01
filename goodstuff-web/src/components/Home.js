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

  return (
      <PinkPageDiv>
          <div>
              <h3>{content}</h3>
              <p>time for some new content</p>
          </div>

      </PinkPageDiv>
  );
};

const PinkPageDiv = styled.div`
  
  *, *:before, *:after {
    box-sizing: border-box;
  }
  background-color: pink;
  height: 100vh;
  width: 100vw;
  

  
`

export default Home;
