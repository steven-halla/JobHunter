import React, {useContext, useEffect, useState} from "react";
import {JobsContext} from "../services/jobcontext";
import styled from 'styled-components';
import {device, deviceCompanyNoResponse} from "../common/ScreenSizes";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown, faCaretUp} from "@fortawesome/free-solid-svg-icons";
import { useSortAndSelect } from './useSortAndSelect'; // Make sure to import from the correct path
import { SelectValue } from './useSortAndSelect'; // Replace with the actual path

// shrink down vertically,
//more shade on south partk of box
//add more space between cards, look at linkedin toom there should be space from all sides

export const CompanyNoResponse = () => {
    const { jobs, updateJobResponded, dateApplied } = useContext(JobsContext);
    const [searchTerm, setSearchTerm] = useState('');

    const [isMobile, setIsMobile] = useState(window.matchMedia(device.mobile).matches);
    const [isLaptop, setIsLaptop] = useState(window.matchMedia(device.laptop).matches);

    const {
        sortOrder,
        setSortOrder, // Ensure you have this in your destructured object
        selectValue,
        handleDateSortAsc,
        handleDateSortDesc,
        handleContactNameSortAsc,
        handleContactNameSortDesc,
        handleCompanyNameSortAsc,
        handleCompanyNameSortDesc,
        handleSelectChange,
    } = useSortAndSelect();


    //this is for filter
    const sortedAndRespondedJobs = jobs
        .filter(job =>
            !job.companyresponded &&
            (searchTerm.length < 3 || job.companyname.toLowerCase().includes(searchTerm.toLowerCase().trim()) || job.primarycontact.toLowerCase().includes(searchTerm.toLowerCase().trim()))
        )


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

    const handleRejectedSortYes = () => {
        setSortOrder('rejected-yes');
    };

    const handleRejectedSortNo = () => {
        setSortOrder('rejected-no');
    };

    const handleCheckboxChange = (jobId: number, checked: boolean) => {
        if (checked) {
            const isConfirmed = window.confirm("Confirm company responded?");
            if (isConfirmed) {
                updateJobResponded(jobId, true);
            }
        } else {
            updateJobResponded(jobId, false);
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
            <input
                type="text"
                placeholder="Search by company name or contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

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
    <SimpleSelect value={selectValue} onChange={(e: { target: { value: string; }; }) => handleSelectChange(e.target.value as SelectValue)}>

    <option value="date-asc">Date Asc</option>
        <option value="date-desc">Date Dsc</option>
        <option value="company-a-z">Company Asc</option>
        <option value="company-z-a">Company Dsc</option>
        <option value="contact-a-z">Contact Asc</option>
        <option value="contact-z-a">Contact Dsc</option>
    </SimpleSelect>
</SelectDiv>

            {isMobile && sortedAndRespondedJobs.map((job) => (

                <CardDiv key={job.id}>
                    <ColumnDiv>
                        <HeaderItemDiv>Company</HeaderItemDiv>
                        <HeaderItemDiv>Date</HeaderItemDiv>
                        <HeaderItemDiv>Contact</HeaderItemDiv>
                        <HeaderItemDiv>Job Link</HeaderItemDiv>
                        <HeaderItemDiv>Responded</HeaderItemDiv>
                        <HeaderItemDiv>Rejected?</HeaderItemDiv>
                    </ColumnDiv>
                    <ColumnDiv>
                        <DataItemDiv>{job.companyname}</DataItemDiv>
                        <DataItemDiv>{new Date(job.dateapplied).toISOString().split('T')[0]}</DataItemDiv>
                        <DataItemDiv>{job.jobposter}</DataItemDiv>
                        <DataItemDiv>
                            <a href={job.joblink} target="_blank" rel="noreferrer">Link</a>
                        </DataItemDiv>
                        <DataItemDiv>
                            <input
                                type="checkbox"
                                checked={job.companyresponded}
                                onChange={(event) => handleCheckboxChange(job.id, event.target.checked)}
                            />
                        </DataItemDiv>
                        <DataItemDiv>
                            {job.companyrejected}
                            <input
                                type="checkbox"
                                checked={job.companyrejected}
                            />
                        </DataItemDiv>
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
  background-color: rgba(14,55,138,0.86) ;
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
  max-width: 100%; 
  overflow: hidden; 
`;


export const HeaderItemDiv = styled.div`
    /* You can add specific styles for header items here */
`;

export const DataItemDiv = styled.div`
    /* You can add specific styles for data items here */
`;
