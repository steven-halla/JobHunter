import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { JobsContext } from '../services/jobcontext';
import styled from "styled-components";
import { deviceProfile} from "../common/ScreenSizes";
import {Interview, Job} from "../models/Job";
import TextField from '@mui/material/TextField';
import {TextFieldProps} from "@mui/material";
import Button from "@mui/material/Button";
import {colors, fonts} from "../common/CommonStyles";

export const InterviewSecured = () => {
    const { meetingLink,setMeetingLink,
        interviewnotes, setInterviewNotes, interviewernames,
        setInterviewerNames, interviewdate,
        setInterviewDate, jobs,
        interviewbegintime, setInterviewBeginTime, interviewendtime,
        setInterviewEndTime } = useContext(JobsContext);
    const { jobId } = useParams<{ jobId: string }>();
    const [currentJob, setCurrentJob] = useState<Job | undefined>(undefined);
    const [interviews, setInterviews] = useState<Interview[]>([]);

    useEffect(() => {
        const jobIdNumber = jobId ? parseInt(jobId, 10) : null;
        if (jobIdNumber && jobs.length > 0) {
            const selectedJob = jobs.find(j => j.id === jobIdNumber);

            if (selectedJob) {
                const {
                    interviews,
                    meetingLink,
                    interviewnotes,
                    interviewernames,
                    interviewdate,
                } = selectedJob;

                let initialBeginTime: Date | null;
                if (typeof selectedJob.interviewbegintime === 'string') {
                    initialBeginTime = parseTimeStringToDate(selectedJob.interviewbegintime);
                } else if (selectedJob.interviewbegintime instanceof Date) {
                    initialBeginTime = selectedJob.interviewbegintime;
                } else {
                    initialBeginTime = null;
                }
                setInterviewBeginTime(initialBeginTime);

                let initialEndTime: Date | null;
                if (typeof selectedJob.interviewendtime === 'string') {
                    initialEndTime = parseTimeStringToDate(selectedJob.interviewendtime);
                } else if (selectedJob.interviewendtime instanceof Date) {
                    initialEndTime = selectedJob.interviewendtime;
                } else {
                    initialEndTime = null;
                }

                setInterviewEndTime(initialEndTime);
                setCurrentJob(selectedJob);
                setInterviews(interviews || []);
                setMeetingLink(meetingLink || '');
                setInterviewNotes(interviewnotes || '');
                setInterviewerNames(interviewernames || '');
                setInterviewDate(interviewdate || null);
            }
        }
        console.log(jobs);
    }, [jobs, jobId]);

    function parseTimeStringToDate(timeString: string | null): Date | null {
        if (!timeString) {
            return null;
        }

        const [hours, minutes] = timeString.split(':').map(Number);
        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        return date;
    }

    function formatTimeForInput(date: Date | null): string {
        if (!date || !(date instanceof Date) || isNaN(date.getTime())) return '';
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    function formatDateForInput(date: Date) {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!currentJob) return;
        let hasError = false;

        if (!interviewernames || interviewernames.trim() === '') {
            setInterviewerNamesError("Interviewer names cannot be blank");
            hasError = true;
        }
        else if (interviewernames.trim().length < 3) {
            setInterviewerNamesError("Interviewer names must be at least 3 characters");
            hasError = true;
        }

        else if (interviewernames.length > 100) {
            setInterviewerNamesError("Interviewer names must be no more than 100 characters");
            hasError = true;
        } else {
            setInterviewerNamesError(null);
        }

        if (!meetingLink || meetingLink.trim() === '') {
            setMeetingLinkError("Meeting link cannot be blank");
            hasError = true;
        }
        else if (meetingLink.trim().length < 3) {
            setMeetingLinkError("Meeting link must be at least 3 characters long");
            hasError = true;
        }

        else if (meetingLink.length > 1000) {
            setMeetingLinkError("Meeting link must be no more than 1000 characters long");
            hasError = true;
        } else {
            setMeetingLinkError(null);
        }

        if (!interviewdate) {
            setInterviewDateError("Interview date cannot be empty");
            hasError = true;
        } else {
            setInterviewDateError(null);
        }

        if (!interviewbegintime) {
            setInterviewBeginTimeError("Interview date cannot be empty");
            hasError = true;
        } else {
            setInterviewBeginTimeError(' ');
        }

        if (!interviewbegintime) {
            setInterviewBeginTimeError("Start time cannot be empty");
            hasError = true;
        } else {
            setInterviewBeginTimeError(null);
        }

        if (!interviewendtime) {
            setInterviewEndTimeError("End time cannot be empty");
            hasError = true;
        } else {
            setInterviewEndTimeError(null);
        }

        if (!interviewnotes || interviewnotes.trim() === '') {
            setInterviewNotesError("Interview notes cannot be empty");
            hasError = true;
        } else if (interviewnotes.trim().length < 3) {
            setInterviewNotesError("Interview notes must be at least 3 characters");
            hasError = true;
        } else if (interviewnotes.length > 1000) {
            setInterviewNotesError("Interview notes must be no more than 1000 characters");
            hasError = true;
        } else {
            setInterviewNotesError(null);
        }

        if (hasError) {
            return;
        }

        function formatTime(date: Date): string {
            if (!(date instanceof Date)) {
                return '';
            }
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`;
        }

        const formattedBeginTime = interviewbegintime instanceof Date ? formatTime(interviewbegintime) : '';
        const formattedEndTime = interviewendtime instanceof Date ? formatTime(interviewendtime) : '';

        try {
            const response = await fetch(`http://localhost:8080/api/jobs/update/${currentJob.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    meetingLink: meetingLink,
                    interviewnotes: interviewnotes,
                    interviewernames: interviewernames,
                    interviewdate: interviewdate,
                    interviewbegintime: formattedBeginTime, // Use formatted time
                    interviewendtime: formattedEndTime,     // Use formatted time
                    companyresponded: true,
                }),
            });

            if (response.ok) {
                alert("Interview updated"); // Success message
                window.location.href = "/jobviewall"; // Redirect to '/jobviewall' route
            } else {
                // Handle API response error
                console.error('Failed to update job interview. Server responded with:', response.status);
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

    const [meetingLinkError, setMeetingLinkError] = useState<string | null>(null);
    const [interviewerNamesError, setInterviewerNamesError] = useState<string | null>(null);
    const [interviewDateError, setInterviewDateError] = useState<string | null>(null);
    const [interviewBeginTimeError, setInterviewBeginTimeError] = useState<string | null>(null);
    const [interviewEndTimeError, setInterviewEndTimeError] = useState<string | null>(null);
    const [interviewNotesError, setInterviewNotesError] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(window.matchMedia(deviceProfile.mobile).matches);
    const [isLaptop, setIsLaptop] = useState(window.matchMedia(deviceProfile.laptop).matches);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.matchMedia(deviceProfile.mobile).matches);
            setIsLaptop(window.matchMedia(deviceProfile.laptop).matches);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    // @ts-ignore
    // @ts-ignore
    return (
        <InterviewSecuredWrapperDiv>
            <MyBox>
                <h1>{currentJob?.companyname}</h1>
            <form onSubmit={handleFormSubmit}>
                <InterviewInfoDiv>
                    <StyledTextField
                        type="text"
                        variant="outlined"
                        placeholder="Interviewers" // Using placeholder instead of label
                        value={interviewernames}
                        onChange={(e) => setInterviewerNames(e.target.value)}
                    />
                    {interviewerNamesError && <ErrorMessage>{interviewerNamesError}</ErrorMessage>}

                    <StyledTextField
                        type="text"
                        variant="outlined"
                        placeholder="Meeting Link" // Using placeholder instead of label
                        value={meetingLink}
                        onChange={(e) => setMeetingLink(e.target.value)}
                    />
                    {meetingLinkError && <ErrorMessage>{meetingLinkError}</ErrorMessage>}

                    <StyledTextField
                        type="date"
                        variant="outlined"
                        placeholder="Interview date" // Using placeholder instead of label
                        value={interviewdate ? formatDateForInput(addOneDay(new Date(interviewdate))) : ''}
                        onChange={(e) => {
                            const selectedDate = e.target.value ? new Date(e.target.value) : null;
                            setInterviewDate(selectedDate);
                        }}
                    />
                    {interviewDateError && <ErrorMessage>{interviewDateError}</ErrorMessage>}

                    <StyledTextField
                        type="time"
                        variant="outlined"
                        placeholder="Start Time" // Using placeholder instead of label
                        value={interviewbegintime ? formatTimeForInput(interviewbegintime) : ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            console.log("Selected begin time (string):", e.target.value);
                            const timeValue = e.target.value ? parseTimeStringToDate(e.target.value) : null;
                            console.log("Parsed begin time (Date object):", timeValue);
                            setInterviewBeginTime(timeValue);
                        }}
                        title="You can either: Hit the up/down arrows to set the time. Or click the Icon to the far right to access the menu."
                    />
                    {interviewBeginTimeError && <ErrorMessage>{interviewBeginTimeError}</ErrorMessage>}

                    <StyledTextField
                        type="time"
                        variant="outlined"
                        placeholder="End Time" // Using placeholder instead of label
                        value={interviewendtime ? formatTimeForInput(interviewendtime) : ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            console.log("Selected end time (string):", e.target.value);
                            const timeValue = parseTimeStringToDate(e.target.value);
                            console.log("Parsed end time (Date object):", timeValue);
                            setInterviewEndTime(timeValue);
                        }}
                        title="You can either: Hit the up/down arrows to set the time. Or click the Icon to the far right to access the menu."
                    />
                    {interviewEndTimeError && <ErrorMessage>{interviewEndTimeError}</ErrorMessage>}

                        <StyledTextField
                            placeholder="Notes for your upcoming interview.'" // Using placeholder instead of label
                            multiline
                            rows={4}
                            variant="outlined"
                            fullWidth
                            value={interviewnotes}
                            onChange={(e: { target: { value: React.SetStateAction<string>; }; }) =>
                                setInterviewNotes(e.target.value)}
                        />
                    {interviewNotesError && <ErrorMessage>{interviewNotesError}</ErrorMessage>}

                    <SubmitButton
                        sx={{
                            borderRadius: 10,
                            background: 'linear-gradient(to right, #00C9FF, #00B4D8)',
                            border: '1px solid #007BFF',
                            '&:hover': {
                                background: 'linear-gradient(to left, #00C9FF, #00B4D8)',
                                boxShadow: '0 0 10px #00C9FF',
                            },
                            textTransform: 'none',
                            fontSize: '1.6rem',
                            fontWeight: 'bold',
                            fontFamily: "'Times New Roman', serif", // Corrected fontFamily format
                        }}
                        variant="contained"
                        type="submit"
                    >
                        Submit
                    </SubmitButton>
                </InterviewInfoDiv>
            </form>

            </MyBox>

            {/*<Footer />*/}

        </InterviewSecuredWrapperDiv>
    );
};

