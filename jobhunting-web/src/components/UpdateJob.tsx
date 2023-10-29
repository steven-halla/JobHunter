import React, {useContext, useEffect, useState} from "react";
import Box from "@mui/material/Box";
import {Button, TextField} from "@mui/material";
import {useParams} from "react-router-dom";
import {JobsContext} from "../services/jobcontext";
import {Job} from "../models/Job";
import axios from "axios";



export const UpdateJob = () => {
    const { jobId } = useParams<{ jobId: string }>();  // Extracting jobId from URL params
    const { jobs, setJobs, updateJobRejected, updateJobResponded } = useContext(JobsContext);

    const currentJob = jobs.find(job => job.id === Number(jobId));
    const [formData, setFormData] = useState<Job>(currentJob || {} as Job);


    useEffect(() => {
        if (currentJob) {
            setFormData(currentJob);
        }
        // Optional: You can add a fetch call here if you need to fetch job by jobId from API.
    }, [currentJob]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.patch(`http://localhost:8080/api/jobs/update/${jobId}`, formData);
            // Update jobs in context with the updated job details.
            setJobs(prevJobs => prevJobs.map(job => job.id === Number(jobId) ? formData : job));
        } catch (error) {
            console.error('Error updating job:', error);
        }
    };

    return(
        <Box
            sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
            }}
        >




            <TextField
                id="companyname"
                label="Company name"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.companyname || ''}
                onChange={handleChange}
            />


            <TextField
                id="description"
                label="Description"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.description || ''}
                onChange={handleChange}
            />

            <TextField
                id="primarycontact"
                label="Primary Contact"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.primarycontact || ''}
                onChange={handleChange}
            />

            <TextField
                id="companywebsitelink"
                label="Company Website Link"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.companywebsitelink || ''}
                onChange={handleChange}
            />

            <TextField
                id="joblink"
                label="Job Link"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.joblink || ''}
                onChange={handleChange}
            />




            <Button
                variant="contained"
                color="primary"
                style={{ marginTop: '20px' }}
                onClick={handleSubmit}
            >
                Submit
            </Button>
        </Box>
    );
};