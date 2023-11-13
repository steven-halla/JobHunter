import React, { useEffect, useState, useContext } from 'react';
import {JobsContext} from "../services/jobcontext";
import {Interview} from "../models/Job";
import {DateMutation} from "../common/DateMutation";

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
        <div>
            <h2>All Interviews</h2>
            <ul>
                {allInterviewData.map((data, index) => (
                    <li key={index}>
                        <p>Company Name: {data.companyname}</p>
                        <p>Interviewer Names: {data.interviewernames}</p>
                        <p>Interview Notes: {data.interviewnotes}</p>
                        <p>Meeting Link: <a href={data.meetingLink} target="_blank" rel="noopener noreferrer">{data.meetingLink}</a></p>
                        <p>Interview Date: {
                            data.interviewdate
                                ? DateMutation(typeof data.interviewdate === 'string' ? data.interviewdate : data.interviewdate.toISOString())
                                : 'Date not available'
                        }</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}