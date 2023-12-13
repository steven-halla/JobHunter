import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {Job} from "../models/Job";
import styled from "styled-components";
import {colors, fonts} from "../common/CommonStyles";

interface JobCarouselProps {
    searchResult: Job[] | null;
}

export const JobCarousel: React.FC<JobCarouselProps> = ({ searchResult }) => {

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return (
        <div>
            {Array.isArray(searchResult) && searchResult.length > 0 && (
                <Slider {...settings}>
                    {searchResult.map((job, index) => (
                        <CarouselDiv key={index}>
                            <h3>Result {index + 1}:</h3>
                            <p>Company Name: {job.companyname}</p>
                            <p>Primary Contact: {job.primarycontact}</p>
                            <p>Company Responded: {job.companyresponded ? 'Yes' : 'No'}</p>
                            <p>Company Rejected: {job.companyrejected ? 'Yes' : 'No'}</p>
                            <a href={job.joblink} target="_blank" rel="noopener noreferrer" style={{ margin: '0', textAlign: 'center', marginLeft: "38%", paddingBottom: "13%", color: 'black' }}>Job Link</a>
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
  height: 100%; 
  
  h3, a, p {
    margin: 0; 
    text-align: center;
    padding-bottom: 30px;
    color: ${colors.TextBlackColor};
    font-size: ${fonts.InputFontREM};
    font-family: ${fonts.FontFamilyItalics};
  }
`;
