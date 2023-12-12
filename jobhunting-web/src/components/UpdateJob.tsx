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
import {deviceHome, deviceProfile} from "../common/ScreenSizes";
import {colors, fonts} from "../common/CommonStyles";

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
        if (id === 'companyname' && companyNameError) {
            setCompanyNameError(null);
        }

        if (id === 'description' && descriptionError) {
            setDescriptionError(null);
        }

        if (id === 'primarycontact' && primaryContactError) {
            setPrimaryContactError(null);
        }

        if (id === 'companywebsitelink' && companyWebsiteLinkError) {
            setCompanyWebsiteLinkError(null);
        }
        if (id === 'joblink' && jobLinkError) {
            setJobLinkError(null);
        }

    };

    const handleSubmit = async () => {

        let hasError = false;

        // Validation for company name
        if (!formData.companyname) {
            setCompanyNameError("Company name required");
            hasError = true;
        } else if (formData.companyname.length < 3) {
            setCompanyNameError("Company name Min 3 characters");
            hasError = true;
        } else if (formData.companyname.length > 55) {
            setCompanyNameError("Company name max 55 characters");
            hasError = true;
        } else {
            setCompanyNameError(null);
        }

        // Validation for description
        if (!formData.description) {
            setDescriptionError("Description is required");
            hasError = true;
        } else if (formData.description.length < 3) {
            setDescriptionError("Description min 3 characters");
            hasError = true;
        } else if (formData.description.length > 255) {
            setDescriptionError("Description max 255 characters");
            hasError = true;
        } else {
            setDescriptionError(null);
        }
        //Validation for primary contact
        if (!formData.primarycontact) {
            setPrimaryContactError("Input cannot be empty");
            hasError = true;
        } else if (formData.primarycontact.length < 3) {
            setPrimaryContactError("Primary contact min 3 characters");
            hasError = true;
        } else if (formData.primarycontact.length > 30) {
            setPrimaryContactError("Primary contact max 30 characters");
            hasError = true;
        } else {
            setPrimaryContactError(null);
        }

        // Validation for company website link
        if (!formData.companywebsitelink) {
            setCompanyWebsiteLinkError("Input cannot be empty");
            hasError = true;
        } else if (formData.companywebsitelink.length < 3) {
            setCompanyWebsiteLinkError("Company website link min 3 characters");
            hasError = true;
        } else if (formData.companywebsitelink.length > 1000) {
            setCompanyWebsiteLinkError("Company website link max 1000 characters");
            hasError = true;
        } else {
            setCompanyWebsiteLinkError(null);
        }

        // Validation for job link
        if (!formData.joblink) {
            setJobLinkError("Input cannot be empty");
            hasError = true;
        } else if (formData.joblink.length < 3) {
            setJobLinkError("Job link min 3 characters");
            hasError = true;
        } else if (formData.joblink.length > 1000) {
            setJobLinkError("Job link max is 1000 characters");
            hasError = true;
        } else {
            setJobLinkError(null);
        }


        // Check if any validation failed
        if (hasError) {
            return;
        }


        try {
            const response = await axios.patch(`http://localhost:8080/api/jobs/update/${jobId}`, formData);
            setJobs(prevJobs => prevJobs.map(job => job.id === Number(jobId) ? formData : job));
            setOpenSnackbar(true);
            alert("Interview updated"); // Success message

            window.location.href = "/jobviewall"; // Redirect to '/jobviewall' route


        } catch (error) {
            console.error('Error updating job:', error);
        }

        setCompanyNameError(null);
        setDescriptionError(null);

    };

    const handleDelete = async () => {
        console.log("Delting")

    };

    const [companyNameError, setCompanyNameError] = useState<string | null>(null);
    const [descriptionError, setDescriptionError] = useState<string | null>(null);
    const [primaryContactError, setPrimaryContactError] = useState<string | null>(null);
    const [companyWebsiteLinkError, setCompanyWebsiteLinkError] = useState<string | null>(null);
    const [jobLinkError, setJobLinkError] = useState<string | null>(null);


    return(
        <TestWrapperBox>
            <FormBox>
                <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}> {/* Adjusted margin */}
                    <TextField
                        id="companyname"
                        label="Company name"
                        variant="outlined"
                        InputLabelProps={{
                            style: {
                                fontFamily: fonts.FontFamilyItalics,
                                color: 'blue', // Set the color of the label to light blue


                            }
                        }}
                        value={formData.companyname || ''}
                        onChange={handleChange}
                        InputProps={{
                            style: {
                                fontSize: fonts.HeaderIconTextREM,
                                fontFamily: fonts.InputFontFamily,

                                // fontSize: '1.1rem', // Set text size to 1.1rem
                                // fontFamily: 'Arial, sans-serif', // Set the "Arial" font
                            },
                        }}
                        style={{ width: '80%' }}
                    />


                </div>
                {companyNameError && <ErrorMessage>{companyNameError}</ErrorMessage>}

                <div style={{ display: 'flex',
                    justifyContent: 'center',
                    margin: '20px 0'
                }}>
                    <TextField
                        id="description"
                        label="Description"
                        InputLabelProps={{
                            style: {
                                fontFamily: fonts.FontFamilyItalics,
                                color: 'blue', // Set the color of the label to light blue

                            }
                        }}
                        variant="outlined"
                        value={formData.description || ''}
                        onChange={handleChange}
                        style={{ width: '80%' }}
                        InputProps={{
                            style: {
                                fontSize: fonts.HeaderIconTextREM,
                                fontFamily: fonts.InputFontFamily,
                            },
                        }}
                    />

                </div>
                {descriptionError && <ErrorMessage>{descriptionError}</ErrorMessage>}

                <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}> {/* Adjusted margin */}
                    <TextField
                        id="primarycontact"
                        label="Primary Contact"
                        InputLabelProps={{
                            style: {
                                fontFamily: fonts.FontFamilyItalics,
                                color: 'blue', // Set the color of the label to light blue

                            }
                        }}
                        variant="outlined"
                        value={formData.primarycontact || ''}
                        onChange={handleChange}
                        style={{ width: '80%' }}
                        InputProps={{
                            style: {
                                fontSize: fonts.HeaderIconTextREM,
                                fontFamily: fonts.InputFontFamily,
                            },
                        }}
                    />


                </div>
                {primaryContactError && <ErrorMessage>{primaryContactError}</ErrorMessage>}

                <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}> {/* Adjusted margin */}
                    <TextField
                        id="companywebsitelink"
                        label="Company Website Link"
                        InputLabelProps={{
                            style: {
                                fontFamily: fonts.FontFamilyItalics,
                                color: 'blue', // Set the color of the label to light blue

                            }
                        }}
                        variant="outlined"
                        value={formData.companywebsitelink || ''}
                        onChange={handleChange}
                        style={{ width: '80%' }}
                        InputProps={{
                            style: {
                                fontSize: fonts.HeaderIconTextREM,
                                fontFamily: fonts.InputFontFamily,
                            },
                        }}
                    />


                </div>
                {companyWebsiteLinkError && <ErrorMessage>{companyWebsiteLinkError}</ErrorMessage>}

                <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}> {/* Adjusted margin */}
                    <TextField
                        id="joblink"
                        label="Job Link"
                        InputLabelProps={{
                            style: {
                                fontFamily: fonts.FontFamilyItalics,
                                color: 'blue', // Set the color of the label to light blue

                            }
                        }}
                        variant="outlined"
                        value={formData.joblink || ''}
                        onChange={handleChange}
                        style={{ width: '80%' }}
                        InputProps={{
                            style: {
                                fontSize: fonts.HeaderIconTextREM,
                                fontFamily: fonts.InputFontFamily,
                            },
                        }}
                    />

                </div>
                {jobLinkError && <ErrorMessage>{jobLinkError}</ErrorMessage>}



                <SubmitButtonDiv>
                    <SubmitButton
                        sx={{
                            borderRadius: 10,
                            background: 'linear-gradient(to right, #00C9FF, #00B4D8)', // Neon blue gradient
                            // color: 'white', // Text color
                            color: colors.TextWhiteColor,

                            border: '1px solid #007BFF', // Adding a border for contrast
                            '&:hover': {
                                background: 'linear-gradient(to left, #00C9FF, #00B4D8)', // Change gradient direction on hover for effect
                                boxShadow: '0 0 10px #00C9FF', // Optional: Adding a glow effect on hover
                            },
                            fontSize: fonts.ButtonFontREM,

                            // fontSize: '1.6rem',
                            fontWeight: 'bold',
                            // fontFamily: "'Times New Roman', serif",
                            fontFamily: fonts.ButtonFontFamily,

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



            <Footer></Footer>

        </TestWrapperBox>

    );
};
const Footer = styled.div`
  height: 150px;
  width: 100%;
  background-color: ${colors.AppBackGroundColor};

  @media ${deviceProfile.mobile} {
    height: 200px;
  }
`;

