import React, {useContext, useEffect, useState} from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem } from '@mui/material';
import { JobsContext } from "../services/jobcontext";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import {deviceJobViewAll} from "../common/ScreenSizes";

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

export const JobViewAll = () => {
    // ... (keeping all your state and functions here)
    const { jobs, updateJobRejected, meetingLink} = useContext(JobsContext);
    const [filter] = useState('');
    const [onlyShowResponded] = useState(false);
    const [sortOrder, setSortOrder] = useState<'company-a-z' | 'company-z-a' | 'contact-a-z' | 'contact-z-a' | 'date-asc' | 'date-desc'>('date-asc');
    // const [jobResponses, setJobResponses] = useState<Record<string, JobResponse>>({});
    const history = useNavigate();
    const navigate = useNavigate();


    const [isDescriptionModalOpen, setDescriptionModalOpen] = useState(false);
    const [selectedDescription, setSelectedDescription] = useState('');


    const [open, setOpen] = useState(false);
    const [jobResponses, setJobResponses] = useState<Record<string, JobResponse>>(
        // Assuming 'jobs' is an array of job objects available at the time of component's initialization
        jobs.reduce((acc, job) => {
            if (job.companyresponded) {
                acc[job.id] = 'accepted';
            } else if (job.companyrejected) {
                acc[job.id] = 'declined';
            } else {
                acc[job.id] = 'no response';
            }
            return acc;
        }, {} as Record<string, JobResponse>)
    );


    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    type JobResponse = 'accepted' | 'declined' | 'no response';

    const openDescriptionModal = (description: string) => {
        console.log("openDescriptionModal called with:", description);
        setSelectedDescription(description);
        setDescriptionModalOpen(true);
    };


    const closeDescriptionModal = () => {
        setDescriptionModalOpen(false);
    };



    // const handleResponseChange = async (e: any, jobId: string) => {
    //     const selectedValue = e.target.value as JobResponse;
    //     const targetJob = jobs.find(job => job.id === Number(jobId));
    //     if(targetJob) {
    //         if(selectedValue === 'declined') {
    //             targetJob.companyrejected = true;
    //         } else {
    //             targetJob.companyrejected = false;
    //         }
    //         await updateJobOnServer(jobId, { companyrejected: targetJob.companyrejected });
    //         setJobResponses(prev => ({
    //             ...prev,
    //             [jobId]: selectedValue
    //         }));
    //
    //         // Redirect if the selected value is "accepted"
    //         // Redirect if the selected value is "accepted"
    //         if (selectedValue === 'accepted') {
    //             navigate(`/interviewsecured/${jobId}`);
    //         }
    //     }
    // };

    const handleResponseChange = async (e: any, jobId: string) => {
        const selectedValue = e.target.value as JobResponse;
        const targetJob = jobs.find(job => job.id === Number(jobId));

        if(targetJob) {
            if(selectedValue === 'declined') {
                targetJob.companyrejected = true;
                targetJob.companyresponded = false;
            } else if (selectedValue === 'accepted') {
                targetJob.companyrejected = false;
                targetJob.companyresponded = true;
                navigate(`/interviewsecured/${jobId}`);
            } else {
                targetJob.companyrejected = false;
                targetJob.companyresponded = false;
            }

            await updateJobOnServer(jobId, {
                companyrejected: targetJob.companyrejected,
                companyresponded: targetJob.companyresponded
            });

            setJobResponses(prev => ({
                ...prev,
                [jobId]: selectedValue
            }));
        }
    };



    // const updateJobOnServer = async (jobId: string, data: { companyrejected: boolean }) => {
    //     // Make a PATCH request to your server to update the job with jobId
    //     try {
    //         const response = await fetch(`http://localhost:8080/api/jobs/update/${jobId}`, {
    //             method: 'PATCH',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify(data)
    //         });
    //
    //         if (!response.ok) {
    //             throw new Error("Failed to update job.");
    //         }
    //         // Optionally, update your local state if the server responds with updated data.
    //         // const updatedJob = await response.json();
    //     } catch (error) {
    //         console.error("Error updating job:", error);
    //     }
    // };

    const updateJobOnServer = async (jobId: string, data: { companyrejected: boolean; companyresponded?: boolean }) => {
        // Make a PATCH request to your server to update the job with jobId
        try {
            const response = await fetch(`http://localhost:8080/api/jobs/update/${jobId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error("Failed to update job.");
            }
            // Optionally, update your local state if the server responds with updated data.
            // const updatedJob = await response.json();
        } catch (error) {
            console.error("Error updating job:", error);
        }
    };






    const filteredAndRespondedJobs = jobs
        .filter(job => !job.companyrejected)
        .filter(job =>
            (onlyShowResponded ? job.companyresponded : true) &&
            job.companyname.toLowerCase().includes(filter.toLowerCase())
        );



    const sortedAndRespondedJobs = [...filteredAndRespondedJobs].sort((a, b) => {
        switch(sortOrder) {
            case 'company-a-z':
                return a.companyname.toLowerCase().localeCompare(b.companyname.toLowerCase());
            case 'company-z-a':
                return b.companyname.toLowerCase().localeCompare(a.companyname.toLowerCase());
            case 'contact-a-z':
                return a.primarycontact.toLowerCase().localeCompare(b.primarycontact.toLowerCase());
            case 'contact-z-a':
                return b.primarycontact.toLowerCase().localeCompare(a.primarycontact.toLowerCase());
            case 'date-asc':
                return new Date(a.dateapplied).getTime() - new Date(b.dateapplied).getTime();
            case 'date-desc':
                return new Date(b.dateapplied).getTime() - new Date(a.dateapplied).getTime();
            default:
                return 0;
        }
    });

    const [isMobile, setIsMobile] = useState(window.matchMedia(deviceJobViewAll.mobile).matches);
    const [isLaptop, setIsLaptop] = useState(window.matchMedia(deviceJobViewAll.tablet).matches);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.matchMedia(deviceJobViewAll.mobile).matches);
            setIsLaptop(window.matchMedia(deviceJobViewAll.tablet).matches);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    const handleDateSortAsc = () => {
        setSortOrder('date-asc');
    };

    const handleDateSortDesc = () => {
        setSortOrder('date-desc');
    };

    const handleContactNameSortAsc = () => {
        setSortOrder('contact-a-z');
    };

    const handleContactNameSortDesc = () => {
        setSortOrder('contact-z-a');
    };

    const handleCompanyNameSortAsc = () => {
        setSortOrder('company-a-z');
    };

    const handleCompanyNameSortDesc = () => {
        setSortOrder('company-z-a');
    };

    // const ResponseButton = styled.button<{ responded?: boolean, rejected?: boolean }>`
    // background-color: ${({ responded, rejected }) => {
    //     if (responded) return 'green';
    //     if (rejected) return 'red';
    //     return 'blue';
    // }};
    // color: white;
    // border: none;
    // padding: 8px 15px;
    // cursor: pointer;
    // border-radius: 5px;
    // transition: background-color 0.3s ease;
    //
    // &:hover {
    //     background-color: ${({ responded, rejected }) => {
    //     if (responded) return 'darkgreen';
    //     if (rejected) return 'darkred';
    //     return 'darkblue';
    // }};
    // }
// `;




    return (
        <>
            {isMobile ? (
                <div>
                    <FilterSelect value={sortOrder} onChange={(e: { target: { value: any; }; }) => setSortOrder(e.target.value as any)}>
                        <option value="date-asc">Date Applied (Oldest First)</option>
                        <option value="date-desc">Date Applied (Newest First)</option>
                        <option value="company-a-z">Company Name (A-Z)</option>
                        <option value="company-z-a">Company Name (Z-A)</option>
                        <option value="contact-a-z">Contact Name (A-Z)</option>
                        <option value="contact-z-a">Contact Name (Z-A)</option>
                    </FilterSelect>
                    {sortedAndRespondedJobs.map((job, index) => (
                        <JobCard key={job.id}>
                            <TitleDiv>
                                <JobTitleDiv>Responded:
                                    <select value={jobResponses[job.id] || 'no response'} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleResponseChange(e, String(job.id))}>
                                        <option value="accepted">Accepted</option>
                                        <option value="declined">Declined</option>
                                        <option value="no response">No Response</option>
                                    </select>
                                </JobTitleDiv>


                            </TitleDiv>
                        </JobCard>

                    ))}
                </div>
            ) : (
                <StyledTableContainer>
                    <Table>
                        <StyledTableHead>
                            <TableRow>
                                <TableCell>
                                    <SortLabelContainer>
                                        Date
                                        <ButtonHolderDiv>
                                            <FontAwesomeIcon icon={faCaretUp} size="lg" onClick={handleDateSortAsc} />
                                            <FontAwesomeIcon icon={faCaretDown} size="lg" onClick={handleDateSortDesc} />
                                        </ButtonHolderDiv>
                                    </SortLabelContainer>
                                </TableCell>

                                <TableCell>
                                    <SortLabelContainer>Company
                                        <ButtonHolderDiv>
                                            <FontAwesomeIcon icon={faCaretUp} size="lg" onClick={handleCompanyNameSortAsc} />
                                            <FontAwesomeIcon icon={faCaretDown} size="lg" onClick={handleCompanyNameSortDesc} />
                                        </ButtonHolderDiv>
                                    </SortLabelContainer>
                                </TableCell>



                                <TableCell>Description</TableCell>


                                <TableCell>
                                    <SortLabelContainer>
                                        Contact
                                        <ButtonHolderDiv>
                                            <FontAwesomeIcon icon={faCaretUp} size="lg" onClick={handleContactNameSortAsc} />
                                            <FontAwesomeIcon icon={faCaretDown} size="lg" onClick={handleContactNameSortDesc} />
                                        </ButtonHolderDiv>
                                    </SortLabelContainer>

                                </TableCell>


                                <TableCell>Job Poster</TableCell>
                                <TableCell>Job Link</TableCell>
                                <TableCell>Website Link</TableCell>
                                <TableCell>Responded</TableCell>
                                <TableCell>Button</TableCell>

                            </TableRow>
                        </StyledTableHead>
                        <TableBody>
                            {sortedAndRespondedJobs.map((job, index) => (
                                <TableRow key={job.id}>
                                    <TableCell>{new Date(job.dateapplied).toISOString().split('T')[0]}</TableCell>
                                    <TableCell>{job.companyname}</TableCell>
                                    <TableCell>
                                        <TextButton onClick={() => openDescriptionModal(job.description)}>Click to View</TextButton>
                                    </TableCell>
                                    <TableCell>{job.primarycontact}</TableCell>
                                    <TableCell>{job.jobposter}</TableCell>
                                    <TableCell><a href={job.joblink} target="_blank" rel="noopener noreferrer">LINK</a></TableCell>
                                    <TableCell><a href={job.companywebsitelink} target="_blank" rel="noopener noreferrer">LINK</a></TableCell>
                                    <TableCell>
                                        <select value={jobResponses[job.id] || 'no response'} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleResponseChange(e, String(job.id))}>
                                            <option value="accepted">Accepted</option>
                                            <option value="declined">Declined</option>
                                            <option value="no response">No Response</option>
                                        </select>
                                    </TableCell>
                                    <TableCell>
                                        {jobResponses[job.id] === "accepted" ? (
                                            <Button
                                                variant="contained"
                                                style={{backgroundColor: 'green'}}
                                            >
                                                Interview
                                            </Button>
                                        ) : jobResponses[job.id] === "declined" ? (
                                            <Button
                                                variant="contained"
                                                style={{backgroundColor: 'red'}}
                                            >
                                                Declined
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="contained"
                                                style={{backgroundColor: 'blue'}}
                                            >
                                                No Response
                                            </Button>
                                        )}
                                    </TableCell>



                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </StyledTableContainer>
            )}

            {isDescriptionModalOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',  // semi-transparent background
                        zIndex: 999,  // to ensure it's below the modal content
                    }}
                    onClick={closeDescriptionModal}
                >
                    <div
                        style={{
                            position: 'fixed',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            backgroundColor: 'white',
                            padding: '20px',
                            zIndex: 1000,
                            width: '80vw',
                            maxHeight: '80vh',
                            overflowY: 'auto',
                        }}
                        onClick={e => e.stopPropagation()} // stops the click event from reaching the outer div
                    >
                        <p>{selectedDescription}</p>
                    </div>
                </div>
            )}
        </>
    );

};




const SortLabelContainer = styled.div`
    display: flex;
    align-items: center; // align vertically in the center
`;

const ButtonHolderDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 8px; // Adjusts the spacing between the Date text and the icons
`;

// const JobCard = styled.div`
//   background-color: white;
//   border: 1px solid #ccc;
//   border-radius: 8px;
//   padding: 16px;
//   margin-bottom: 16px;
//   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
//
//   @media ${deviceJobViewAll.mobile} {
//     display: flex;
//     flex-direction: column;
//   }
//
//   @media ${deviceJobViewAll.tablet} {
//     display: flex;
//     flex-direction: row;
//   }
// `;


const StyledTableCell = styled(TableCell)`
  max-width: 20ch;
  white-space: pre-wrap;   // Allows content to wrap to the next line
  word-wrap: break-word;   // Allows breaking between words
  overflow-wrap: break-word; // In case a single word is longer than 25ch, it'll break
`;


// const SortLabelContainer = styled.div`
//     display: flex;
//     align-items: center; // align vertically in the center
//
//
// `;

const SortIconContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 8px; // you can adjust this spacing

  @media ${deviceJobViewAll.mobile} {
    display: none;  // Hide the icons by default
  }
`;


const StyledTableHead = styled(TableHead)`
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;

    @media ${deviceJobViewAll.mobile} {
        & > * {
          display: none;  // Hide for mobile

        }
    }
`;


const StyledTableContainer = styled(TableContainer)`
    height: 93vh;  /* Adjust to your preference */
    overflow-y: auto;
`;

const TableCellCompanyName = styled(TableCell)`
    max-width: 25ch;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-wrap: break-word;
`;

const TextButton = styled.button`
    background: none;
    border: none;
    color: inherit;  // Use the same color as the surrounding text
    font: inherit;  // Use the same font and size as the surrounding text
    cursor: pointer;  // Change mouse cursor to pointer on hover
    padding: 0;
    margin: 0;
    text-decoration: underline;  // Optionally add underline to make it obvious it's clickable
    outline: none;  // Remove focus border on click

    &:hover, &:focus {
        color: #007BFF;  // Change color on hover/focus. Pick any color that suits your design
    }
`;




// const ButtonHolderDiv = styled.div`
//   @media ${deviceJobViewAll.mobile} {
//     display: none;  // Hide the icons by default
//
//
//   }
//
//     @media ${deviceJobViewAll.tablet} {
//       display: flex;
//       flex-direction: column;
//       background-color: blue;
//       margin-left: 10px;
//     }
// `;

// const FilterSelect = styled.select`
//   display: none;  // Hide the icons by default
//
//
//   @media ${deviceJobViewAll.mobile} {
//     display: flex;
//     width: 60vw;
//     margin-left: 20vw;
//     //position: absolute;
//     //top: 100%; /* position it right below the triggering element */
//     //left: 0;
//     .options {
//       position: absolute;
//       top: 5%; /* position it right below the triggering element */
//       left: 0;
//       background-color: red;
//     }
//
//   }
// `;

const FilterSelect = styled.select`
  display: none;  // Hide by default for larger screens

  @media ${deviceJobViewAll.mobile} {
    display: block;  // Show only for mobile
    // ... other styles ...
  }
`;

const JobViewAllDiv = styled.div`
  display: flex;
  
  @media ${deviceJobViewAll.mobile} {
    background-color:  #ff38ec;
    display: flex; /* Use flexbox layout */
    flex-direction: column; /* Display items in one row on mobile */
  }

  @media ${deviceJobViewAll.tablet} {
    display: flex; 
    flex-direction: column; 
    background-color: #ff38ec;
    justify-content: center;
    align-items: center;
  }
`;

const TitleDiv = styled.div`
  @media ${deviceJobViewAll.mobile} {
    flex-direction: column; 
    flex: 1; 
    background-color: orangered;
  }
  
    @media ${deviceJobViewAll.tablet} {
      display: flex;
      flex-direction: row;
      width: 90vw;
      background-color: orangered;
      border: 2px solid darkred;
    }
`;

const DataDiv = styled.div`
  @media ${deviceJobViewAll.mobile} {
    display: flex; 
    flex-direction: column; 
    align-items: center;
    flex: 1; 
    background-color: red;
    padding-bottom: 10px;
  }

  @media ${deviceJobViewAll.tablet} {
    display: flex;
    flex-direction: row;
    background-color: red;
    width: 90vw;
    border: 2px solid dimgray;
  }
`;

const JobTitleDiv = styled.div`
  display: flex;
  
  @media ${deviceJobViewAll.mobile} {
    flex-direction: column;
    align-items: center;
    background-color: yellow;
  }

    @media ${deviceJobViewAll.tablet} {
      border: 2px solid blueviolet; /* Add a blue-violet border */
      justify-content: center;      
      background-color: yellow;
      width: 90vw;
  }
`;

const JobDataDiv = styled.div`
  @media ${deviceJobViewAll.mobile} {
    background-color: green;
  }

    @media ${deviceJobViewAll.tablet} {
      display: flex;
      background-color: green;
      width: 90vw;
      justify-content: center;
      border: 2px solid blueviolet; 
    }
`;

const JobCard = styled.div`
  @media ${deviceJobViewAll.mobile} {
    display: flex;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    flex-direction: row; 
  }

  @media ${deviceJobViewAll.tablet} {
    display: flex;
    flex-direction: column; 
  }
`;


