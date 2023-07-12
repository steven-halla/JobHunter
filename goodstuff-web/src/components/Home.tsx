import React, {useState, useEffect, useContext} from "react";
import styled from 'styled-components';

import UserService from "../services/user.service";
import { UserContext } from "../services/usercontext";

const Home = () => {
    const [ content, setContent] = useState("");
    const { usernames, setUsernames } = useContext(UserContext);

    useEffect(() => {
        console.log("Use effect for users");
        UserService.getAllUsernames()
            .then((usernames) => {
                console.log("usernames: ", usernames); // Add this line to log the users
                setUsernames(usernames);
            })
            .catch((error) => {
                console.error("Error fetching usernames: ", error);
            });
    }, []);




    useEffect(() => {
        console.log("use effect get public content");
        UserService.getPublicContent().then(
            (response) => {
                console.log("Public content:", response.data);
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
            <HomeBanner>
                <p>Keep track of your favorite weeds, as well as see how the community feels about weed brands. create an account to get started!</p>
            </HomeBanner>
            <TopFiveWeedHeader>
                Here are the top 5 weeds at the blah store for this month.
            </TopFiveWeedHeader>




            <div>
                <h1>Usernames</h1>
                <ul>
                    {usernames.map((username, index) => (
                        <li key={index}>{username}</li>
                    ))}
                </ul>



            </div>






            <HomeFooter>
                This is the footer
            </HomeFooter>
        </PinkPageDiv>
    );
};

const TopFiveWeedHeader = styled.div`
  height: 5%;
  width: 50%;
  background-color: #fff7a3;
`

const PinkPageDiv = styled.div`
  *, *:before, *:after {
    box-sizing: border-box;
  }
  
  background-color: pink;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 100vh;
  width: 100vw;
`

const HomeBanner = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #baadff;
  height: 10vh;
  width: 80vw;
  margin-top: 1vh;

  p {
    font-size: 1.5rem;
  }
`;

const HomeFooter = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #deffd2;
  height: 10vh;
  width: 100vw;

  p {
    font-size: 1.5rem;
  }
`;

const WeedTop5List = styled.ul`
  display: flex;
  flex-direction: column;
  background-color: #bcd8ff;
  height: 60vh;
  width: 80vw;
  padding: 0;

  li {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    width: 100%;
    margin-bottom: 1vh;
  }

  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 5%;
  }


  .weed-image {
    flex-basis: 10%;
    height: 20px; // Adjust this value as needed for your specific images
    object-fit: cover;
    object-position: 0 -45px;
  }

  div {
    flex-basis: 30%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .empty-image {
    display: none;
  }
`;


export default Home;
