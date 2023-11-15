import React, {useContext, useEffect, useState} from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem } from '@mui/material';
import { JobsContext } from "../services/jobcontext";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCaretUp, faCaretDown, faTimes, faTimesCircle, faBan} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import {deviceJobViewAll} from "../common/ScreenSizes";
import axios from "axios";
import { useSortAndSelect } from './useSortAndSelect'; // Make sure to import from the correct path
import { SelectValue } from './useSortAndSelect'; // Replace with the actual path
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import {Slider} from "@mui/material";
import { faCalendar } from '@fortawesome/free-solid-svg-icons';



export const JobViewAll = () => {
    const { jobs, updateJobSoftDelete, updateJobRejected, meetingLink} = useContext(JobsContext);
    const [filter] = useState('');
    const [onlyShowResponded] = useState(false);

    const [sortingCriteria, setSortingCriteria] = useState('date-asc'); // default sorting criteria


    const [sortOrder, setSortOrder] = useState<
        'select' |
        'companyResponded' |
        'company-a-z' |
        'company-z-a' |
        'contact-a-z' |
        'contact-z-a' |
        'date-asc' |
        'date-desc' |
        'accepted' |
        'meetingLink' |
        'declined' |
        'no response' |
        'delete' |
        'update' |
        'olderThanSevenDays' |
        'company-asc' | // Add this
        'company-desc'  // And this
    >('select');

    const [selectValue, setSelectValue] = useState<
        'select' |
        'accepted' |
        'no response' |
        'declined' |
        'delete' |
        'update' |
        'olderThanSevenDays' // include this in your type definition

    >('select');


    // const [jobResponses, setJobResponses] = useState<Record<string, JobResponse>>({});
    const history = useNavigate();
    const navigate = useNavigate();


    const [isDescriptionModalOpen, setDescriptionModalOpen] = useState(false);
    const [selectedDescription, setSelectedDescription] = useState('');


    const [open, setOpen] = useState(false);
    const [jobDeclined, setJobDeclined] = useState(false);

    const [jobResponses, setJobResponses] = useState<Record<string, JobResponse>>(
        () => JSON.parse(localStorage.getItem("jobResponses") || '{}')
    );

    const [dateSortDirection, setDateSortDirection] = useState('dsc');
    const [contactSortDirection, setContactSortDirection] = useState('dsc'); // New state for contact sorting
    const [companySortDirection, setCompanySortDirection] = useState('dsc'); // New state for company sorting
    const [rejectedSortStatus, setRejectedSortStatus] = useState('no'); // New state for rejected sorting



    useEffect(() => {
        // You can add additional logic here if needed
        setSortOrder(selectValue);
        console.log("hi")
        //this is only ran when selectValue changes, this is powerful and important to remember
    }, [selectValue]);

    useEffect(() => {
        localStorage.setItem("jobResponses", JSON.stringify(jobResponses));
    }, [jobResponses]);


    type JobResponse = 'accepted' | 'declined' | 'no response' | 'delete' | 'update' | 'olderThanSevenDays' ;
    interface StyledTableRowProps {
        response: JobResponse;
        companyRejected: boolean;
        companyResponded: boolean;
        meetingLink: string;
        isOlderThanSevenDays: boolean; // New prop
    }

    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds



    const StyledTableRow = styled.tr<StyledTableRowProps>`
      position: relative;
      background: ${props => {
        if (props.companyRejected) {
          return 'linear-gradient(to left, #ff0000, #ff9999)'; // Red gradient (light to slightly darker)
        }
        else if (props.meetingLink) {
          return 'linear-gradient(to left,#34e89e, #78ffd6)'; // Green gradient (light to slightly darker)
        }
        else if (props.isOlderThanSevenDays) {
          return 'linear-gradient(to left, #FFDD3C, #FFEA61)'; // Yellow gradient (light to slightly darker)
        }
        else if (!props.companyResponded) {
          return 'linear-gradient(to left, #808080, #b3b3b3)'; // Grey gradient (light to slightly darker)
        }
        return 'linear-gradient(to left, #808080, #b3b3b3)'; // Default gradient color
      }};



      .hidden-icons {
    display: none;
    position: absolute;
  }

  .no-response-icon{
    bottom: 27px;
    padding-left: 41.5px;
  }




  .edit-icon {
    top: 18px;
    padding-left: 41.5px;

  }
  
  .scedule-icon {
    margin-right: 45px;
    bottom: 12px;
  }

  .trash-icon {
    margin-left: 65px;
    bottom: 12px;
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
    //background-color: lightgreen;

    /* Use min-height to ensure the row height increases */
    min-height: 70px; /* Adjust as needed */
  }

  .custom-icon {
    font-size: 20px;
  }

  .custom-icon-lg {
    font-size: 30px;
  }

  .custom-icon-sm {
    font-size: 16px;
  }
`;


    const openDescriptionModal = (description: string) => {
        console.log("openDescriptionModal called with:", description);
        setSelectedDescription(description);
        setDescriptionModalOpen(true);
    };

    const closeDescriptionModal = () => {
        setDescriptionModalOpen(false);
    };

    const onButtonClick = async (response: JobResponse, jobId: string) => {
        const targetJob = jobs.find(job => job.id === Number(jobId));

        if (!targetJob) return; // Exit if job is not found

        if (response === 'accepted') {
            targetJob.companyrejected = false;
            targetJob.companyresponded = true;
            setJobDeclined(false);
            navigate(`/interviewsecured/${jobId}`);
            console.log("Preparing for interview");
        }
        else if (response === 'update') {
            navigate(`/updatejob/${jobId}`);  // <-- navigate to the update job page with the jobId

        }

        else if (response === 'no response') {
            setJobResponses(jobResponses)

        }

        else if (response === 'delete') {
            // targetJob.companyrejected = true;
            // targetJob.jobsoftdelete = true;
// Assuming jobId is the ID of the job you want to soft delete
            updateJobSoftDelete(Number(jobId), true);
            console.log("the state of soft delete is " + targetJob.jobsoftdelete)

        }



        else if (response === 'declined') {
            console.log("Handling declined job application");

            // Set companyrejected to true and companyresponded to false
            targetJob.companyrejected = true;
            targetJob.companyresponded = false;

            // Update the state for UI feedback
            setJobDeclined(true);
            setJobResponses(prev => ({
                ...prev,
                [jobId]: 'declined'
            }));

            // Update the database
            await updateJobOnServer(jobId, {
                companyrejected: true,
                companyresponded: false
            });
        } else {
            console.log("Awaiting response from company");
        }
    };

    const handleResponseChange = async (e: any, jobId: string) => {
        const selectedValue = e.target.value as JobResponse;
        const targetJob = jobs.find(job => job.id === Number(jobId));

        // <-- get the navigate function using the hook

        if (targetJob) {
            if (selectedValue === 'declined') {
                targetJob.companyresponded = false;
                // targetJob.companyrejected = true;
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
            case 'select':
                // Default sorting, for example by date applied in ascending order
                return new Date(a.dateapplied).getTime() - new Date(b.dateapplied).getTime();

            case 'company-a-z':
                return a.companyname.toLowerCase().localeCompare(b.companyname.toLowerCase());
            case 'company-z-a':
                return b.companyname.toLowerCase().localeCompare(a.companyname.toLowerCase());
            case 'company-asc':
                return a.companyname.toLowerCase().localeCompare(b.companyname.toLowerCase());
            case 'company-desc':
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
                console.log("you have been accepted")
                return (jobResponses[b.id] === 'accepted' ? 1 : 0) - (jobResponses[a.id] === 'accepted' ? 1 : 0);
            case 'declined':
                return (jobResponses[b.id] === 'declined' ? 1 : 0) - (jobResponses[a.id] === 'declined' ? 1 : 0);
            case 'no response':
                console.log("Job A ID:", a.id, "Response:", jobResponses[a.id]);
                console.log("Job B ID:", b.id, "Response:", jobResponses[b.id]);
                // return (jobResponses[b.id] === 'no response' ? 1 : 0) - (jobResponses[a.id] === 'no response' ? 1 : 0);
                const responseA = jobResponses[a.id] || 'no response'; // default to 'no response' if undefined
                const responseB = jobResponses[b.id] || 'no response'; // default to 'no response' if undefined
                return (responseB === 'no response' ? 1 : 0) - (responseA === 'no response' ? 1 : 0);

            case 'delete':
                return (jobResponses[b.id] === 'delete' ? 1 : 0) - (jobResponses[a.id] === 'delete' ? 1 : 0);
            case 'olderThanSevenDays':
                // Assuming 'dateapplied' holds the application date
                const aDateDiff = new Date().getTime() - new Date(a.dateapplied).getTime();
                const bDateDiff = new Date().getTime() - new Date(b.dateapplied).getTime();
                const aOlderThan7Days = aDateDiff > 7 * 24 * 60 * 60 * 1000 ? 1 : 0;
                const bOlderThan7Days = bDateDiff > 7 * 24 * 60 * 60 * 1000 ? 1 : 0;
                return bOlderThan7Days - aOlderThan7Days;

            case 'companyResponded':
                return (b.companyresponded === false ? 1 : 0) - (a.companyresponded === false ? 1 : 0);


            case 'update':
                return (jobResponses[b.id] === 'update' ? 1 : 0) - (jobResponses[a.id] === 'update' ? 1 : 0);

            case 'meetingLink':
                console.log("I have a meeting link for you bud bud")
                return (b.meetingLink ? 1 : 0) - (a.meetingLink ? 1 : 0);
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

    const handleSortByAccepted = () => {
        setSortOrder('accepted');
    };

    const handleSortByMeetingLink = () => {
        setSortOrder('meetingLink');
    };

    const handleSortByNoResponse = () => {
        setSortOrder('no response');
    };

    const handleSortByCompanyResponded = () => {
        setSortOrder('companyResponded');
    };

    const toggleDateSortDirection = () => {
        const newSortOrder = dateSortDirection === 'asc' ? 'date-desc' : 'date-asc';
        setDateSortDirection(newSortOrder === 'date-asc' ? 'asc' : 'desc');
        setSortOrder(newSortOrder);
    };

    const toggleCompanySortDirection = () => {
        const companySortOrder = companySortDirection === 'asc' ? 'company-desc' : 'company-asc';
        setCompanySortDirection(companySortOrder === 'company-asc' ? 'asc' : 'desc');
        setSortOrder(companySortOrder);
    };

    // Example sorting logic based on sortOrder



    //
    // const toggleContactSortDirection = () => {
    //     setContactSortDirection(contactSortDirection === 'asc' ? 'dsc' : 'asc');
    //     setSortingCriteria(contactSortDirection === 'asc' ? 'contact-z-a' : 'contact-a-z');
    //     // Reset other sort buttons to their original state
    //     setDateSortDirection('dsc');
    //     setCompanySortDirection('dsc');
    //     setRejectedSortStatus('yes');
    // };
    //
    // const toggleCompanySortDirection = () => {
    //     setCompanySortDirection(companySortDirection === 'asc' ? 'dsc' : 'asc');
    //     setSortingCriteria(companySortDirection === 'asc' ? 'company-z-a' : 'company-a-z');
    //     // Reset other sort buttons to their original state
    //     setDateSortDirection('dsc');
    //     setContactSortDirection('dsc');
    //     setRejectedSortStatus('yes');
    // };
    //
    // const toggleRejectedSortStatus = () => {
    //     setRejectedSortStatus(rejectedSortStatus === 'no' ? 'yes' : 'no');
    //     setSortingCriteria(rejectedSortStatus === 'no' ? 'rejected-yes' : 'rejected-no');
    //     // Reset other sort buttons to their original state
    //     setDateSortDirection('dsc');
    //     setContactSortDirection('dsc');
    //     setCompanySortDirection('dsc');
    // };



    return (
        <>
            {isMobile ? (
                <div>
                    <SelectDiv>
                        <SimpleSelect value={sortOrder} onChange={(e: { target: { value: any; }; }) => setSortOrder(e.target.value as SelectValue)}>
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

                                    <RedPillContainer>
                                        <button onClick={toggleDateSortDirection} style={{ all: 'unset' }}>
                                            {dateSortDirection === 'asc' ? 'Date Asc' : 'Date Desc'}
                                            <FontAwesomeIcon icon={dateSortDirection === 'asc' ? faCaretUp : faCaretDown} size="lg" />
                                        </button>
                                    </RedPillContainer>
                                </TableCell>
                                <TableCell>
                                    <RedPillContainer>
                                        <button onClick={toggleCompanySortDirection} style={{ all: 'unset' }}>
                                            {companySortDirection === 'asc' ? 'Company Asc' : 'Company Desc'}
                                            <FontAwesomeIcon icon={companySortDirection === 'asc' ? faCaretUp : faCaretDown} size="lg" />
                                        </button>
                                    </RedPillContainer>
                                </TableCell>
                                <TableCell>
                                    <SortLabelContainer>
                                        Contact
                                        <ButtonHolderDiv>
                                            <FontAwesomeIcon icon={faCaretUp} size="lg" onClick={handleContactNameSortAsc} />
                                            <FontAwesomeIcon icon={faCaretDown} size="lg" onClick={handleContactNameSortDesc} />
                                        </ButtonHolderDiv>
                                    </SortLabelContainer>
                                </TableCell>

                                <TableCell>
                                    <SortLabelContainer>
                                        Interiew / no response
                                        <ButtonHolderDiv>
                                            <FontAwesomeIcon icon={faCaretUp} size="lg" onClick={handleSortByCompanyResponded} />
                                            <FontAwesomeIcon icon={faCaretDown} size="lg" onClick={handleSortByMeetingLink} />
                                        </ButtonHolderDiv>
                                    </SortLabelContainer>

                                </TableCell>
                            </TableRow>
                        </StyledTableHead>

                    </Table>



                    <CardBoxDiv>
                        {sortedAndRespondedJobs.map((job, index) => (
                            <CardDiv
                                key={index}
                                companyRejected={job.companyrejected}
                                companyResponded={job.companyresponded}
                                meetingLink={job.meetingLink}
                                isOlderThanSevenDays={(new Date().getTime() - new Date(job.dateapplied).getTime()) > SEVEN_DAYS_MS}
                            >
                                <h5><a href={job.companywebsitelink} target="_blank" rel="noopener noreferrer">{job.companyname}</a></h5>
                                <h5>{job.primarycontact}</h5>
                                <TextButton onClick={() => openDescriptionModal(job.description)}>Click to View</TextButton>
                                <h5>{new Date(job.dateapplied).toISOString().split('T')[0]}</h5>
                                <h5><a href={job.joblink} target="_blank" rel="noopener noreferrer">Job Link</a></h5>
                            </CardDiv>
                        ))}
                    </CardBoxDiv>


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




const CardBoxDiv = styled.div`
  display: flex;
  flex-direction: column; /* Keep the cards aligned vertically */
  gap: 10px; /* Maintain the 10px spacing between cards */
  align-items: center; /* Center-align the cards horizontally */
  justify-content: center; /* Center the content vertically if needed */
`;

interface CardProps {
    companyRejected: boolean;
    companyResponded: boolean;
    meetingLink: string;
    isOlderThanSevenDays: boolean;
}

const CardDiv = styled.div<CardProps>`
  position: relative;
  background: ${props => {
    if (props.companyRejected) {
        return 'linear-gradient(to left, #ff0000, #ff9999)'; // Red gradient
    } else if (props.meetingLink) {
        return 'linear-gradient(to left, #34e89e, #78ffd6)'; // Green gradient
    } else if (props.isOlderThanSevenDays) {
        return 'linear-gradient(to left, #FFDD3C, #FFEA61)'; // Yellow gradient
    } else if (!props.companyResponded) {
        return 'linear-gradient(to left, #808080, #b3b3b3)'; // Grey gradient
    }
    return 'linear-gradient(to left, #808080, #b3b3b3)'; // Default gradient color
}};
  // ... other styles
  padding: 10px;
  border: 1px solid #ccc;
  min-width: 50%;
  margin-top: 1%;
  display: flex;
  flex-direction: column;
  align-items: center;

  // Icons styles
  .hidden-icons {
    display: none;
    position: absolute;
    // ... other icon styles
  }

  &:hover {
    .hidden-icons {
      display: block;
    }
    min-height: 70px;
  }

  .custom-icon {
    font-size: 20px;
  }

  .custom-icon-lg {
    font-size: 30px;
  }

  .custom-icon-sm {
    font-size: 16px;
  }
`;

const RedPillContainer = styled.div`
  display: inline-block;
  min-width: 150px;
  height: 30px;
  background-color: red;
  border-radius: 15px;
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.5);
  margin-right: 1.5%;
  
  border: 2px solid black;
  text-align: center; /* Center children horizontally */
  //line-height: 30px; /* Center children vertically */

  & > svg {
    margin-left: 10px; /* Add margin to the left of the FontAwesomeIcon */
  }

  &:hover {
    cursor: pointer;
  }
`;