import React, {FC, useState, ReactNode, useEffect} from 'react';
import {Interview, Job} from "../models/Job";
import axios from "axios";

interface JobsContextState {
    job?: Job;
    setJob: (job?: Job) => void;
    jobs: Job[];
    setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
    olderJobs: Job[];
    updateJobResponded: (id: number, responded: boolean) => void;
    updateJobInterview: (id: number, interviews: Interview[]) => void;
    dateApplied?: Date;
    setDateApplied: (date: Date) => void;
    updateJobRejected: (id: number, rejected: boolean) => void;  // Added this line

    meetingLink: string;
    setMeetingLink: React.Dispatch<React.SetStateAction<string>>;
    interviewnotes: string;
    setInterviewNotes: React.Dispatch<React.SetStateAction<string>>;
    interviewernames: string;
    setInterviewerNames: React.Dispatch<React.SetStateAction<string>>;
    interviewdate: Date | null;
    setInterviewDate: React.Dispatch<React.SetStateAction<Date | null>>;

    updateJobSoftDelete: (id: number, softDelete: boolean) => void;



}

export const JobsContext = React.createContext<JobsContextState>({} as JobsContextState);

interface JobsContextProviderProps {
    children: ReactNode;
}

const TWO_DAYS_MS = 48 * 60 * 60 * 1000;

export const JobsContextProvider: FC<JobsContextProviderProps> = ({children}) => {
    const [job, setJob] = useState<Job>();
    const [dateApplied, setDateApplied] = useState<Date | undefined>();

    // New state variables for the interview attributes
    const [interviewnotes, setInterviewNotes] = useState<string>('');
    const [interviewernames, setInterviewerNames] = useState<string>('');  // Fixed the name to match the interface
    const [interviewdate, setInterviewDate] = useState<Date | null>(null);
    const [meetingLink, setMeetingLink] = useState<string>('');  // Fixed the name to match the interface


    const [jobs, setJobs] = useState<Job[]>(() => {
        const savedJobs = localStorage.getItem('jobs');
        if (savedJobs) {
            return JSON.parse(savedJobs);
        } else {
            return [];
        }
    });
    const [olderJobs, setOlderJobs] = useState<Job[]>([]);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await axios.get<Job[]>("http://localhost:8080/api/jobs");

                if (response.data) {
                    setJobs(response.data);
                }
            } catch (error) {
                console.error("Error fetching data: " , error);
            }
        };

        fetchJobs();
    }, []);

    useEffect(() => {
        localStorage.setItem('jobs', JSON.stringify(jobs));
    }, [jobs]);

    useEffect(() => {
        const currentDateMs = new Date().getTime();
        const filteredJobs = jobs.filter(job => {
            const timeDelta = currentDateMs - new Date(job.dateapplied).getTime();
            return timeDelta > TWO_DAYS_MS && !job.companyresponded;
        });
        setOlderJobs(filteredJobs);
    }, [jobs]);

    const updateJobResponded = async (id: number, responded: boolean) => {
        setJobs(prevJobs => {
            const updatedJobs = prevJobs.map(job => job.id === id ? { ...job, companyresponded: responded } : job);
            return updatedJobs;
        });
        if (job != null && job.id === id) {
            setJob({
                ...job,
                companyresponded: responded
            });
        }

        try {
            console.log(`Sending PATCH request to http://localhost:8080/api/jobs/update/${id}`);
            const response = await axios.patch(`http://localhost:8080/api/jobs/update/${id}`, { companyresponded: responded });
            console.log("Response from PATCH request: ", response);
        } catch (error) {
            console.error('Failed to update job response:', error);
        }
    };

    const updateJobRejected = async (id: number, rejected: boolean) => {
        // Update local state
        setJobs(prevJobs => {
            const updatedJobs = prevJobs.map(job =>
                job.id === id ? {...job, companyrejected: rejected} : job
            );
            return updatedJobs;
        });

        // Update job if currently selected
        if (job && job.id === id) {
            setJob({...job, companyrejected: rejected});
        }

        // Send the update to the server
        try {
            const response = await axios.patch(`http://localhost:8080/api/jobs/update/${id}`, {companyrejected: rejected});
            if (response.data) {
                console.log("Response from PATCH request for rejected: ", response.data);
            }
        } catch (error) {
            console.error('Failed to update job rejection status:', error);
        }
    };

    const updateJobSoftDelete = async (id: number, softDelete: boolean) => {
        // Update local state
        setJobs(prevJobs => {
            const updatedJobs = prevJobs.map(job =>
                job.id === id ? { ...job, jobsoftdelete: softDelete } : job
            );
            return updatedJobs;
        });

        // Update job if currently selected
        if (job && job.id === id) {
            setJob({ ...job, jobsoftdelete: softDelete });
        }

        // Send the update to the server
        try {
            const response = await axios.patch(`http://localhost:8080/api/jobs/update/${id}`, { jobsoftdelete: softDelete });
            if (response.data) {
                console.log("Response from PATCH request for jobsoftdelete: ", response.data);
            }
        } catch (error) {
            console.error('Failed to update job soft delete status:', error);
        }
    };



    const updateJobInterview = async (id: number, newInterviews: Interview[]) => {
        setJobs(prevJobs => {
            const updatedJobs = prevJobs.map(job =>
                job.id === id
                    ? { ...job, interviews: [...job.interviews, ...newInterviews] }
                    : job
            );
            return updatedJobs;
        });
        if (job != null && job.id === id) {
            setJob({
                ...job,
                interviews: [...job.interviews, ...newInterviews]
            });
        }
        try {
            console.log(`Sending PATCH request to http://localhost:8080/api/jobs/update/${id}`);
            const response = await axios.patch(`http://localhost:8080/api/jobs/update/${id}`, { interviews: newInterviews });
            console.log("Response from PATCH request: ", response);
        } catch (error) {
            console.error('Failed to update job interview:', error);
        }
    };
    console.log("after the get names", interviewernames)

    return(
        <JobsContext.Provider
            value={{
                job, setJob,
                jobs, setJobs,
                olderJobs,
                updateJobResponded,
                updateJobRejected,  // Added this line
                updateJobInterview,
                updateJobSoftDelete, // Add this line for soft delete functionality

                dateApplied, setDateApplied,
                meetingLink, setMeetingLink,  // Fixed the name to match the interface
                interviewnotes, setInterviewNotes,
                interviewernames, setInterviewerNames,  // Fixed the name to match the interface
                interviewdate, setInterviewDate,  // Fixed the name to match the interface
            }}
        >
            {children}
        </JobsContext.Provider>

    );
};

export default JobsContextProvider;
