import React, { useContext } from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {Job} from "../models/Job";
import {JobsContext} from "../services/jobcontext";

interface JobCarouselProps {
    searchResult: Job[];
}


export const JobCarousel: React.FC = () => {
    const { jobs } = useContext(JobsContext); // Access jobs from context

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return (
        <div>
            {Array.isArray(jobs) && jobs.length > 0 && (
                <Slider {...settings}>
                    {jobs.map((job, index) => (
                        <div key={index}>
                            <h3>Result {index + 1}:</h3>
                            <p>Company Name: {job.companyname}</p>
                            <p>Primary Contact: {job.primarycontact}</p>
                            <p>Job Link: {job.joblink}</p>
                            {/* Implement or adjust DateMutation as needed */}
                            <p>Company Responded: {job.companyresponded ? 'Yes' : 'No'}</p>
                            <p>Company Rejected: {job.companyrejected ? 'Yes' : 'No'}</p>
                        </div>
                    ))}
                </Slider>
            )}
        </div>
    );
};