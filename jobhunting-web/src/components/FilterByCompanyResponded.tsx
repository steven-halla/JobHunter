import React, { useEffect, useState } from 'react';
import { Job } from '../models/Job';
import AuthService from "../services/auth.service";
import { User } from "../models/User";

export const FilterByCompanyResponded: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const currentUser: User | null = AuthService.getCurrentUser();

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        if (currentUser) {
            const response = await fetch(`http://localhost:8080/api/jobs/all/${currentUser.id}`);
            const jobsData: Job[] = await response.json();
            const filteredJobs = jobsData.filter(job => job.companyresponded);
            setJobs(filteredJobs);
        }
    };

    return (
        <div>
            <h1>Jobs where Company Responded</h1>
            {jobs.map(job => (
                <div key={job.id}>
                    <h2>{job.companyname}</h2>
                    <p>{job.description}</p>
                    {/* Display other job details as required */}
                </div>
            ))}
        </div>
    );
};

