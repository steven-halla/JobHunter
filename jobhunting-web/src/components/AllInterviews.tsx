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
            .filter(job => typeof job.meetingLink === 'string' && job.meetingLink)
            .map(job => ({
                jobId: job.id,
                userId: job.userid,
                companyname: job.companyname,
                interviewdate: typeof job.interviewdate === 'function' ? null : job.interviewdate,
                interviewernames: typeof job.interviewernames === 'function' ? '' : job.interviewernames,
                interviewnotes: typeof job.interviewnotes === 'function' ? '' : job.interviewnotes,
                meetingLink: job.meetingLink as string,
                interviews: job.interviews
            }));

        setAllInterviewData(aggregatedInterviewData);
    }, [jobs]);


    return (
        <div>
            <h2>All Interviews</h2>
            {allInterviewData.length > 0 ? (
                <ul>
                    {allInterviewData.map((data, index) => (
                        <li key={index}>
                            <p>Job ID: {data.jobId}</p>
                            <p>Company Name: {data.companyname}</p>
                            <p>Interview Date: {data.interviewdate instanceof Date
                                ? DateMutation(data.interviewdate.toISOString())
                                : "Date not available"}
                            </p>
                            <p>Interviewer Names: {data.interviewernames}</p>
                            <p>Meeting Link: <a href={data.meetingLink} target="_blank" rel="noopener noreferrer">{data.meetingLink}</a></p>
                            <p>Interview Notes: {data.interviewnotes}</p>
                            {/* Displaying each interview detail if available */}
                            {data.interviews && data.interviews.map((interview, i) => (
                                <div key={i}>
                                    <p>Interview Time: {interview.interviewtime}</p>
                                    <p>Interview Secured: {interview.secured ? 'Yes' : 'No'}</p>
                                </div>
                            ))}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No interviews available.</p>
            )}
        </div>
    );
};