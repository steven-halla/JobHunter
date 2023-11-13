import React, { useState, useEffect, useContext } from 'react';
import Calendar from 'react-calendar';
import styled from 'styled-components';
import 'react-calendar/dist/Calendar.css';
import { JobsContext } from "../services/jobcontext"; // Adjust this import path as needed

const StyledCalendar = styled(Calendar)`
  width: 80vw;
  height: 80vh;
  max-width: 100%;
  .react-calendar__tile {
    max-height: 100px;
    overflow: hidden;
  }
`;

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

    useEffect(() => {
        const formattedData = jobs.map(job => ({
            jobId: job.id,
            userId: job.userid,
            companyname: job.companyname,
            interviewdate: (typeof job.interviewdate === 'string' || job.interviewdate instanceof Date) ? new Date(job.interviewdate) : null,
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
                            <p>Company: {interview.companyname}</p>
                            {/* You can display other details as needed */}
                        </div>
                    ))}
                </div>
            );
        }
    };

    return <StyledCalendar tileContent={getTileContent} />;
};
