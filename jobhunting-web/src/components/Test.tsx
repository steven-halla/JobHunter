import React, { useState, useEffect, useContext } from 'react';
import Calendar from 'react-calendar';
import styled from 'styled-components';
import 'react-calendar/dist/Calendar.css';
import { JobsContext } from "../services/jobcontext";
import {InterviewCalendarModal} from "./InterviewCalandarModal";



type InterviewData = {
    jobId: number;
    userId: number;
    companyname: string;
    interviewdate: Date | null;
    interviewernames: string;
    interviewnotes: string;
    meetingLink: string;
};

export const Test = () => {
    const { jobs } = useContext(JobsContext);
    const [interviewData, setInterviewData] = useState<InterviewData[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [modalContent, setModalContent] = useState<React.ReactNode>(null);

    useEffect(() => {
        const formattedData = jobs.map(job => ({
            jobId: job.id,
            userId: job.userid,
            companyname: job.companyname,
            interviewdate: (typeof job.interviewdate === 'string' || job.interviewdate instanceof Date)
                ? new Date(job.interviewdate)
                : null,
            interviewernames: typeof job.interviewernames === 'string' ? job.interviewernames : '',
            interviewnotes: typeof job.interviewnotes === 'string' ? job.interviewnotes : '',
            meetingLink: typeof job.meetingLink === 'string' ? job.meetingLink : '',
        }));

        setInterviewData(formattedData);
    }, [jobs]);
    const getTileContent = ({ date, view }: { date: Date; view: string }) => {
        if (view === 'month') {
            const dayInterviews = interviewData.filter(interview =>
                interview.interviewdate && interview.interviewdate.toDateString() === date.toDateString()
            );
            return (
                <div>
                    {dayInterviews.map((interview, index) => (
                        <div key={index}>
                            <p> {interview.companyname}</p>
                            {/* Display other interview details as needed */}
                        </div>
                    ))}
                </div>
            );
        }
    };

    const onDayClick = (value: Date, event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const dayInterviews = interviewData.filter(interview =>
            interview.interviewdate && interview.interviewdate.toDateString() === value.toDateString()
        );

        if (dayInterviews.length > 0) {
            const modalContentJSX = dayInterviews.map((interview, index) => (
                <div key={index}>
                    <p><strong>Company:</strong> {interview.companyname}</p>
                    <p><strong>Interviewer Names:</strong> {interview.interviewernames}</p>
                    <p><strong>Interview Notes:</strong> {interview.interviewnotes}</p>
                    <p><strong>Meeting Link:</strong> <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer">{interview.meetingLink}</a></p>
                </div>
            ));
            setModalContent(modalContentJSX);
            setShowModal(true);
        }
    };

    const getTileClassName = ({ date, view }: { date: Date; view: string }) => {
        if (view === 'month') {
            const hasInterview = interviewData.some(interview =>
                interview.interviewdate && interview.interviewdate.toDateString() === date.toDateString()
            );
            return hasInterview ? 'interview-day' : '';
        }
    };


    return (
        <CalendarContainer>
            <StyledCalendar
                tileContent={getTileContent}
                tileClassName={getTileClassName}
                onClickDay={onDayClick} />
            <InterviewCalendarModal show={showModal} onClose={() => setShowModal(false)}>
                {modalContent}
            </InterviewCalendarModal>
        </CalendarContainer>
    );
};


const StyledCalendar = styled(Calendar)`
  width: 75%;
  height: 75vh;
  max-width: 100%;
  .react-calendar__tile {
    max-height: 100px; // Adjust as needed
    overflow: hidden;
  }

  .interview-day {
    background-color: lightgreen;
  }

  /* Add additional styling here if needed */
`;



// If needed, create a styled div to center the calendar
const CalendarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; // This makes sure the container takes the full height of the viewport
`;

