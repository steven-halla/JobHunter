import React, {useContext, useEffect, useState} from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem } from '@mui/material';
import { JobsContext } from "../services/jobcontext";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import {deviceJobViewAll} from "../common/ScreenSizes";
import axios from "axios";

//edit/delete should not be part of the app flow,make it two smaller buttons , or something else that
//is out of the way

//get rid of drop down and buttons
//also change the color state of each card based on what user is chooser
// light green for accepted
// only show buttons when the state is no response.
//    show two buttons accepted or declined by clicking the button it updates that row state.
//      create new state to do this.  Change background color based on state for row


export const JobViewAll = () => {
    const { jobs, updateJobRejected, meetingLink} = useContext(JobsContext);
    const [filter] = useState('');
    const [onlyShowResponded] = useState(false);
    const [sortOrder, setSortOrder] = useState<
        'select' |
        'company-a-z' |
        'company-z-a' |
        'contact-a-z' |
        'contact-z-a' |
        'date-asc' |
        'date-desc' |
        'accepted' |
        'declined' |
        'no response' |
        'delete' |
        'update'
    >('select');

    const [selectValue, setSelectValue] = useState<
        'select' |
        'accepted' |
        'declined' |
        'no response' |
        'delete' |
        'update'
    >('select');

    // const [jobResponses, setJobResponses] = useState<Record<string, JobResponse>>({});
    const navigate = useNavigate();
    const [isDescriptionModalOpen, setDescriptionModalOpen] = useState(false);
    const [selectedDescription, setSelectedDescription] = useState('');
    const [jobDeclined, setJobDeclined] = useState(false);

    const [jobResponses, setJobResponses] = useState<Record<string, JobResponse>>(
        () => JSON.parse(localStorage.getItem("jobResponses") || '{}')
    );

    useEffect(() => {
        setSortOrder(selectValue);
    }, [selectValue]);

    useEffect(() => {
        localStorage.setItem("jobResponses", JSON.stringify(jobResponses));
    }, [jobResponses]);

    type JobResponse = 'accepted' | 'declined' | 'no response' | 'delete' | 'update';

    const openDescriptionModal = (description: string) => {
        console.log("openDescriptionModal called with:", description);
        setSelectedDescription(description);
        setDescriptionModalOpen(true);
    };

    const closeDescriptionModal = () => {
        setDescriptionModalOpen(false);
    };

    const handleResponseChange = async (e: any, jobId: string) => {
        const selectedValue = e.target.value as JobResponse;
        const targetJob = jobs.find(job => job.id === Number(jobId));

        if (targetJob) {
            if (selectedValue === 'declined') {
                targetJob.companyresponded = false;
                setJobDeclined(true);
            } else if (selectedValue === 'accepted') {
                targetJob.companyrejected = false;
                targetJob.companyresponded = true;
                setJobDeclined(false);
            }
            else if (selectedValue === 'update') {
                console.log("do you want to update?")
            }
            else if (selectedValue === 'no response') {
                console.log("no response?")
            }
            else if (selectedValue === 'delete') {
                console.log("we may need to delete this")
            }
            else {
                targetJob.companyrejected = false;
                targetJob.companyresponded = false;
                setJobDeclined(false);
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

    const updateJobOnServer = async (jobId: string, data: { companyrejected: boolean; companyresponded?: boolean }) => {
        try {
            const response = await fetch(`http://localhost:8080/api/jobs/update/${jobId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error("Failed to update job.");
            }
        } catch (error) {
            console.error("Error updating job:", error);
        }
    };

    const currentDateMs = new Date().getTime(); // 1. Get current date in milliseconds
    const TWENTY_ONE_DAYS = 21 * 24 * 60 * 60 * 1000; // Equivalent of 21 days in milliseconds
    const twentyOneDaysAgoMs = currentDateMs - TWENTY_ONE_DAYS; // 2. Calculate the timestamp 21 days before current date

    const filteredAndRespondedJobs = jobs
        .filter(job => !job.companyrejected)
        .filter(job =>
            job.companyresponded || // If company responded, don't filter out
            new Date(job.dateapplied).getTime() >= twentyOneDaysAgoMs // If company didn't respond, it should be less than or equal to 21 days old to be included
        )
        .filter(job =>
            (onlyShowResponded ? job.companyresponded : true) &&
            job.companyname.toLowerCase().includes(filter.toLowerCase())
        );

    const sortedAndRespondedJobs = [...filteredAndRespondedJobs].sort((a, b) => {
        switch (sortOrder) {
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
            case 'accepted':
                return (jobResponses[b.id] === 'accepted' ? 1 : 0) - (jobResponses[a.id] === 'accepted' ? 1 : 0);
            case 'declined':
                return (jobResponses[b.id] === 'declined' ? 1 : 0) - (jobResponses[a.id] === 'declined' ? 1 : 0);
            case 'no response':
                console.log("Job A ID:", a.id, "Response:", jobResponses[a.id]);
                console.log("Job B ID:", b.id, "Response:", jobResponses[b.id]);
                const responseA = jobResponses[a.id] || 'no response'; // default to 'no response' if undefined
                const responseB = jobResponses[b.id] || 'no response'; // default to 'no response' if undefined
                return (responseB === 'no response' ? 1 : 0) - (responseA === 'no response' ? 1 : 0);
            case 'delete':
                return (jobResponses[b.id] === 'delete' ? 1 : 0) - (jobResponses[a.id] === 'delete' ? 1 : 0);
            case 'update':
                return (jobResponses[b.id] === 'update' ? 1 : 0) - (jobResponses[a.id] === 'update' ? 1 : 0);
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

    const onButtonClick = async (response: JobResponse, jobId: string) => {
        const targetJob = jobs.find(job => job.id === Number(jobId));

        if (!targetJob) return; // Exit if job is not found

        if (response === 'accepted') {
            navigate(`/interviewsecured/${jobId}`);
        }
        else if (response === 'update') {
            navigate(`/updatejob/${jobId}`);  // <-- navigate to the update job page with the jobId
        }
        else if (response === 'delete') {
            axios.delete(`http://localhost:8080/api/jobs/${jobId}`)
                .then(res => {
                    console.log('Job deleted successfully:', res.data);
                    window.location.reload();
                })
                .catch(err => {
                    console.error('Error deleting job:', err);
                });
        }
        else if (response === 'declined') {
            console.log("Handling declined job application");
            targetJob.companyrejected = true;
            targetJob.companyresponded = false;
            setJobDeclined(true);
            setJobResponses(prev => ({
                ...prev,
                [jobId]: 'declined'
            }));
            await updateJobOnServer(jobId, {
                companyrejected: true,
                companyresponded: false
            });
        } else {
            console.log("Awaiting response from company");
        }
    };

    return (
        <>
            {isMobile ? (
            <div>
                <SelectDiv>
                    <SimpleSelect value={sortOrder} onChange={(e: { target: { value: any; }; }) => setSortOrder(e.target.value as any)}>
                        <option value="date-asc">Date Asc</option>
                        <option value="date-desc">Date Dsc</option>
                        <option value="company-a-z">Company Asc</option>
                        <option value="company-z-a">Company Dsc</option>
                        <option value="contact-a-z">Contact Asc</option>
                        <option value="contact-z-a">Contact Dsc</option>
                        <option value="accepted">Accepted</option>
                        <option value="declined">Declined</option>
                        <option value="no response">No Response</option>
                        <option value="delete">Delete</option>
                        <option value="update">Update</option>
                    </SimpleSelect>
                </SelectDiv>

            {sortedAndRespondedJobs.map((job, index) => (
        <MobileJobCardDiv key={job.id}>
            <MobileTitleDiv>
                <MobileJobTitleDiv>Date</MobileJobTitleDiv>
                <MobileTableCellDiv>{new Date(job.dateapplied).toISOString().split('T')[0]}</MobileTableCellDiv>
            </MobileTitleDiv>
            <MobileTitleDiv>
                <MobileJobTitleDiv>Company</MobileJobTitleDiv>
                <MobileTableCellDiv>{job.companyname}</MobileTableCellDiv>
            </MobileTitleDiv>
            <MobileTitleDiv>
                <MobileJobTitleDiv>Description</MobileJobTitleDiv>
                <MobileTableCellDiv>
                    <TextButton onClick={() => openDescriptionModal(job.description)}>Click to View</TextButton>
                </MobileTableCellDiv>
            </MobileTitleDiv>
            <MobileTitleDiv>
                <MobileJobTitleDiv>Contact</MobileJobTitleDiv>
                <MobileTableCellDiv>
                    <MobileTableCellDiv>{job.primarycontact}</MobileTableCellDiv>
                </MobileTableCellDiv>
            </MobileTitleDiv>
            <MobileTitleDiv>
                <MobileJobTitleDiv>job link</MobileJobTitleDiv>
                <MobileTableCellDiv>
                        <TextButton><a href={job.joblink} target="_blank" rel="noopener noreferrer">LINK</a></TextButton>
                </MobileTableCellDiv>
            </MobileTitleDiv>
            <MobileTitleDiv>
                <MobileJobTitleDiv>website</MobileJobTitleDiv>
                <MobileTableCellDiv>
                    <TextButton><a href={job.companywebsitelink} target="_blank" rel="noopener noreferrer">LINK</a></TextButton>
                </MobileTableCellDiv>
            </MobileTitleDiv>
            <MobileTitleDiv>
                <MobileJobTitleDiv>  <select value={jobResponses[job.id] || 'no response'} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleResponseChange(e, String(job.id))}>
                    <option value="accepted">Accepted</option>
                    <option value="update">Update</option>
                    <option value="declined">Declined</option>
                    <option value="delete">Delete</option>
                    <option value="no response">No Response</option>
                </select></MobileJobTitleDiv>
                <MobileTableCellDiv>
                    {jobResponses[job.id] === "accepted" ? (
                        <Button
                            variant="contained"
                            style={{backgroundColor: 'green', width: '120px', height: '40px'}}
                            onClick={() => onButtonClick('accepted', String(job.id))}
                        >
                            Interview
                        </Button>
                    ) : jobResponses[job.id] === "update" ? (
                        <Button
                            variant="contained"
                            style={{backgroundColor: 'purple', width: '120px', height: '40px'}}
                            onClick={() => onButtonClick('update', String(job.id))}
                        >
                            Update
                        </Button>
                    ) : jobResponses[job.id] === "declined" ? (
                        <Button
                            variant="contained"
                            style={{backgroundColor: 'orange', width: '120px', height: '40px'}}
                            onClick={() => onButtonClick('declined', String(job.id))}
                        >
                            Declined
                        </Button>
                    ) : jobResponses[job.id] === "delete" ? (
                        <Button
                            variant="contained"
                            style={{backgroundColor: 'red', width: '120px', height: '40px'}}
                            onClick={() => onButtonClick('delete', String(job.id))}
                        >
                            Delete
                        </Button>
                    ) : null}
                </MobileTableCellDiv>
            </MobileTitleDiv>
        </MobileJobCardDiv>
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
                                <TableCell>Job Link</TableCell>
                                <TableCell>Website </TableCell>
                                <TableCell>
                                    <Select
                                        style={{ width: '140px', height: '25px' }}
                                        value={selectValue}
                                        onChange={e => setSelectValue(e.target.value as
                                        "no response" |
                                        "accepted" |
                                        "declined" |
                                        "delete" |
                                        "update"
                                    )}
                                        renderValue={(value) => value ? value : 'Select'}
                                    >
                                        <MenuItem value="accepted">Response: Accepted</MenuItem>
                                        <MenuItem value="declined">Response: Declined</MenuItem>
                                        <MenuItem value="no response">Response: No Response</MenuItem>
                                        <MenuItem value="delete">Response: Delete</MenuItem>
                                        <MenuItem value="update">Response: Update</MenuItem>
                                    </Select>
                                </TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </StyledTableHead>
                        <TableBody>
                            {sortedAndRespondedJobs.map((job, index) => (
                                <TableRow key={job.id}>
                                    <TableCell>{new Date(job.dateapplied).toISOString().split('T')[0]}</TableCell>
                                    <StyledTableCell>{job.companyname}</StyledTableCell>
                                    <TableCell>
                                        <TextButton onClick={() => openDescriptionModal(job.description)}>Click to View</TextButton>
                                    </TableCell>
                                    <StyledTableCell>{job.primarycontact}</StyledTableCell>
                                    <TableCell><a href={job.joblink} target="_blank" rel="noopener noreferrer">LINK</a></TableCell>
                                    <TableCell><a href={job.companywebsitelink} target="_blank" rel="noopener noreferrer">LINK</a></TableCell>
                                    <TableCell>
                                        <select value={jobResponses[job.id] || 'no response'} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleResponseChange(e, String(job.id))}>
                                            <option value="accepted">Accepted</option>
                                            <option value="update">Update</option>
                                            <option value="declined">Declined</option>
                                            <option value="delete">Delete</option>
                                            <option value="no response">No Response</option>
                                        </select>
                                    </TableCell>
                                    <TableCell>
                                        {jobResponses[job.id] === "accepted" ? (
                                            <Button
                                                variant="contained"
                                                style={{backgroundColor: 'green', width: '120px', height: '40px'}}
                                                onClick={() => onButtonClick('accepted', String(job.id))}
                                            >
                                                Interview
                                            </Button>
                                        ) : jobResponses[job.id] === "update" ? (
                                            <Button
                                                variant="contained"
                                                style={{backgroundColor: 'purple', width: '120px', height: '40px'}}
                                                onClick={() => onButtonClick('update', String(job.id))}
                                            >
                                                Update
                                            </Button>
                                        ) : jobResponses[job.id] === "declined" ? (
                                            <Button
                                                variant="contained"
                                                style={{backgroundColor: 'orange', width: '120px', height: '40px'}}
                                                onClick={() => onButtonClick('declined', String(job.id))}
                                            >
                                                Declined
                                            </Button>

                                        ) : jobResponses[job.id] === "delete" ? (
                                            <Button
                                                variant="contained"
                                                style={{backgroundColor: 'red', width: '120px', height: '40px'}}
                                                onClick={() => onButtonClick('delete', String(job.id))}
                                            >
                                                Delete
                                            </Button>
                                        ) : null}
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

const MobileJobCardDiv = styled.div`
    border: 1px solid #ccc;
    padding: 10px;
    margin: 10px 0;
    display: flex;
    flex-direction: column;
    background-color: #f7f7f7; // Light gray background
`;

const MobileTitleDiv = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
`;

const MobileJobTitleDiv = styled.div`
    font-weight: bold;
    margin-right: 10px;
`;

const MobileTableCellDiv = styled.div`
    flex: 1;
    text-align: right;
`;





















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


const SimpleSelect = styled.select`
    padding: 5px 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    appearance: none;
    outline: none;
  width: 40vw;
`;
const SelectDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
  justify-content: center;
`;