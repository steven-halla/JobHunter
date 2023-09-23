import React, {useContext, useEffect, useState} from 'react';
import styled from 'styled-components';
import {JobsContext} from "../services/jobcontext";
import { deviceJobViewAll} from "../common/ScreenSizes";
import { useNavigate } from 'react-router-dom';
import {faCaretUp, faCaretDown} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export const JobViewAll = () => {

    const { jobs, updateJobRejected, meetingLink} = useContext(JobsContext);
    const [filter] = useState('');
    const [onlyShowResponded] = useState(false);
    const [sortOrder, setSortOrder] = useState<'a-z' | 'z-a' | 'date-asc' | 'date-desc'>('date-asc');
    const [jobResponses, setJobResponses] = useState<Record<string, JobResponse>>({});
    const history = useNavigate();
    const navigate = useNavigate();



    type JobResponse = 'accepted' | 'declined' | 'no response';

    const handleResponseChange = async (e: React.ChangeEvent<HTMLSelectElement>, jobId: string) => {
        const selectedValue = e.target.value as JobResponse;
        const targetJob = jobs.find(job => job.id === Number(jobId));
        if(targetJob) {
            if(selectedValue === 'declined') {
                targetJob.companyrejected = true;
            } else {
                targetJob.companyrejected = false;
            }
            await updateJobOnServer(jobId, { companyrejected: targetJob.companyrejected });
            setJobResponses(prev => ({
                ...prev,
                [jobId]: selectedValue
            }));

            // Redirect if the selected value is "accepted"
            // Redirect if the selected value is "accepted"
            if (selectedValue === 'accepted') {
                navigate(`/interviewsecured/${jobId}`);
            }

        }


    };


    const updateJobOnServer = async (jobId: string, data: { companyrejected: boolean }) => {
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
            case 'a-z':
                return a.companyname.toLowerCase().localeCompare(b.companyname.toLowerCase());
            case 'z-a':
                return b.companyname.toLowerCase().localeCompare(a.companyname.toLowerCase());
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



    return (
        <JobViewAllDiv>

            <FilterSelect value={sortOrder} onChange={(e: { target: { value: any; }; }) => setSortOrder(e.target.value as any)}>

                <option value="date-asc">Date Applied (Oldest First)</option>
                <option value="date-desc">Date Applied (Newest First)</option>
                <option value="a-z">Company Name (A-Z)</option>
                <option value="z-a">Company Name (Z-A)</option>
            </FilterSelect>

            {sortedAndRespondedJobs.map((job, index) => (
                <JobCard key={job.id}>
                    {(isMobile || (isLaptop && index === 0)) && (
                        <TitleDiv>
                            <JobTitleDiv>Date

                                <ButtonHolderDiv>
                                    <FontAwesomeIcon icon={faCaretUp}  size="lg" />
                                    <FontAwesomeIcon icon={faCaretDown} size="lg" />
                                </ButtonHolderDiv>

                            </JobTitleDiv>
                            <JobTitleDiv>Company
                                <ButtonHolderDiv>
                                    <FontAwesomeIcon icon={faCaretUp}  size="lg" />
                                    <FontAwesomeIcon icon={faCaretDown} size="lg" />
                                </ButtonHolderDiv>
                            </JobTitleDiv>
                            <JobTitleDiv>Description
                                <ButtonHolderDiv>
                                    <FontAwesomeIcon icon={faCaretUp}  size="lg" />
                                    <FontAwesomeIcon icon={faCaretDown} size="lg" />
                                </ButtonHolderDiv>
                            </JobTitleDiv>
                            <JobTitleDiv>Contact
                                <ButtonHolderDiv>
                                    <FontAwesomeIcon icon={faCaretUp}  size="lg" />
                                    <FontAwesomeIcon icon={faCaretDown} size="lg" />
                                </ButtonHolderDiv>
                            </JobTitleDiv>
                            <JobTitleDiv>Job Poster
                                <ButtonHolderDiv>
                                    <FontAwesomeIcon icon={faCaretUp}  size="lg" />
                                    <FontAwesomeIcon icon={faCaretDown} size="lg" />
                                </ButtonHolderDiv>
                            </JobTitleDiv>
                            <JobTitleDiv>Job Link
                               
                            </JobTitleDiv>
                            <JobTitleDiv> Website Link

                            </JobTitleDiv>
                            <JobTitleDiv> Responded

                            </JobTitleDiv>
                        </TitleDiv>
                    )}

                    <DataDiv>
                        <JobDataDiv>{new Date(job.dateapplied).toISOString().split('T')[0]}</JobDataDiv>
                        <JobDataDiv>{job.companyname} </JobDataDiv>
                        <JobDataDiv> {job.description}</JobDataDiv>
                        <JobDataDiv>{job.primarycontact} </JobDataDiv>
                        <JobDataDiv> {job.jobposter}</JobDataDiv>
                        <JobDataDiv>
                            <a href={job.joblink} target="_blank" rel="noopener noreferrer">LINK</a>
                        </JobDataDiv>
                        <JobDataDiv>
                            <a href={job.companywebsitelink} target="_blank" rel="noopener noreferrer">LINK</a>
                        </JobDataDiv>
                        <JobDataDiv>
                            <select
                                value={jobResponses[job.id] || 'no response'}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleResponseChange(e, String(job.id))}
                            >
                                <option value="accepted">Accepted</option>
                                <option value="declined">Declined</option>
                                <option value="no response">No Response</option>
                            </select>
                        </JobDataDiv>





                    </DataDiv>
                </JobCard>
            ))}
        </JobViewAllDiv>
    );
};

const ButtonHolderDiv = styled.div`
  @media ${deviceJobViewAll.mobile} {
    display: flex;
    flex-direction: column; 
    background-color: blue;
    
  }
  
    @media ${deviceJobViewAll.tablet} {
      display: flex;
      flex-direction: column;
      background-color: blue;
      margin-left: 10px;
    }
`;

const FilterSelect = styled.select`
    display: flex;

  @media ${deviceJobViewAll.mobile} {
    display: flex; 
    width: 60vw;
    margin-left: 20vw;
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