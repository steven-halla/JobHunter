import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { JobsContext } from '../services/jobcontext';
import styled from "styled-components";
import {device, deviceHome} from "../common/ScreenSizes";
import {Interview, Job} from "../models/Job";
import TextField from '@mui/material/TextField';
import {TextFieldProps} from "@mui/material";
import Button from "@mui/material/Button";
import {colors, fonts} from "../common/CommonStyles";


//need to include time along with interview date!!!
//also need to include ways to send notification
//home page we can do an useEffect hook, setting global state
export const InterviewSecured = () => {
    const { meetingLink,setMeetingLink,
        interviewnotes, setInterviewNotes, interviewernames,
        setInterviewerNames, interviewdate,
        setInterviewDate, setJob, jobs, setJobs,
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
                // Define variables for selected job properties
                const {
                    interviewbegintime,
                    interviews,
                    meetingLink,
                    interviewnotes,
                    interviewernames,
                    interviewdate,
                    interviewendtime
                } = selectedJob;

                // Set state variables with optional chaining
                // setInterviewBeginTime(interviewbegintime ? parseTimeStringToDate(interviewbegintime) : null);
                // Assuming you want to store the date in ISO string format
                // setInterviewBeginTime(interviewbegintime ? parseTimeStringToDate(interviewbegintime) : null);

              //best way so far keep this
                // const initialBeginTime = parseTimeStringToDate(selectedJob.interviewbegintime);
                // setInterviewBeginTime(initialBeginTime);
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
                // setInterviewEndTime(interviewendtime || null);

                console.log("The times is " + interviewbegintime);
                console.log("The date is " + interviewdate);
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
        console.log("jdsoifjdsf;jdsafjkldsljasflj;dsalfjasdjk;;sfjdak " + interviewbegintime)

        return `${hours}:${minutes}:${seconds}`; // Format as "HH:mm:ss"
    }





    function formatDateForInput(date: Date) {
        const yyyy = date.getFullYear();
        console.log("Hiiiiiiiii")
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }


    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // Prevent default form submission behavior

        if (!currentJob) return;
        let hasError = false;

        if (!interviewernames || interviewernames.trim() === '') {
            setInterviewerNamesError("Interviewer names cannot be blank");
            hasError = true;
        }
        // Check if interviewer names input is less than minimum length
        else if (interviewernames.trim().length < 3) {
            setInterviewerNamesError("Interviewer names must be at least 3 characters");
            hasError = true;
        }
        // Check if interviewer names input exceeds maximum length
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
        // Check if meeting link input is less than minimum length
        else if (meetingLink.trim().length < 3) {
            setMeetingLinkError("Meeting link must be at least 3 characters long");
            hasError = true;
        }
        // Check if meeting link input exceeds maximum length
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





        // Add similar validation for other fields...
        // Make sure to set the corresponding error state and update `hasError` as needed

        if (hasError) {
            return;
        }

        console.log("Saving all interviews to the server:", interviews);




        // Format interviewbegintime and interviewendtime to "HH:mm:ss" format
        // const formattedBeginTime = interviewbegintime
        //     ? `${String(interviewbegintime.getHours()).padStart(2, '0')}:${String(interviewbegintime.getMinutes()).
        //     padStart(2, '0')}:${String(interviewbegintime.getSeconds()).padStart(2, '0')}`
        //     : '';
        //
        // const formattedEndTime = interviewendtime
        //     ? `${String(interviewendtime.getHours()).padStart(2, '0')}:${String(interviewendtime.getMinutes()).
        //     padStart(2, '0')}:${String(interviewendtime.getSeconds()).padStart(2, '0')}`
        //     : '';


        // Custom function to format a Date object to "HH:mm:ss" format
        function formatTime(date: Date): string {
            if (!(date instanceof Date)) {
                return '';
            }
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${hours}:${minutes}:${seconds}`;
        }

// Use the formatTime function to format interviewbegintime
        const formattedBeginTime = interviewbegintime instanceof Date ? formatTime(interviewbegintime) : '';

// Use the formatTime function to format interviewendtime
        const formattedEndTime = interviewendtime instanceof Date ? formatTime(interviewendtime) : '';

// ...rest of your code

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

            // Rest of your code...
        } catch (error) {
            console.error('Failed to update job interview:', error);
        }
    };





    function addOneDay(date: string | number | Date) {
        const adjustedDate = new Date(date);
        adjustedDate.setDate(adjustedDate.getDate() + 1); // Add 1 day
        return adjustedDate;
    }

    // function parseTimeStringToDate(timeString: string): Date {
    //     const date = new Date();
    //     let [hours, minutes, seconds] = timeString.split(':').map(Number);
    //
    //     // If seconds are not provided, default to 0
    //     seconds = isNaN(seconds) ? 0 : seconds;
    //
    //     if (!isNaN(hours) && !isNaN(minutes)) {
    //         date.setHours(hours, minutes, seconds, 0); // Set hours, minutes, and seconds
    //         return date;
    //     } else {
    //         return new Date(); // Return current date or a default date if parsing fails
    //     }
    // }



    const [meetingLinkError, setMeetingLinkError] = useState<string | null>(null);
    const [interviewerNamesError, setInterviewerNamesError] = useState<string | null>(null);
    const [interviewDateError, setInterviewDateError] = useState<string | null>(null);
    const [interviewBeginTimeError, setInterviewBeginTimeError] = useState<string | null>(null);
    const [interviewEndTimeError, setInterviewEndTimeError] = useState<string | null>(null);
    const [interviewNotesError, setInterviewNotesError] = useState<string | null>(null);







    // @ts-ignore
    // @ts-ignore
    return (
        <InterviewSecuredWrapperDiv>

            <MyBox>


            {/*<TitleDiv>*/}
                <h1>{currentJob?.companyname}</h1>
            {/*</TitleDiv>*/}
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
            <Footer />
            </MyBox>

        </InterviewSecuredWrapperDiv>
    );
};

const ErrorMessage = styled.div`
  color: ${colors.errorRedColor};
  font-family: 'Roboto', sans-serif;
  font-size: ${fonts.InputFontREM};
  text-align: center; // Center align the text
  width: 100%; // Ensure the div takes the full width
  display: block; // Display as block element
  margin: 0 auto; // Auto margin for horizontal centering
`;

const SubmitButton = styled(Button)`
//color: green;
  height: 9vh;
  width: 23vw;
  display: flex;
  padding-bottom: 70px;
  //margin-bottom: 50px;
  //background-color: yellow;
  @media ${deviceHome.mobile} {
    //background-color: red;
    width: 30vw;
    height: 7vh;
  }


`;


const MyBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  //background-color: grey;grey
  background-color: ${colors.FormContainer};
  //background-color: red;

  width: 30%;
  //height: 100%;
  box-shadow: -4px 0 8px -2px rgba(0, 0, 0, 0.2),
  4px 0 8px -2px rgba(0, 0, 0, 0.2),
  0 4px 8px -2px rgba(0, 0, 0, 0.2);
  border-radius: 10px; /* Adjust this value to get the desired roundness */
  padding-bottom: 20px; /* Adjust this value as needed */
  padding-top: 15px; /* Adjust this value as needed */
  margin-bottom: 4%;

  @media ${device.mobile} {
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
  & .MuiInputBase-input { // Target the input base for styling
    //font-family: 'Helvetica Neue', Arial, sans-serif;
    //font-family: 'Helvetica Neue', Arial, sans-serif;
    //font-size: 1.2rem;
    font-size: ${fonts.InputFontREM};
    font-family: ${fonts.InputFontFamily};

    //color: red;
    
  }

  & .MuiInputBase-input::placeholder { // Target the placeholder with increased specificity
    //font-family: 'Roboto', sans-serif;
    font-size: ${fonts.InputFontREM};
    font-family: ${fonts.InputPlaceHolderFontFamily};

    //font-size: 1.2rem;
    //color: red;
  }

  & input[type='date']::-webkit-calendar-picker-indicator {
    position: absolute;
    right: 10px; // Adjust as needed
  }

  & input[type='time']::-webkit-calendar-picker-indicator {
    position: absolute;
    right: 10px;  // Adjust as needed
  }



  //.MuiOutlinedInput-notchedOutline {
  //  cursor: pointer; /* Change the cursor to a hand pointer on hover */
  //
  //}


`;

const StyledTextField: React.FC<TextFieldProps> = (props) => {
    // Ensure the label is a string, default to an empty string if not
    const placeholder = typeof props.label === 'string' ? props.label : '';

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
  //background-color: #3D4849;
  background-color: ${colors.AppBackGroundColor};

  justify-content: center;
  align-items: center;
  display: flex;
  
  

  @media ${device.mobile} {
    height: 100vh;
    width: 100vw;
  }

  @media ${device.laptop} {
    display: flex;
    //flex-direction: column;
    //justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
  }
`;

const InterviewInfoDiv = styled.div`
  //display: flex;
  //flex-direction: column;
  //background-color: blue;
 
  
  
  label {
    //margin-bottom: 10px;
    //display: flex;
    //flex-direction: column;
    //align-items: start;
    //width: 100%;
  }

  input, textarea {
    //margin-top: 5px;
  }

 @media ${device.mobile} {
   display: flex;
   //margin-left: 10vw;
   //width: 80%;
    flex-direction: column;
    justify-content: center; 
    align-items: center;    
   //margin-left: 10%;

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

