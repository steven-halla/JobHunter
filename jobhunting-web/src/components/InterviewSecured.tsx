import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { JobsContext } from '../services/jobcontext';
import styled from "styled-components";
import { device } from "../common/ScreenSizes";
import {Interview, Job} from "../models/Job";

// interface Interview {
//     secured: boolean;
//     meetinglink: string;
//     interviewnotes: string;
//     interviewernames: string;
//     interviewdate: Date | null;
//     interviewtime: string;
// }

export const InterviewSecured = () => {
    const { job, meetingLink,setMeetingLink, interviewnotes, setInterviewNotes, interviewernames, setInterviewerNames, interviewdate, setInterviewDate, setJob, jobs, setJobs } = useContext(JobsContext);
    const { jobId } = useParams<{ jobId: string }>();
    const [currentJob, setCurrentJob] = useState<Job | undefined>(undefined);
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [interviewCreated, setInterviewCreated] = useState<boolean>(false);
    const [needsUpdate, setNeedsUpdate] = useState<boolean>(false);






    useEffect(() => {
        const jobIdNumber = jobId ? parseInt(jobId, 10) : null;
        if (jobIdNumber && jobs.length > 0) {
            const selectedJob = jobs.find(j => j.id === jobIdNumber);
            if (selectedJob) {
                setCurrentJob(selectedJob);
                setInterviews(selectedJob.interviews || []);

                // Set the state variables correctly
                setMeetingLink(selectedJob.meetingLink || '');
                setInterviewNotes(selectedJob.interviewnotes || '');
                setInterviewerNames(selectedJob.interviewernames || '');
                setInterviewDate(selectedJob.interviewdate || null);


            }
        }
    }, [jobs, jobId]);


    // When receiving the date from the server, parse it as UTC
    const utcDateFromServer = "2023-09-20T00:00:00.000Z"; // Replace with the actual date from the server
    const localDate = utcDateFromServer ? new Date(utcDateFromServer) : null;

// Display the localDate in the UI

    function formatDateForInput(date: Date) {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
        const dd = String(date.getDate()).padStart(2, '0');

        return `${yyyy}-${mm}-${dd}`;
    }


    const handleFormSubmit = async () => {
        if (!currentJob) return;

        console.log("Saving all interviews to the server:", interviews);

        try {
            const response = await fetch(`http://localhost:8080/api/jobs/update/${jobId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },

                body: JSON.stringify({
                    meetingLink: meetingLink,
                    interviewnotes: interviewnotes,
                    interviewernames: interviewernames,
                    interviewdate: interviewdate,
                }),
            });

            if (response.ok) {
                // Update the global jobs state
                setJobs((prevJobs) =>
                    prevJobs.map((j) =>
                        j.id === currentJob.id ? { ...j, interviews } : j
                    )
                );

                // Update the local job state
                setCurrentJob((prev) =>
                    prev ? { ...prev, interviews } : prev
                );
                setMeetingLink(meetingLink);
                setInterviewNotes(interviewnotes);
                setInterviewerNames(interviewernames);
                setInterviewDate(interviewdate);


            } else {
                console.error('Failed to update job interview');
            }
        } catch (error) {
            console.error('Failed to update job interview:', error);
        }
    };







    function addOneDay(date: string | number | Date) {
        const adjustedDate = new Date(date);
        adjustedDate.setDate(adjustedDate.getDate() + 1); // Add 1 day
        return adjustedDate;
    }




    return (
        <InterviewSecuredWrapperDiv>
            <TitleDiv>
                <h1>Company: {currentJob?.companyname}</h1>
            </TitleDiv>

            <form onSubmit={handleFormSubmit}>
                <InterviewInfoDiv>
                    <input
                        type="text"
                        placeholder="Interviewer Names"
                        value={interviewernames}
                        onChange={(e) => setInterviewerNames(e.target.value)}
                    />

                    <input
                        type="text"
                        placeholder="Meeting Link"
                        value={meetingLink}
                        onChange={(e) => setMeetingLink(e.target.value)}
                    />



                    <input
                        type="date"
                        value={interviewdate ? formatDateForInput(addOneDay(new Date(interviewdate))) : ''}
                        onChange={(e) => {
                            const selectedDate = e.target.value ? new Date(e.target.value) : null;
                            setInterviewDate(selectedDate);
                        }}
                    />



                    <textarea
                        placeholder="Interview Notes"
                        value={interviewnotes }
                        onChange={(e) => setInterviewNotes(e.target.value)}
                    />
                </InterviewInfoDiv>
                <SaveAllButtonDiv>
                    <button type="submit">Save Interview Details</button>
                </SaveAllButtonDiv>
            </form>

            <Footer />
        </InterviewSecuredWrapperDiv>
    );

};



const InterviewSecuredWrapperDiv = styled.div`
  // Add your styling here
  // background-color: red;

  @media ${device.mobile} {

    background-color: red;
    height: 100vh;
    width: 100vw;

  }
`;

const TitleDiv = styled.div`
  // Add your styling here
  // background-color: red;
  display: flex;

  @media ${device.mobile} {

    background-color: blue;
    height: 10vh;
    width: 100vw;
    justify-content: center;
    align-items: center;
  }
`;

const SaveAllButtonDiv = styled.div`
  // Add your styling here
  // background-color: red;
  display: flex;

  @media ${device.mobile} {
    height: 10vh;
    width: 100vw;
    justify-content: center;
    align-items: center;
    background-color: purple;

  }
`;

const AddInterviewButtonDiv = styled.div`
  // Add your styling here
  // background-color: red;
  display: flex;

  @media ${device.mobile} {
    height: 10vh;
    width: 100vw;
    justify-content: center;
    align-items: center;
    background-color: green;

  }
`;

const InterviewInfoDiv = styled.div`
  // Add your styling here
  // background-color: red;
  display: flex;

  @media ${device.mobile} {
    display: flex;
    height: 25vh;
    width: 100vw;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-bottom: 20px;

    button {
      margin-top: 5px;
    }

    input {
      margin-top: 5px;
    }

    textarea {
      margin-top: 5px;
    }

    // Select the even child elements
    &:nth-child(even) {
      background-color: skyblue;
    }

    // Select the odd child elements
    &:nth-child(odd) {
      background-color: pink;
    }

  }
`;

const Footer = styled.div`
  // Add your styling here
  // background-color: red;
  display: flex;

  @media ${device.mobile} {

    background-color: black;
    height: 10vh;
    width: 100vw;
    bottom: 0;

  }
`;