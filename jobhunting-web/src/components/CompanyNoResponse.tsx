import React, {useContext, useEffect, useState} from "react";
import {JobsContext} from "../services/jobcontext";
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import {device, deviceCompanyNoResponse} from "../common/ScreenSizes";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown, faCaretUp} from "@fortawesome/free-solid-svg-icons";



// shrink down vertically,
//more shade on south partk of box
//add more space between cards, look at linkedin toom there should be space from all sides



const ONE_WEEK = 168 * 60 * 60 * 1000;

export const CompanyNoResponse = () => {
    const { jobs, updateJobResponded, dateApplied } = useContext(JobsContext);

    const [isMobile, setIsMobile] = useState(window.matchMedia(device.mobile).matches);
    const [isLaptop, setIsLaptop] = useState(window.matchMedia(device.laptop).matches);

    const [sortOrder, setSortOrder] = useState<
        'select' |
        'company-a-z' |
        'company-z-a' |
        'contact-a-z' |
        'contact-z-a' |
        'rejected-yes' |
        'rejected-no' |
        'date-asc' |
        'date-desc' |
        'accepted' |
        'declined' |
        'no response' |
        'delete' |
        'update'
    >('select');

    // Get current date
    const currentDateMs = new Date().getTime();

    // Filter jobs older than 48 hours
    // Filter jobs older than 48 hours and sort by date applied in descending order
    const olderJobs = jobs.filter(job => {
        const timeDelta = currentDateMs - new Date(job.dateapplied).getTime();
        return timeDelta > ONE_WEEK && !job.companyresponded;
    }).sort((a, b) => new Date(b.dateapplied).getTime() - new Date(a.dateapplied).getTime());


    console.log("Older Jobs:", olderJobs);  // Debugging line
    //
    // const handleCheckboxChange = (jobId: number, checked: boolean) => {
    //     updateJobResponded(jobId, checked);
    //     // alert("Congrats on getting them to respond!")
    // };

    const sortedAndRespondedJobs = jobs
        .filter(job => !job.companyresponded) // This filters out jobs where companyresponded is true
        .sort((a, b) => {
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
                case 'rejected-yes':
                    return (b.companyrejected ? 1 : 0) - (a.companyrejected ? 1 : 0); // Moves rejected jobs to the top
                case 'rejected-no':
                    return (a.companyrejected ? 1 : 0) - (b.companyrejected ? 1 : 0); // Moves non-rejected jobs to the top
                default:
                    return 0;
            }
        });


    const handleSelectChange = (event: { target: { value: any; }; }) => {
        const selectedValue = event.target.value;

        switch(selectedValue) {
            case 'date-asc':
                handleDateSortAsc();
                break;
            case 'date-desc':
                handleDateSortDesc();
                break;
            case 'company-name-asc':
                handleCompanyNameSortAsc();
                break;
            case 'company-name-desc':
                handleCompanyNameSortDesc();
                break;
            case 'contact-asc':
                handleContactNameSortAsc();
                break;
            case 'contact-desc':
                handleContactNameSortDesc();
                break;

            case 'rejected-yes':
                handleRejectedSortYes();
                break;
            case 'rejected-no':
                handleRejectedSortNo();
                break;
            default:
                console.log("Invalid selection");
        }
    };

    const handleRejectedSortYes = () => {
        setSortOrder('rejected-yes');
        console.log("tee hee please keep clicking me")

    };

    const handleRejectedSortNo = () => {
        setSortOrder('rejected-no');
        console.log("tee hee please keep clicking me")

    };

    const handleDateSortAsc = () => {
        setSortOrder('date-asc');
        console.log("tee hee please keep clicking me")

    };

    const handleDateSortDesc = () => {
        setSortOrder('date-desc');
        console.log("tee hee stop clicking me")

    };

    const handleContactNameSortAsc = () => {
        setSortOrder('contact-a-z');
    };

    const handleContactNameSortDesc = () => {
        setSortOrder('contact-z-a');
    };

    const handleCompanyNameSortAsc = () => {
        setSortOrder('company-a-z');
        console.log("hi")
    };

    const handleCompanyNameSortDesc = () => {
        setSortOrder('company-z-a');
        console.log("bye")
    };


    const handleCheckboxChange = (jobId: number, checked: boolean) => {
        if (checked) { // If the user is trying to check the box
            const isConfirmed = window.confirm("Confirm company responded?");
            if (isConfirmed) {
                updateJobResponded(jobId, true);
                // Other actions after confirmation, if needed
            }
        } else {
            updateJobResponded(jobId, false);
            // Other actions after unchecking, if needed
        }
    };


    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.matchMedia(device.mobile).matches);
            setIsLaptop(window.matchMedia(device.laptop).matches);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);




    return (
        <CompanyNoResponseDiv>
            {isLaptop && (
                <>
                    {/* Header for laptop/desktop */}
                    <HeaderDiv>
                        <CompanyNameDiv>Company
                            <ButtonHolderDiv>
                                <FontAwesomeIcon icon={faCaretUp} size="lg" onClick={handleCompanyNameSortAsc} />
                                <FontAwesomeIcon icon={faCaretDown} size="lg" onClick={handleCompanyNameSortDesc} />
                            </ButtonHolderDiv>
                        </CompanyNameDiv>
                        <DateAppliedDiv>Date
                            <ButtonHolderDiv>
                                <FontAwesomeIcon icon={faCaretUp} size="lg" onClick={handleDateSortAsc} />
                                <FontAwesomeIcon icon={faCaretDown} size="lg" onClick={handleDateSortDesc} />
                            </ButtonHolderDiv>
                        </DateAppliedDiv>
                        <JobPosterDiv>Contact
                            <ButtonHolderDiv>
                                <FontAwesomeIcon icon={faCaretUp} size="lg" onClick={handleContactNameSortAsc} />
                                <FontAwesomeIcon icon={faCaretDown} size="lg" onClick={handleContactNameSortDesc} />
                            </ButtonHolderDiv>
                        </JobPosterDiv>
                        <JobLinkDiv>Job Link</JobLinkDiv>
                        <CompnanyRespondedDiv>Responded</CompnanyRespondedDiv>
                        <CompanyNameDiv>
                            Rejected?
                            <ButtonHolderDiv>
                                <FontAwesomeIcon icon={faCaretUp} size="lg" onClick={handleRejectedSortYes} />
                                <FontAwesomeIcon icon={faCaretDown} size="lg" onClick={handleRejectedSortNo} />
                            </ButtonHolderDiv>
                        </CompanyNameDiv>
                    </HeaderDiv>

                    {/* Jobs data */}
                    {sortedAndRespondedJobs.map((job) => (
                        <DataDiv key={job.id}>
                            <JobInfoDiv>{job.companyname}</JobInfoDiv>
                            <JobInfoDiv>{new Date(job.dateapplied).toISOString().split('T')[0]}</JobInfoDiv>
                            <JobInfoDiv>{job.jobposter}</JobInfoDiv>
                            <JobInfoDiv>
                                <a href={job.joblink} target="_blank" rel="noreferrer">Link</a>
                            </JobInfoDiv>
                            <JobInfoDiv>
                                <input
                                    type="checkbox"
                                    checked={job.companyresponded}
                                    onChange={(event) => handleCheckboxChange(job.id, event.target.checked)}
                                />
                            </JobInfoDiv>
                            <JobInfoDiv>
                                {job.companyrejected}
                                <input
                                    type="checkbox"
                                    checked={job.companyrejected}
                                />
                            </JobInfoDiv>
                        </DataDiv>
                    ))}
                </>
            )}
<SelectDiv>
    <SimpleSelect onChange={handleSelectChange}>
        <option value="company-name-asc">Company  (Asc)</option>
        <option value="company-name-desc">Company  (Desc)</option>
        <option value="date-asc">Date (Asc)</option>
        <option value="date-desc">Date (Desc)</option>
        <option value="contact-asc">Contact (Asc)</option>
        <option value="contact-desc">Contact (Desc)</option>
        <option value="rejected-yes">Rejected (Yes)</option>
        <option value="rejected-no">Rejected (No)</option>
    </SimpleSelect>
</SelectDiv>


            {isMobile && sortedAndRespondedJobs.map((job) => (

                <CardDiv key={job.id}>
                    {/* Left Column */}
                    <ColumnDiv>
                        <HeaderItem>Company</HeaderItem>
                        <HeaderItem>Date</HeaderItem>
                        <HeaderItem>Contact</HeaderItem>
                        <HeaderItem>Job Link</HeaderItem>
                        <HeaderItem>Responded</HeaderItem>
                        <HeaderItem>Rejected?</HeaderItem>
                    </ColumnDiv>

                    {/* Right Column */}
                    <ColumnDiv>
                        <DataItem>{job.companyname}</DataItem>
                        <DataItem>{new Date(job.dateapplied).toISOString().split('T')[0]}</DataItem>
                        <DataItem>{job.jobposter}</DataItem>
                        <DataItem>
                            <a href={job.joblink} target="_blank" rel="noreferrer">Link</a>
                        </DataItem>
                        <DataItem>
                            <input
                                type="checkbox"
                                checked={job.companyresponded}
                                onChange={(event) => handleCheckboxChange(job.id, event.target.checked)}
                            />
                        </DataItem>
                        <DataItem>
                            {job.companyrejected}
                            <input
                                type="checkbox"
                                checked={job.companyrejected}
                            />
                        </DataItem>
                    </ColumnDiv>
                </CardDiv>
            ))}
        </CompanyNoResponseDiv>
    );

};

const SelectDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
  justify-content: center;
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

const ButtonHolderDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 8px; // Adjusts the spacing between the Date text and the icons
`;

const CompanyNoResponseDiv = styled.div`
  display: flex;
  height: 100vh;
  width: 100vw;
  flex-direction: column;

`;


const HeaderDiv = styled.div`
  display: flex;
  height: 10vh;
  width: 90vw;
  margin-left: 5vw;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;

`;

const CompanyNameDiv = styled.div`
  display: flex;
  height: 10vh;
  width: 20%;
  justify-content: center;
  align-items: center;

`;

const JobPosterDiv = styled.div`
  display: flex;
  height: 10vh;
  width: 20%;
  justify-content: center;
  align-items: center;

`;

const DateAppliedDiv = styled.div`
  display: flex;
  height: 10vh;
  width: 20%;
  justify-content: center;
  align-items: center;

`;

const JobLinkDiv = styled.div`
  display: flex;
  height: 10vh;
  width: 20%;
  justify-content: center;
  align-items: center;
  white-space: pre-line;
 padding-left: 4vw;


  @media ${deviceCompanyNoResponse.laptop} {
    display: flex;
    padding-left: 0.1vw;

    
    /* Add more styles specific to this resolution here... */
  }
  
`;

const CompnanyRespondedDiv = styled.div`
  display: flex;
  height: 10vh;
  width: 20%;
  justify-content: center;
  align-items: center;