const ErrorMessage = styled.div`
  color: ${colors.errorRedColor};
  font-family: 'Roboto', sans-serif;
  font-size: ${fonts.InputFontREM};
  text-align: center; // Center align the text
  width: 100%; // Ensure the div takes the full width
  display: block; // Display as block element
  margin: 0 auto; // Auto margin for horizontal centering
`;



const SubmitButtonDiv = styled.div`
  display: flex;

  height: 10%;
  //width: 70%;
  margin-top: 3%;
  justify-content: center;
  align-items: center;
  padding: 20px;
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
  background-color: ${colors.AppBackGroundColor};
  height: 100%;
  width: 100%;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
  
`;

const FormBox = styled(Box)`
  height: auto;
  width: 40%;
  background-color: ${colors.HeaderBackGroundColor};
  margin-top: 6%;

  //background-color: #C0C0C0;

  /* Adding box shadow on left, right, and bottom sides */
  box-shadow:
          -4px 0 8px -2px rgba(0, 0, 0, 0.2), /* Left shadow */
          4px 0 8px -2px rgba(0, 0, 0, 0.2),  /* Right shadow */
          0 4px 8px -2px rgba(0, 0, 0, 0.2);  /* Bottom shadow */

  @media ${deviceHome.mobile} {
    //background-color: red;
    width: 90%;
    margin-top: 3%;

  }
`;
