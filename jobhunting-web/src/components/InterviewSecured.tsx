import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { JobsContext } from '../services/jobcontext';
import styled from "styled-components";
import { device } from "../common/ScreenSizes";
import {Interview, Job} from "../models/Job";
import TextField from '@mui/material/TextField';

export const InterviewSecured = () => {
    const { meetingLink,setMeetingLink, interviewnotes, setInterviewNotes, interviewernames, setInterviewerNames, interviewdate, setInterviewDate, setJob, jobs, setJobs } = useContext(JobsContext);
    const { jobId } = useParams<{ jobId: string }>();
    const [currentJob, setCurrentJob] = useState<Job | undefined>(undefined);
    const [interviews, setInterviews] = useState<Interview[]>([]);

    useEffect(() => {
        const jobIdNumber = jobId ? parseInt(jobId, 10) : null;
        if (jobIdNumber && jobs.length > 0) {
            const selectedJob = jobs.find(j => j.id === jobIdNumber);
            if (selectedJob) {
                setCurrentJob(selectedJob);
                setInterviews(selectedJob.interviews || []);
                setMeetingLink(selectedJob.meetingLink || '');
                setInterviewNotes(selectedJob.interviewnotes || '');
                setInterviewerNames(selectedJob.interviewernames || '');
                setInterviewDate(selectedJob.interviewdate || null);
            }
        }
    }, [jobs, jobId]);

    function formatDateForInput(date: Date) {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
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
                setJobs((prevJobs) =>
                    prevJobs.map((j) =>
                        j.id === currentJob.id ? { ...j, interviews } : j
                    )
                );
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
                    <label>
                        Interviewer Names
                        <input
                            type="text"
                            placeholder="Interviewer Names"
                            value={interviewernames}
                            onChange={(e) => setInterviewerNames(e.target.value)}
                        />
                    </label>
                    <label>
                        Meeting Link
                        <input
                            type="text"
                            placeholder="Meeting Link"
                            value={meetingLink}
                            onChange={(e) => setMeetingLink(e.target.value)}
                        />
                    </label>
                    <label>
                        Interview Date
                        <input
                            type="date"
                            value={interviewdate ? formatDateForInput(addOneDay(new Date(interviewdate))) : ''}
                            onChange={(e) => {
                                const selectedDate = e.target.value ? new Date(e.target.value) : null;
                                setInterviewDate(selectedDate);
                            }}
                        />
                    </label>
                    <label>
                        Interview Notes
                        <StyledTextField
                            multiline
                            rows={4}
                            variant="outlined"
                            fullWidth
                            placeholder="Interview Notes"
                            value={interviewnotes}
                            onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setInterviewNotes(e.target.value)}
                        />
                    </label>
                </InterviewInfoDiv>
                <SaveAllButtonDiv>
                    <button type="submit">Save Interview Details</button>
                </SaveAllButtonDiv>
            </form>
            <Footer />
        </InterviewSecuredWrapperDiv>
    );
};

const StyledTextField = styled(TextField)`
  @media ${device.laptop} {
    && {
      width: 140%;
    }
  }
`;

const InterviewSecuredWrapperDiv = styled.div`
  @media ${device.mobile} {
    height: 100vh;
    width: 100vw;
  }

  @media ${device.laptop} {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
  }
`;

const TitleDiv = styled.div`
  display: flex;

  @media ${device.mobile} {
    height: 10vh;
    width: 100vw;
    justify-content: center;
    align-items: center;
  }

  @media ${device.laptop} {
    height: 10vh;
    justify-content: center;
    align-items: center;
    margin-bottom: 5%;
    position: absolute;
    top: 70px;
    left: 0; 
    width: 100%;
  }
`;

const SaveAllButtonDiv = styled.div`
  display: flex;

  @media ${device.mobile} {
    height: 10vh;
    width: 100vw;
    justify-content: center;
    align-items: center;
  }

  @media ${device.laptop} {
    margin-top: 30px;
    height: 40px;
    width: 100%;       
    align-self: center;
    justify-content: center;
  }
`;

const InterviewInfoDiv = styled.div`
  display: flex;
  flex-direction: column;
  
  label {
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: start;
    width: 100%;
  }

  input, textarea {
    margin-top: 5px;
  }

 @media ${device.mobile} {
   display: flex;
   margin-left: 10vw;
   width: 80vw;
    flex-direction: column;
    justify-content: center; 
    align-items: center;       

    label {
      align-items: center;  
    }

    input, textarea {
      width: 60%;           
    }
  }


  @media ${device.laptop} {
    width: 30vw;
    display: flex;
    flex-direction: column;
    justify-content: center;   
    align-items: center;     

    label {
      width: 86%;  
      align-items: center;
    }

    input, textarea {
      width: 80%;  
    }
`;

const Footer = styled.div`
  display: flex;

  @media ${device.mobile} {
    height: 10vh;
    width: 100vw;
    bottom: 0;
  }
`;