`;



const DataDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90vw;
  height: 90vh;
  margin-left: 5vw;

  @media ${device.mobile} {
    flex-direction: column;

  }
`;



const JobInfoDiv = styled.div`
  display: flex;

  justify-content: center;
  align-items: center;
  width: 20%;
  height: 20vh;
  border: 1px solid black; /* Add border styling here */
  word-break: break-all; /* Break words at any character if they can't fit */


`;

const CardDataDiv = styled.div`
  display: none;

  @media ${device.mobile} {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
`;

const CardHeaderDiv = styled.div`
  display: none;

  @media ${device.mobile} {

    display: flex;
    flex-direction: column;
    width: 100%;
  }
`;

export const CardDiv = styled.div`
    display: flex;
    flex-direction: row;
    border: 1px solid #ccc;
    margin: 10px 0;
`;

export const ColumnDiv = styled.div`
  flex: 1;
  padding: 10px;
  margin-left: 6%;
  white-space: nowrap;
  word-break: break-all;
  max-width: 100%; // Ensures the container doesn't grow beyond its parent's width
  overflow: hidden; // Hides any content that overflows the container
`;


export const HeaderItem = styled.div`
    /* You can add specific styles for header items here */
`;

export const DataItem = styled.div`
    /* You can add specific styles for data items here */
`;
