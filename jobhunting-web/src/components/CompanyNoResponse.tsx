import React, { useContext } from "react";
import {JobsContext} from "../services/jobcontext";
import styled from 'styled-components';
import { Link } from 'react-router-dom';


const TWO_DAYS_MS = 48 * 60 * 60 * 1000;

export const CompanyNoResponse = () => {
    const { jobs, updateJobResponded, dateApplied } = useContext(JobsContext);

    // Get current date
    const currentDateMs = new Date().getTime();

    // Filter jobs older than 48 hours
    // Filter jobs older than 48 hours and sort by date applied in descending order
    const olderJobs = jobs.filter(job => {
        const timeDelta = currentDateMs - new Date(job.dateapplied).getTime();
        return timeDelta > TWO_DAYS_MS && !job.companyresponded;
    }).sort((a, b) => new Date(b.dateapplied).getTime() - new Date(a.dateapplied).getTime());


    console.log("Older Jobs:", olderJobs);  // Debugging line
    //
    // const handleCheckboxChange = (jobId: number, checked: boolean) => {
    //     updateJobResponded(jobId, checked);
    //     // alert("Congrats on getting them to respond!")
    // };

    const handleCheckboxChange = (jobId: number, checked: boolean) => {
        if (checked) { // If the user is trying to check the box
            const isConfirmed = window.confirm("Confirm company responded?");
            if (isConfirmed) {
                updateJobResponded(jobId, true);
                // Other actions after confirmation, if needed
            }
        } else {
            updateJobResponded(jobId, false);
            // Other actions after unchecking, if needed
        }
    };


    return(
        <JobContainer>
            <p>These are the companies that hate you so much that they want nothing to do with you</p>
            <Link to="/">Go to Home page</Link>

            <JobHeader>
                <span>company name</span>
                <span>Company description </span>
                <span>Job Poster</span>
                <span>Date Applied</span>
                <span>Job Link</span>
                <span>Company Website Link</span>
                <span>Company Responded</span>
            </JobHeader>
            {olderJobs.map((job) => (
                <JobRow key={job.id}>
                    {/*<span>{new Date(job.dateApplied).toISOString().split('T')[0]}</span>*/}
                    <span>{job.companyname}</span>
                    <span>{job.description}</span>
                    <span>{job.jobposter}</span>
                    <span>{new Date(job.dateapplied).toISOString().split('T')[0]}</span>
                    <span>
                        <a href={job.joblink} target="_blank" rel="noreferrer">Link</a>
                    </span>
                    <span>
                        <a href={job.companywebsitelink} target="_blank" rel="noreferrer">Link</a>
                    </span>
                    <span>
                        <input
                            type="checkbox"
                            checked={job.companyresponded}
                            onChange={(event) => handleCheckboxChange(job.id, event.target.checked)}
                        />
                    </span>
                </JobRow>
            ))}
        </JobContainer>
    );
};

const JobContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const JobRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 80%;
  padding: 10px 0;

  span {
    width: 13%;  // Adjusted width for 6 columns 
  }
`;

const JobHeader = styled(JobRow)`
  font-weight: bold;
`;
