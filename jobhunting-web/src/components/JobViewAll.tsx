import React, {useContext, useEffect, useState} from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem } from '@mui/material';
import { JobsContext } from "../services/jobcontext";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import {deviceJobViewAll} from "../common/ScreenSizes";
import axios from "axios";
import { useSortAndSelect } from './useSortAndSelect'; // Make sure to import from the correct path
import { SelectValue } from './useSortAndSelect'; // Replace with the actual path
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import {Slider} from "@mui/material";
export const JobViewAll = () => {
    const { jobs, updateJobRejected, meetingLink } = useContext(JobsContext);
    const [filter] = useState('');
    const [onlyShowResponded] = useState(false);
    const [sliderValues, setSliderValues] = useState<Record<string, number>>({});
// Inside JobViewAll component



    useEffect(() => {
        const initialSliderValues: Record<string, number> = {};
        jobs.forEach((job) => {
            initialSliderValues[job.id.toString()] = 3; // Set the default value (3 in this case) for each job
        });
        setSliderValues(initialSliderValues);
    }, [jobs]);

    const handleSliderChange = (jobId: string, newValue: number | number[]) => {
        if (typeof newValue === 'number') {
            setSliderValues((prevSliderValues) => ({
                ...prevSliderValues,
                [jobId]: newValue,
            }));
        }
    };


    const {
        sortOrder,
        selectValue,
        handleDateSortAsc,
        handleDateSortDesc,
        handleContactNameSortAsc,
        handleContactNameSortDesc,
        handleCompanyNameSortAsc,
        handleCompanyNameSortDesc,
        handleSelectChange,
    } = useSortAndSelect(); // Use the custom hook for sorting and selecting

    const navigate = useNavigate();
    const [isDescriptionModalOpen, setDescriptionModalOpen] = useState(false);
    const [selectedDescription, setSelectedDescription] = useState('');
    const [jobDeclined, setJobDeclined] = useState(false);

    const [jobResponses, setJobResponses] = useState<Record<string, SelectValue>>(
        () => JSON.parse(localStorage.getItem('jobResponses') || '{}')
    );

    useEffect(() => {
        localStorage.setItem('jobResponses', JSON.stringify(jobResponses));
    }, [jobResponses]);

    const openDescriptionModal = (description: string) => {
        setSelectedDescription(description);
        setDescriptionModalOpen(true);
    };

    const closeDescriptionModal = () => {
        setDescriptionModalOpen(false);
    };

    //the below is for a select input
    const handleResponseChange = async (e: React.ChangeEvent<{ value: unknown }>, jobId: string) => {
        const selectedValue = e.target.value as SelectValue;
        const targetJob = jobs.find((job) => job.id === Number(jobId));

        if (targetJob) {
            if (selectedValue === 'declined') {
                targetJob.companyresponded = false;
                setJobDeclined(true);
            } else if (selectedValue === 'accepted') {
                console.log("you were accepted")
                targetJob.companyrejected = false;
                targetJob.companyresponded = true;
                setJobDeclined(false);
            } else if (selectedValue === 'update') {
                console.log('do you want to update?');
            } else if (selectedValue === 'no response') {
                console.log('no response?');
            } else if (selectedValue === 'delete') {
                console.log('we may need to delete this');
            } else {
                targetJob.companyrejected = false;
                targetJob.companyresponded = false;
                setJobDeclined(false);
            }
            await updateJobOnServer(jobId, {
                companyrejected: targetJob.companyrejected,
                companyresponded: targetJob.companyresponded,
            });
            setJobResponses((prev) => ({
                ...prev,
                [jobId]: selectedValue,
            }));
        }
    };





    const updateJobOnServer = async (jobId: string, data: { companyrejected: boolean; companyresponded?: boolean }) => {
        try {
            const response = await axios.patch(`http://localhost:8080/api/jobs/update/${jobId}`, data, {
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.status !== 200) {
                throw new Error('Failed to update job.');
            }
        } catch (error) {
            console.error('Error updating job:', error);
        }
    };

    const currentDateMs = new Date().getTime();
    const TWENTY_ONE_DAYS = 21 * 24 * 60 * 60 * 1000;
    const twentyOneDaysAgoMs = currentDateMs - TWENTY_ONE_DAYS;

    const filteredAndRespondedJobs = jobs
        .filter((job) => !job.companyrejected)
        .filter(
            (job) => job.companyresponded || new Date(job.dateapplied).getTime() >= twentyOneDaysAgoMs
        )
        .filter(
            (job) =>
                (onlyShowResponded ? job.companyresponded : true) &&
                job.companyname.toLowerCase().includes(filter.toLowerCase())
        );

    const sortedAndRespondedJobs = [...filteredAndRespondedJobs].sort((a, b) => {
        console.log('Sorting jobs based on selectValue:', selectValue);

        let sortedJobs = [...jobs];

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
            // case 'accepted':
            //     console.log("hey there you got accepted")
            //
            //
            //     return (jobResponses[b.id] === 'accepted' ? 1 : 0) - (jobResponses[a.id] === 'accepted' ? 1 : 0);
            case 'accepted':
                // Example: Sort by whether job is accepted
                sortedJobs.sort((a, b) => jobResponses[a.id] === 'accepted' ? -1 : 1);
                break;
            case 'declined':
                return (jobResponses[b.id] === 'declined' ? 1 : 0) - (jobResponses[a.id] === 'declined' ? 1 : 0);
            case 'no response':
                console.log('Job A ID:', a.id, 'Response:', jobResponses[a.id]);
                console.log('Job B ID:', b.id, 'Response:', jobResponses[b.id]);
                const responseA = jobResponses[a.id] || 'no response';
                const responseB = jobResponses[b.id] || 'no response';
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

    const onButtonClick = async (response: SelectValue, jobId: string) => {
        const targetJob = jobs.find((job) => job.id === Number(jobId));
        if (!targetJob) return;
        if (response === 'accepted') {
            navigate(`/interviewsecured/${jobId}`);
            console.log('Preparing for interview');
        } else if (response === 'update') {
            navigate(`/updatejob/${jobId}`);
        } else if (response === 'delete') {
            axios
                .delete(`http://localhost:8080/api/jobs/${jobId}`)
                .then((res) => {
                    console.log('Job deleted successfully:', res.data);
                    window.location.reload();
                })
                .catch((err) => {
                    console.error('Error deleting job:', err);
                });
        } else if (response === 'declined') {
            console.log('Handling declined job application');
            targetJob.companyrejected = true;
            targetJob.companyresponded = false;
            setJobDeclined(true);
            setJobResponses((prev) => ({
                ...prev,
                [jobId]: 'declined',
            }));
            await updateJobOnServer(jobId, {
                companyrejected: true,
                companyresponded: false,
            });
        } else {
            console.log('Awaiting response from company');
        }
    };

    const valueToResponse = (value: number): SelectValue => {
        switch (value) {
            case 1:
                return 'accepted';
            case 2:
                return 'no response';
            case 3:
                return 'declined';
            default:
                return 'no response'; // Set a default value if needed
        }
    };



    return (
        <>
            {isMobile ? (
            <div>
                <SelectDiv>
                    <SimpleSelect value={sortOrder} onChange={(e: { target: { value: any; }; }) => handleSelectChange(e.target.value as SelectValue)}>
                        <option value="date-asc">Date Asc</option>
                        <option value="date-desc">Date Dsc</option>
                        <option value="company-a-z">Company Asc</option>
                        <option value="company-z-a">Company Dsc</option>
                        <option value="contact-a-z">Contact Asc</option>
                        <option value="contact-z-a">Contact Dsc</option>
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
                                        onChange={(e) => handleSelectChange(e.target.value as SelectValue)}
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
                                <StyledTableRow key={job.id}>
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
                                            <option value="declined">Declined</option>
                                            <option value="no response">No Response</option>
                                        </select>

                                        {/*<Slider*/}
                                        {/*    aria-label="Temperature"*/}
                                        {/*    value={jobResponses[job.id.toString()] || 'no response'}*/}
                                        {/*    valueLabelDisplay="auto"*/}
                                        {/*    valueLabelFormat={(value) => {*/}
                                        {/*        if (value === 1) {*/}
                                        {/*            return 'Schedule interview';*/}
                                        {/*        } else if (value === 2) {*/}
                                        {/*            return 'No Response';*/}
                                        {/*        } else if (value === 3) {*/}
                                        {/*            return 'Declined';*/}
                                        {/*        }*/}
                                        {/*        return ''; // Empty string for other values*/}
                                        {/*    }}*/}
                                        {/*    step={1}*/}
                                        {/*    min={1}*/}
                                        {/*    max={3}*/}
                                        {/*    style={{ width: '40%' }}*/}
                                        {/*    onChange={(event, newValue: number | string) => {*/}
                                        {/*        // TypeScript expects newValue to be either a number or a string*/}
                                        {/*        console.log('Slider value changed:', newValue);*/}

                                        {/*        // If you don't need to capture the exact value, you can omit the following line*/}
                                        {/*        setJobResponses({ ...jobResponses, [job.id.toString()]: newValue });*/}
                                        {/*    }}*/}
                                        {/*/>*/}










                                    </TableCell>
                                    <TableCell>
                                        <div>


                                            <FontAwesomeIcon
                                                icon={faTrash}
                                                className="custom-icon hidden-icons delete-icon"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => onButtonClick('delete', String(job.id))}
                                            />

                                            <FontAwesomeIcon
                                                icon={faEdit}
                                                className="custom-icon hidden-icons edit-icon"
                                                style={{ cursor: 'pointer', marginTop: '15px' }}
                                                onClick={() => onButtonClick('update', String(job.id))}
                                            />




                                        </div>



                                    </TableCell>
                                </StyledTableRow>
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
//


//
//
// const StyledTableRow = styled.tr`
//   /* Your other CSS styles for table rows here */
//   position: relative; /* Add this to maintain a stable layout */
//
//   /* Define styles for hidden icons container */
//   .hidden-icons {
//     display: none; /* Initially hide the icons container */
//     //position: absolute; /* Position icons absolutely within the cell */
//
//   }
//
//   /* Style for each icon container */
//   .icon-container {
//     display: inline-block; /* Display each icon container inline-block */
//     //margin-right: 10px; /* Increase margin-right for more space between icons */
//     //margin-bottom: 10px; /* Add margin-bottom to create space below each icon */
//   }
//
//   &:hover {
//     /* Make icons container visible on table row hover */
//     .hidden-icons {
//       display: block; /* Change to 'block' to show the icons container */
//     }
//
//     /* Add a green highlight on hover */
//     background-color: lightgreen;
//   }
//
//   /* Add these classes to your CSS stylesheet */
//   .custom-icon {
//     font-size: 20px; /* Adjust the font size as needed */
//   }
//
//   .custom-icon-lg {
//     font-size: 24px; /* Larger size */
//   }
//
//   .custom-icon-sm {
//     font-size: 16px; /* Smaller size */
//   }
//
// `;

const StyledTableRow = styled.tr`
  position: relative;

  .hidden-icons {
    display: none;
    position: absolute;
    right: 50px;
  }

  .delete-icon {
    top: 3px;
  }

  .edit-icon {
    top: 18px;
  }

  .icon-container {
    display: inline-block;
    padding-right: 30px;
    margin-bottom: 10px;
  }

  &:hover {
    .hidden-icons {
      display: block;
    }
    background-color: lightgreen;

    /* Use min-height to ensure the row height increases */
    min-height: 70px; /* Adjust as needed */
  }

  .custom-icon {
    font-size: 20px;
  }

  .custom-icon-lg {
    font-size: 24px;
  }

  .custom-icon-sm {
    font-size: 16px;
  }
`;



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

const StyledTableCell = styled(TableCell)`
  max-width: 20ch;
  white-space: pre-wrap;   // Allows content to wrap to the next line
  word-wrap: break-word;   // Allows breaking between words
  overflow-wrap: break-word; // In case a single word is longer than 25ch, it'll break
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