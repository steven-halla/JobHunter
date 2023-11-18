import React, {useContext, useEffect, useState} from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem } from '@mui/material';
import { JobsContext } from "../services/jobcontext";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCaretUp, faCaretDown, faTimes, faTimesCircle, faBan} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import {deviceJobViewAll} from "../common/ScreenSizes";
import {nothingHere} from "../common/ScreenSizes";
import axios from "axios";
import { useSortAndSelect } from './useSortAndSelect'; // Make sure to import from the correct path
import { SelectValue } from './useSortAndSelect'; // Replace with the actual path
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import {Slider} from "@mui/material";
import { faCalendar } from '@fortawesome/free-solid-svg-icons';



export const JobViewAll = () => {
    const [searchTerm, setSearchTerm] = useState('');

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
        'contact-asc' |
        'contact-desc' |
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
    const [interviewSortDirection, setInterviewSortDirection] = useState('dsc'); // New state for company sorting
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

    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

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



    const sortedAndRespondedJobs = [...filteredAndRespondedJobs]
        .filter(job =>
            !job.companyresponded &&
            (searchTerm.length < 3 || job.companyname.toLowerCase().includes(searchTerm.toLowerCase().trim()) || job.primarycontact.toLowerCase().includes(searchTerm.toLowerCase().trim()))
        )


        .sort((a, b) => {


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
            case 'contact-asc':
                return a.primarycontact.toLowerCase().localeCompare(b.primarycontact.toLowerCase());
            case 'contact-desc':
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


    const [isMobileNothing, setIsMobileNothing] = useState(window.matchMedia(nothingHere.mobile).matches);

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





    const toggleDateSortDirection = () => {
        const newSortOrder = dateSortDirection === 'asc' ? 'date-desc' : 'date-asc';
        setDateSortDirection(dateSortDirection === 'asc' ? 'desc' : 'asc');
        setSortOrder(newSortOrder);
    };


    const toggleCompanySortDirection = () => {
        const companySortOrder = companySortDirection === 'asc' ? 'company-desc' : 'company-asc';
        setCompanySortDirection(companySortOrder === 'company-asc' ? 'asc' : 'desc');
        setSortOrder(companySortOrder);
    };

    const toggleContactSortDirection = () => {
        const contactSortOrder = contactSortDirection === 'asc' ? 'contact-desc' : 'contact-asc';
        setContactSortDirection(contactSortOrder === 'contact-asc' ? 'asc' : 'desc');
        setSortOrder(contactSortOrder);
    };

    const toggleInterviewSortDirection = () => {
        const interviewSortOrder = interviewSortDirection === 'asc' ? 'accepted' : 'no response';
        setInterviewSortDirection(interviewSortOrder === 'no response' ? 'asc' : 'accepted');
        setSortOrder(interviewSortOrder);
    };


    return (
        <>
            {isMobileNothing ? (
                <div>

                </div>
            ) : (



                <StyledTableContainer>
                    <Table>
                        <StyledTableHead>
                            <TableRow>
                                <SearchBar
                                    type="text"
                                    placeholder="Search by company name or contact..."
                                    value={searchTerm}
                                    onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setSearchTerm(e.target.value)}
                                />
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
                                    <RedPillContainer>
                                        <button onClick={toggleContactSortDirection} style={{ all: 'unset' }}>
                                            {contactSortDirection === 'asc' ? 'Contact Asc' : 'Contact Desc'}
                                            <FontAwesomeIcon icon={contactSortDirection === 'asc' ? faCaretUp : faCaretDown} size="lg" />
                                        </button>
                                    </RedPillContainer>
                                </TableCell>

                                <TableCell>
                                    <RedPillContainer>
                                        <button onClick={toggleInterviewSortDirection} style={{ all: 'unset' }}>
                                            {interviewSortDirection === 'asc' ? 'Accepted' : 'No Response'}
                                            <FontAwesomeIcon icon={interviewSortDirection === 'asc' ? faCaretUp : faCaretDown} size="lg" />
                                        </button>
                                    </RedPillContainer>

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
            )



            }

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





const StyledTableHead = styled(TableHead)`
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
  background-color: grey;

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
  min-width: 120px;
  height: 30px;
  background-color: purple;
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

const SearchBar = styled.input`
  width: 25vw;
  padding: 10px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  display: block;
  margin-left: auto;
  margin-right: auto;
  background-color: white; /* Set the background color of SearchBar */
  position: sticky; /* Make it sticky */
  top: 0; /* Stick it to the top */
  z-index: 1; /* Ensure it's above other elements */
  overflow: hidden; /* Hide any overflow */
`;
