import React, {useContext, useEffect, useState} from "react";
import Box from "@mui/material/Box";
import {Button, IconButton, Snackbar, TextField} from "@mui/material";
import {useParams} from "react-router-dom";
import {JobsContext} from "../services/jobcontext";
import {Job} from "../models/Job";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';

//need to make snackbar not stay for so long


export const UpdateJob = () => {
    const { jobId } = useParams<{ jobId: string }>();  // Extracting jobId from URL params
    const { jobs, setJobs, updateJobRejected, updateJobResponded } = useContext(JobsContext);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const currentJob = jobs.find(job => job.id === Number(jobId));
    const [formData, setFormData] = useState<Job>(currentJob || {} as Job);

    const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };


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
            setOpenSnackbar(true);

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

            <Snackbar
                style={{
                    position: 'fixed',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                message="Update successful"
                action={
                    <React.Fragment>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={handleCloseSnackbar}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                }
            />


        </Box>
    );
};