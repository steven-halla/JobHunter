import React, { useEffect, useState, useContext } from 'react';
import {JobsContext} from "../services/jobcontext";
import {Interview} from "../models/Job";
import {DateMutation} from "../common/DateMutation";
import styled from "styled-components";

type InterviewData = {
    jobId: number;
    userId: number;
    companyname: string;
    interviewdate: Date | null;
    interviewernames: string;
    interviewnotes: string;
    meetingLink: string;
    interviews: Interview[];
};
export const AllInterviews = () => {

    const { jobs } = useContext(JobsContext);
    const [allInterviewData, setAllInterviewData] = useState<InterviewData[]>([]);

    useEffect(() => {
        const aggregatedInterviewData = jobs
            .filter(job => typeof job.meetingLink === 'string' && job.meetingLink) // Ensure meetingLink is a string and not empty
            .map(job => ({
                jobId: job.id,
                userId: job.userid,
                companyname: job.companyname,
                interviewdate: typeof job.interviewdate === 'function' ? null : job.interviewdate,
                interviewernames: typeof job.interviewernames === 'function' ? '' : job.interviewernames,
                interviewnotes: typeof job.interviewnotes === 'function' ? '' : job.interviewnotes,
                meetingLink: job.meetingLink as string, // Cast to string to satisfy TypeScript
                interviews: job.interviews
            }));

        setAllInterviewData(aggregatedInterviewData);

        console.log("Filtered Interview Data:", aggregatedInterviewData);
    }, [jobs]);


    const formatDate = (date: string | number | Date | null) => {
        if (date instanceof Date) {
            return date.toLocaleDateString();
        } else if (date) {
            // Attempt to parse the date if it's a string or another type
            try {
                return new Date(date).toLocaleDateString();
            } catch (e) {
                console.error('Error parsing date:', e);
            }
        }
        return 'Date not available';
    };

    return (
        <AllInterviewsWrapperDiv>
            <CardDiv>
                <h2>All Interviews</h2>
                {allInterviewData.map((data, index) => (
                    <JobCard key={index}>
                        <p>Company Name: {data.companyname}</p>
                        <p>Interviewer Names: {data.interviewernames}</p>
                        <p>Interview Notes: {data.interviewnotes}</p>
                        <p>Meeting Link: <a href={data.meetingLink} target="_blank" rel="noopener noreferrer">{data.meetingLink}</a></p>
                        <p>Interview Date: {
                            data.interviewdate
                                ? DateMutation(typeof data.interviewdate === 'string' ? data.interviewdate : data.interviewdate.toISOString())
                                : 'Date not available'
                        }</p>
                    </JobCard>
                ))}
            </CardDiv>
        </AllInterviewsWrapperDiv>
    );
};

const AllInterviewsWrapperDiv = styled.div`
  display: flex;
  height: 100%; // Full height of the viewport
  width: 100%; // Full width of the viewport
  background-color: rgba(88,104,169,0.86);
  justify-content: center; // Centers child horizontally
  align-items: center; // Centers child vertically
`;

const CardDiv = styled.div`
  display: flex;
  height: 100%; // Half of the parent's height
  width: 50%; // Half of the parent's width
  background-color: rgba(129,169,144,0.86)
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;


const JobCard = styled.div`
  background-color: white;
  padding: 20px;
  margin: 10px;
  border-radius: 8px;
  width: calc(50% - 20px); // Adjust width as needed

  /* Adding box shadow on left, right, and bottom sides */
  box-shadow:
          -4px 0 8px -2px rgba(0, 0, 0, 0.2), /* Left shadow */
          4px 0 8px -2px rgba(0, 0, 0, 0.2),  /* Right shadow */
          0 4px 8px -2px rgba(0, 0, 0, 0.2);  /* Bottom shadow */
  // Additional styling...
`;
