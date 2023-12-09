import React, { useContext } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {Job} from "../models/Job";
import {JobsContext} from "../services/jobcontext";
import styled from "styled-components";
import {deviceHome} from "../common/ScreenSizes";
import {colors} from "../common/CommonStyles";

interface JobCarouselProps {
    searchResult: Job[] | null; // Accepts Job[] or null
}
export const JobCarousel: React.FC<JobCarouselProps> = ({ searchResult }) => {


    const { jobs } = useContext(JobsContext); // Access jobs from context

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    // if (searchResult === null) {
    //     return <div>No jobs found.</div>;
    // }


    return (
        <div>
            {Array.isArray(searchResult) && searchResult.length > 0 && (
                <Slider {...settings}>
                    {searchResult.map((job, index) => (
                        <CarouselDiv key={index}>
                            <h3>Result {index + 1}:</h3>
                            <p>Company Name: {job.companyname}</p>
                            <p>Primary Contact: {job.primarycontact}</p>
                            {/* Implement or adjust DateMutation as needed */}
                            <p>Company Responded: {job.companyresponded ? 'Yes' : 'No'}</p>
                            <p>Company Rejected: {job.companyrejected ? 'Yes' : 'No'}</p>
                            <a href={job.joblink} style={{ margin: '0', textAlign: 'center',marginLeft: "38%",paddingBottom: "13%", color: 'blue' }}>Job Link</a>

                        </CarouselDiv>
                    ))}
                </Slider>
            )}
        </div>
    );
};


const CarouselDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%; /* Ensure the div takes up the entire height of its container */

  /* Add padding or margin as needed for spacing */

  h3, a, p {
    margin: 0; /* Reset margin to zero */
    text-align: center; /* Center text horizontally */
    padding-bottom: 30px;
    //color: white;
    color: ${colors.TextWhiteColor};

  }
`;