const ErrorMessage = styled.div`
  color: ${colors.errorOrangeColor};
  font-family: 'Roboto', sans-serif;
  font-size: ${fonts.InputFontREM};
  text-align: center;
  width: 100%; 
  display: block;
  margin: 0 auto; 
  padding-bottom: 10px;
`;

const SubmitButton = styled(Button)`
  height: 9vh;
  width: 23vw;
  display: flex;
  padding-bottom: 70px;

  @media ${deviceProfile.mobile} {
    width: 45vw;
    height: 7vh;
  }
`;

const MyBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  //background-color: ${colors.FormContainer};
  background-color: purple;
  width: 30%;
  box-shadow: -4px 0 8px -2px rgba(0, 0, 0, 0.2),
  4px 0 8px -2px rgba(0, 0, 0, 0.2),
  0 4px 8px -2px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  padding-bottom: 20px; 
  padding-top: 15px;
  margin-bottom: 3%;
  
  @media ${deviceProfile.mobile} {
    width: 70%;
  }

    h1 {
      padding-bottom: 20px; /* Adjust this value as needed */
    }
` ;

const BaseStyledTextField = styled(TextField)`

  & .MuiFilledInput-input {
    height: 20px;
  }
  
  & .MuiInputBase-input { 
    font-size: ${fonts.InputFontREM};
    font-family: ${fonts.InputFontFamily};
  }

  & .MuiInputBase-input::placeholder { 
    font-size: ${fonts.InputFontREM};
    font-family: ${fonts.InputPlaceHolderFontFamily};
  }

  & input[type='date']::-webkit-calendar-picker-indicator {
    position: absolute;
    right: 10px; 
  }

  & input[type='time']::-webkit-calendar-picker-indicator {
    position: absolute;
    right: 10px;
  }
`;

const StyledTextField: React.FC<TextFieldProps> = (props) => {
    return (
        <BaseStyledTextField
            variant="outlined"
            type="text"
            size="small"
            style={{ width: '80%', marginBottom: '4%', backgroundColor: 'white' ,}}
            {...props}
        />
    );
};


const InterviewSecuredWrapperDiv = styled.div`
  background-color: ${colors.AppBackGroundColor};
  justify-content: center;
  align-items: center;
  display: flex;
  
  
  @media ${deviceProfile.mobile} {
    height: 100vh;
    width: 100vw;
  }

  @media ${deviceProfile.laptop} {
    display: flex;
    align-items: center;
    height: 100vh;
    width: 100%;
  }
`;

const InterviewInfoDiv = styled.div`
  
  @media ${deviceProfile.mobile} {
    display: flex;
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
  
  @media ${deviceProfile.laptop} {
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
  height: 2vh; // Adjust the height as needed
  background-color: ${colors.AppBackGroundColor};
  position: absolute; // Changed to absolute
  bottom: 0;
  width: 100%;

  @media ${deviceProfile.mobile} {
    height: 20vh;
  }
`;


