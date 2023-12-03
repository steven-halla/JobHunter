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
import {red} from "@mui/material/colors";
import {deviceHome} from "../common/ScreenSizes";

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

    /* styles.css (or your CSS file) */



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
                        InputProps={{
                            style: {
                                fontSize: '1.1rem', // Set text size to 1.1rem
                                fontFamily: 'Arial, sans-serif', // Set the "Arial" font
                            },
                        }}
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
                        InputProps={{
                            style: {
                                fontSize: '1.1rem', // Set text size to 1.1rem
                                fontFamily: 'Arial, sans-serif', // Set the "Arial" font
                            },
                        }}
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
                        InputProps={{
                            style: {
                                fontSize: '1.1rem', // Set text size to 1.1rem
                                fontFamily: 'Arial, sans-serif', // Set the "Arial" font
                            },
                        }}
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
                        InputProps={{
                            style: {
                                fontSize: '1.1rem', // Set text size to 1.1rem
                                fontFamily: 'Arial, sans-serif', // Set the "Arial" font
                            },
                        }}
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
                        InputProps={{
                            style: {
                                fontSize: '1.1rem', // Set text size to 1.1rem
                                fontFamily: 'Arial, sans-serif', // Set the "Arial" font
                            },
                        }}
                    />
                </div>



                <SubmitButtonDiv>
                    <SubmitButton
                        sx={{
                            borderRadius: 10,
                            background: 'linear-gradient(to right, #00C9FF, #00B4D8)', // Neon blue gradient
                            color: 'white', // Text color
                            border: '1px solid #007BFF', // Adding a border for contrast
                            '&:hover': {
                                background: 'linear-gradient(to left, #00C9FF, #00B4D8)', // Change gradient direction on hover for effect
                                boxShadow: '0 0 10px #00C9FF', // Optional: Adding a glow effect on hover
                            },
                            fontSize: '1.6rem',
                            fontWeight: 'bold',
                            fontFamily: "'Times New Roman', serif",
                            textTransform: 'none', // Optional: Prevents uppercase text transformation common in MUI Buttons
                        }}
                        onClick={handleSubmit} variant="contained">
                        Submit</SubmitButton>
                </SubmitButtonDiv>
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


const SubmitButtonDiv = styled.div`
  display: flex;

  height: 10%;
  //width: 70%;
  margin-top: 9%;
  justify-content: center;
  align-items: center;
`;

const LifeStoryDiv = styled.div`
  display: flex;
  flex-direction: column;
  //height: 40vh;
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const SubmitButton = styled(Button)`
  height: 9vh;
  width: 23vw;
  display: flex;
  padding-bottom: 70px;
  //margin-bottom: 50px;
  //background-color: yellow;

  @media ${deviceHome.mobile} {
    //background-color: red;
    width: 30vw;
    height: 7vh;
  }


`;


const TestWrapperBox = styled(Box)`
  background-color: #3D4849;
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const FormBox = styled(Box)`
  height: 67vh;
  width: 30vw;

  background-color: #C0C0C0;

  /* Adding box shadow on left, right, and bottom sides */
  box-shadow:
          -4px 0 8px -2px rgba(0, 0, 0, 0.2), /* Left shadow */
          4px 0 8px -2px rgba(0, 0, 0, 0.2),  /* Right shadow */
          0 4px 8px -2px rgba(0, 0, 0, 0.2);  /* Bottom shadow */
`;
