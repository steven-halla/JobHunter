import React, { useState, useEffect, useContext } from 'react';
import Calendar from 'react-calendar';
import styled from 'styled-components';
import 'react-calendar/dist/Calendar.css';
import { JobsContext } from "../services/jobcontext";
import {InterviewCalendarModal} from "./InterviewCalandarModal";
import {deviceCalendar, deviceHome} from "../common/ScreenSizes";
import {useTheme} from "@mui/material";
import {colors, fonts} from "../common/CommonStyles";

type InterviewData = {
    jobId: number;
    userId: number;
    companyname: string;
    interviewdate: Date | null;
    interviewernames: string;
    interviewnotes: string;
    meetingLink: string;
};

export const AllInterviews = () => {
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
        console.log("here are all the jobs" + jobs);

        setInterviewData(formattedData);
    }, [jobs]);


    const getTileContent = ({ date, view }: { date: Date; view: string }) => {
        if (view === 'month') {
            const dayInterviews = interviewData.filter(interview =>
                interview.interviewdate && interview.interviewdate.toDateString() === date.toDateString()
            );

            const isMobile = window.matchMedia(deviceCalendar.mobile).matches;

            let displayContent;
            if (isMobile) {
                if (dayInterviews.length > 0) {
                    displayContent = <div>✔️</div>;
                }
            } else {
                if (dayInterviews.length === 1) {
                    displayContent = <div>Interview</div>;
                } else if (dayInterviews.length > 1) {
                    displayContent = <div>Interviews</div>;
                }
            }
            return displayContent;
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
                    <p><strong>Meeting Link:</strong> <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer" style={{ color: colors.TextBlackColor, fontSize: fonts.InputFontREM, fontFamily: fonts.InputPlaceHolderFontFamily }}>Interview Link</a></p>
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

    const [isMobile, setIsMobile] = useState(window.matchMedia(deviceCalendar.mobile).matches);
    const [isLaptop, setIsLaptop] = useState(window.matchMedia(deviceCalendar.laptop).matches);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.matchMedia(deviceCalendar.mobile).matches);
            setIsLaptop(window.matchMedia(deviceCalendar.laptop).matches);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

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
  padding: 30px;
  margin-top: 5%;
  width: 75%;
  height: auto;
  max-height: 425px;
  background-color: ${colors.HeaderBackGroundColor};
  font-family: ${fonts.ButtonFontFamily};
  border-radius: 6px; 
  justify-content: center;
  align-items: center;
  margin-bottom: 10%;
  
  .react-calendar__tile {
    max-height: 70px; 
    overflow: hidden;
  }

  .react-calendar__tile--now {
    background-color: lightskyblue;
    border-radius: 3px; 
  }

  .interview-day {
    background-color: lightgreen; 
    color: #8A2BE2;
    border-radius: 3px;
  }

  @media ${deviceCalendar.mobile} {
    height: auto;
    max-height: 600px;
    width: 95%;
    padding: 10px;
  }
`;

const CalendarContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${colors.AppBackGroundColor};
  height: 100vh;
`;

