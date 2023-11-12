import React, {useContext, useEffect, useState} from "react";
import Box from "@mui/material/Box";
import {Button, IconButton, Snackbar, TextField} from "@mui/material";
import {useParams} from "react-router-dom";
import {JobsContext} from "../services/jobcontext";
import {Job} from "../models/Job";
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';
import styled from "styled-components";
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';

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
    }, [currentJob]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.patch(`http://localhost:8080/api/jobs/update/${jobId}`, formData);
            setJobs(prevJobs => prevJobs.map(job => job.id === Number(jobId) ? formData : job));
            setOpenSnackbar(true);
        } catch (error) {
            console.error('Error updating job:', error);
        }
    };

    const handleDelete = async () => {
        console.log("Delting")

    };
    // const { jobId } = useParams<{ jobId: string }>();  // Extracting jobId from URL params
    // const { jobs, setJobs, updateJobRejected, updateJobResponded } = useContext(JobsContext);
    // const [openSnackbar, setOpenSnackbar] = useState(false);
    // const currentJob = jobs.find(job => job.id === Number(jobId));
    // const [formData, setFormData] = useState<Job>(currentJob || {} as Job);
    //
    // const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
    //     if (reason === 'clickaway') {
    //         return;
    //     }
    //     setOpenSnackbar(false);
    // };
    //
    // useEffect(() => {
    //     if (currentJob) {
    //         setFormData(currentJob);
    //     }
    // }, [currentJob]);
    //
    // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     const { id, value } = e.target;
    //     setFormData(prev => ({ ...prev, [id]: value }));
    // };
    //
    // const handleSubmit = async () => {
    //     try {
    //         const response = await axios.patch(`http://localhost:8080/api/jobs/update/${jobId}`, formData);
    //         setJobs(prevJobs => prevJobs.map(job => job.id === Number(jobId) ? formData : job));
    //         setOpenSnackbar(true);
    //     } catch (error) {
    //         console.error('Error updating job:', error);
    //     }
    // };
    //
    // const handleDelete = async () => {
    //     console.log("Delting")

    // };

    return(
        <TestWrapperBox>
            <FormBox>
                <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}> {/* Adjusted margin */}
                    <TextField
                        id="companyname"
                        label="Company name"
                        variant="outlined"
                        value={formData.companyname || ''}
                        onChange={handleChange}
                        style={{ width: '80%' }}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}> {/* Adjusted margin */}
                    <TextField
                        id="description"
                        label="Description"
                        variant="outlined"
                        value={formData.description || ''}
                        onChange={handleChange}
                        style={{ width: '80%' }}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}> {/* Adjusted margin */}
                    <TextField
                        id="primarycontact"
                        label="Primary Contact"
                        variant="outlined"
                        value={formData.primarycontact || ''}
                        onChange={handleChange}
                        style={{ width: '80%' }}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}> {/* Adjusted margin */}
                    <TextField
                        id="companywebsitelink"
                        label="Company Website Link"
                        variant="outlined"
                        value={formData.companywebsitelink || ''}
                        onChange={handleChange}
                        style={{ width: '80%' }}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}> {/* Adjusted margin */}
                    <TextField
                        id="joblink"
                        label="Job Link"
                        variant="outlined"
                        value={formData.joblink || ''}
                        onChange={handleChange}
                        style={{ width: '80%' }}
                    />
                </div>




                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </div>
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
            </FormBox>





        </TestWrapperBox>
    );
};




const TestWrapperBox = styled(Box)`
  background-color: lightsalmon;
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const FormBox = styled(Box)`
  height: 60vh;
  width: 30vw;

  background-color: #c7f3ff;

  /* Adding box shadow on left, right, and bottom sides */
  box-shadow:
          -4px 0 8px -2px rgba(0, 0, 0, 0.2), /* Left shadow */
          4px 0 8px -2px rgba(0, 0, 0, 0.2),  /* Right shadow */
          0 4px 8px -2px rgba(0, 0, 0, 0.2);  /* Bottom shadow */
`;
