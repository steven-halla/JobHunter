import React, { useEffect, useState, useContext } from 'react';
import {JobsContext} from "../services/jobcontext";
import {Interview} from "../models/Job";

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




    return(
        <div>
            <p>Hi im the all interviews page</p>
        </div>
    )
}