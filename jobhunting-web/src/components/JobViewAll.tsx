import React, {useContext, useEffect, useState} from 'react';
import {FormControlLabel} from '@mui/material';
import { JobsContext } from "../services/jobcontext";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCaretUp,
    faCaretDown,
    faCalendarPlus,
    faUser,
    faGlobe
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import {deviceJobViewAll, noResponseJobs} from "../common/ScreenSizes";
import {faEdit} from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import Switch from '@mui/material/Switch';
import {DateMutation} from "../common/DateMutation";
import {colors, fonts} from "../common/CommonStyles";

export const JobViewAll = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [showAllJobs, setShowAllJobs] = useState(false);
    const { jobs, updateJobSoftDelete,updateJobResponded, updateJobRejected} = useContext(JobsContext);
    const [filter] = useState('');
    const [onlyShowResponded] = useState(false);
    const [sortingCriteria, setSortingCriteria] = useState("");
    const [jobDeclined, setJobDeclined] = useState(false);
    const [jobResponses, setJobResponses] = useState<Record<string, JobResponse>>(
        () => JSON.parse(localStorage.getItem("jobResponses") || '{}')
    );
    const [dateSortDirection, setDateSortDirection] = useState('asc');
    const [contactSortDirection, setContactSortDirection] = useState('asc');
    const [companySortDirection, setCompanySortDirection] = useState('dsc');
    const [interviewSortDirection, setInterviewSortDirection] = useState('dsc');

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
        'company-asc' |
        'company-desc'
    >('select');

    const [selectValue, setSelectValue] = useState<
        'select' |
        'accepted' |
        'no response' |
        'declined' |
        'delete' |
        'update' |
        'olderThanSevenDays'
    >('select');

    const navigate = useNavigate();


    useEffect(() => {
        setSortOrder(selectValue);
    }, [selectValue]);

    useEffect(() => {
        localStorage.setItem("jobResponses", JSON.stringify(jobResponses));
    }, [jobResponses]);

    type JobResponse = 'accepted' | 'declined' | 'no response' | 'delete' | 'update' | 'olderThanSevenDays' ;

    const onButtonClick = async (response: JobResponse, jobId: string) => {
        const targetJob = jobs.find(job => job.id === Number(jobId));

        if (!targetJob) return;

        if (response === 'accepted') {
            targetJob.companyrejected = false;
            targetJob.companyresponded = true;
            setJobDeclined(false);
            navigate(`/interviewsecured/${jobId}`);
            console.log("Preparing for interview");
        }
        else if (response === 'update') {
            navigate(`/updatejob/${jobId}`);
        }

        else if (response === 'no response') {
            setJobResponses(jobResponses)
        }

        else if (response === 'delete') {
            updateJobSoftDelete(Number(jobId), true);
        }

        else if (response === 'declined') {
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

    const currentDateMs = new Date().getTime();
    const TWENTY_ONE_DAYS = 21 * 24 * 60 * 60 * 1000;
    const twentyOneDaysAgoMs = currentDateMs - TWENTY_ONE_DAYS;
    const filteredJobs = showAllJobs ? jobs : jobs
        .filter(job => {
            console.log("After company rejected filter:", job);
            return !job.companyrejected;
        })
        .filter(job => {
            return job.companyresponded || new Date(job.dateapplied).getTime() >= twentyOneDaysAgoMs;
        })
        .filter(job => {
            const result = (onlyShowResponded ? job.companyresponded : true) && job.companyname.toLowerCase().includes(filter.toLowerCase());
            return result;
        })
        .filter(job => {
            return !job.jobsoftdelete;
        });

    const sortedAndRespondedJobs = [...filteredJobs]
        .filter(job =>
            job.companyresponded || // If company has responded, include the job
            (!job.companyresponded &&
                (searchTerm.length < 3 || job.companyname.toLowerCase().includes(searchTerm.toLowerCase().trim()) || job.primarycontact.toLowerCase().includes(searchTerm.toLowerCase().trim()))
            )
        )
        .sort((a, b) => {
            switch (sortingCriteria) {
                case 'select':
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
                    const responseA = jobResponses[a.id] || 'no response';
                    const responseB = jobResponses[b.id] || 'no response';
                    return (responseB === 'no response' ? 1 : 0) - (responseA === 'no response' ? 1 : 0);
                case 'delete':
                    return (jobResponses[b.id] === 'delete' ? 1 : 0) - (jobResponses[a.id] === 'delete' ? 1 : 0);
                case 'olderThanSevenDays':
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
    const [isLaptop, setIsLaptop] = useState(window.matchMedia(deviceJobViewAll.laptop).matches);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.matchMedia(deviceJobViewAll.mobile).matches);
            setIsLaptop(window.matchMedia(deviceJobViewAll.laptop).matches);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    const toggleDateSortDirection = () => {
        setDateSortDirection(dateSortDirection === 'asc' ? 'dsc' : 'asc');
        setSortingCriteria(dateSortDirection === 'asc' ? 'date-desc' : 'date-asc');
        setContactSortDirection('dsc');
        setCompanySortDirection('dsc');
        setInterviewSortDirection('dsc');
    };

    const toggleCompanySortDirection = () => {
        setCompanySortDirection(companySortDirection === 'asc' ? 'dsc' : 'asc');
        setSortingCriteria(companySortDirection === 'asc' ? 'company-desc' : 'company-asc');
        setDateSortDirection('dsc');
        setContactSortDirection('dsc');
        setInterviewSortDirection('dsc');
    };

    const handleSortingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortingCriteria(e.target.value);
    };

    type RespondedStatusType = {
        [jobId: number]: boolean;
    };

    const handleRespondedChange = async (jobId: number, checked: boolean) => {
        let isConfirmed = false;
        if (checked) {
            isConfirmed = window.confirm("Confirm company responded?");
        } else {
            isConfirmed = window.confirm("Are you sure you want to mark as not responded?");
        }
        if (isConfirmed) {
            await updateJobResponded(jobId, checked);
        }
    };

    const handleRejectedChange = async (jobId: number, checked: boolean) => {
        let isConfirmed = false;
        if (checked) {
            isConfirmed = window.confirm("Confirm Rejection responded?");
        } else {
            isConfirmed = window.confirm("Are you sure you want to mark as not rejected?");
        }
        if (isConfirmed) {
            await updateJobRejected(jobId, checked);
        }
    };

    interface LabeledSwitchProps {
        labelOn: string;
        labelOff: string;
        isChecked: boolean;
        onChange: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
    }

    const LabeledSwitch: React.FC<LabeledSwitchProps> = ({
                                                             labelOn,
                                                             labelOff,
                                                             isChecked,
                                                             onChange,
                                                         }) => {
        return (
            <div className="labeled-switch">
                <label>
                    {isChecked ? labelOn : labelOff}
                    <Switch
                        checked={isChecked}
                        onChange={(e) => onChange(e, e.target.checked)}
                    />                </label>
            </div>
        );
    };

    const handleSwitchChange = () => {
        setShowAllJobs((prev) => !prev);
    };

    const isMobile2 = window.matchMedia(deviceJobViewAll.mobile).matches;
    const labelPlacement = isMobile2 ? 'top' : 'start'; //

    return (
        <TestWrapper>
            <StickySearchDiv>
                <SearchBar
                    type="text"
                    placeholder="Search by company name or contact..."
                    value={searchTerm}
                    onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setSearchTerm(e.target.value)}
                />
                <RedPillParentDiv>

                    <SwitchContainer>
                        <FormControlLabel
                            control={<Switch checked={showAllJobs} onChange={handleSwitchChange} />}
                            label={showAllJobs ? 'Important Jobs' : 'All Jobs'}
                            labelPlacement={labelPlacement}
                        />
                    </SwitchContainer>

                    <RedPillContainer>
                        <button onClick={toggleDateSortDirection} style={{ all: 'unset' }}>
                            {dateSortDirection === 'asc' ? 'Date Asc' : 'Date Desc'}
                            <FontAwesomeIcon icon={dateSortDirection === 'asc' ? faCaretUp : faCaretDown} size="lg" />
                        </button>
                    </RedPillContainer>

                    <RedPillContainer>
                        <button onClick={toggleCompanySortDirection} style={{ all: 'unset' }}>
                            {companySortDirection === 'dsc' ? 'Company Asc' : 'Company Desc'}
                            <FontAwesomeIcon icon={companySortDirection === 'dsc' ? faCaretUp : faCaretDown} size="lg" />
                        </button>
                    </RedPillContainer>
                </RedPillParentDiv>

                <SelectDiv>
                    <SimpleSelect value={sortingCriteria} onChange={handleSortingChange}>
                        <option value="date-asc">Date Ascending</option>
                        <option value="date-desc">Date Descending</option>
                        <option value="company-a-z">Company A-Z</option>
                        <option value="company-z-a">Company Z-A</option>
                    </SimpleSelect>
                </SelectDiv>
            </StickySearchDiv>
            {sortedAndRespondedJobs.map((job) => (
                <RedBox>
                    <TopBox>
                        <BlueBox>
                            <a href={job.companywebsitelink} target="_blank" rel="noopener noreferrer">
                                <h2 title={job.companyname}>
                                    {job.companyname}
                                </h2>
                            </a>
                        </BlueBox>
                        <SkyBlueBox>
                            <FontAwesomeIcon icon={faUser} />
                            <p>
                                {job.primarycontact}
                            </p>
                        </SkyBlueBox>

                        <YellowBox>
                            <FontAwesomeIcon icon={faCalendarPlus} />
                            <p>
                                {DateMutation(typeof job.dateapplied === 'string' ? job.dateapplied : job.dateapplied.toISOString())}
                            </p>
                        </YellowBox>

                        <GreenBox>
                            <p title={job.description}>
                                {job.description}
                            </p>
                        </GreenBox>

                    </TopBox>

                    <MiddleBox>
                    </MiddleBox>

                    <BottomBox>

                        <PurpleBox>
                            <LabeledSwitch
                                labelOn="Responded"
                                labelOff="Pending"
                                isChecked={job.companyresponded}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
                                    handleRespondedChange(job.id, checked);
                                }}
                            />
                            <LabeledSwitch
                                labelOn="Rejected"
                                labelOff="Pending"
                                isChecked={job.companyrejected} // Pass the state
                                onChange={(event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
                                    handleRejectedChange(job.id, checked);
                                }}
                            />
                        </PurpleBox>
                        <IconBox>
                            <GoldBox>
                                <p>Appoint</p>
                                <FontAwesomeIcon
                                    icon={faCalendar}
                                    size="lg"
                                    onClick={() => onButtonClick('accepted', String(job.id))}
                                    style={{
                                        color: 'black',
                                        cursor: 'pointer',
                                        transform: 'scale(1)',
                                        transition: 'transform 0.2s',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                />
                            </GoldBox>

                            <GoldBox>
                                <p>Job Link</p>
                                <a href={job.joblink} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                    <FontAwesomeIcon icon={faGlobe} size="lg"   style={{
                                        color: 'black',
                                        cursor: 'pointer',
                                        transform: 'scale(1)',
                                        transition: 'transform 0.2s',
                                    }}
                                                     onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                                                     onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                    />
                                </a>

                            </GoldBox>

                            <GoldBox>
                                <p>Edit</p>
                                <FontAwesomeIcon
                                    icon={faEdit}
                                    size="lg" // Example size - adjust as needed
                                    onClick={() => onButtonClick('update', String(job.id))}
                                    style={{
                                        color: 'black',
                                        cursor: 'pointer',
                                        transform: 'scale(1)',
                                        transition: 'transform 0.2s',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.15)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                />
                            </GoldBox>
                        </IconBox>
                    </BottomBox>
                </RedBox>
            ))}
        </TestWrapper>
    );
};

const IconBox = styled.div`
  height: 50%;
  width: 100%;
  display: flex;
  padding-right: 5%;
  flex-direction: column;
  margin-left: 0.5%;
  
  p {
    color: black;
  }
  
  svg {
    align-items: flex-end;
  }
`;

const GoldBox = styled.div`
  height: 33%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end; /* Aligns children to the far right */
  align-items: center;
  font-family: Arial, sans-serif; // Set the font family to Arial with a generic sans-serif fallback
  font-size: 18px;
  p {
    padding-top: 7%;
    margin-right: 15px; /* Adds right margin to <p> tag for spacing */
  }

  svg {
    cursor: pointer;
  }
`;

const SkyBlueBox = styled.div`
  height: 30%;
  width: 80%;
  margin-top: 3%;
  display: flex;
  margin-left: 3%;
  
  p {
    color: black;
    font-style: italic;
    margin-left: 2%;
    
  }
  svg {
    padding-top: 1%;
  }
`;

const TopBox = styled.div`
  height: 100%;
  width: 49%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  overflow: hidden; 
`;

const MiddleBox = styled.div`
  height: 100%;
  width: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const BottomBox = styled.div`
  height: 100%;
  width: 41%;
  display: flex;
  flex-direction: column;
`;

const RedBox = styled.div`
  height: 30vh;
  width: 50%;
  min-width: 370px;
  min-height: 208px;
  background-color: darkgray;
  display: flex;
  flex-direction: row;
  margin-top: 2%;
  align-items: stretch;
  border-radius: 5px;
  box-shadow:
          -4px 0 8px -2px rgba(0, 0, 0, 0.2), 
          4px 0 8px -2px rgba(0, 0, 0, 0.2), 
          0 4px 8px -2px rgba(0, 0, 0, 0.2); 
`;

const YellowBox = styled.div`
display: flex;
  flex-direction: row;
  margin-left: 3%;
  margin-top: 3%;
  
  p {
    color: black;
    margin-left: 2%;
  }
  
  svg {
    padding-top: 1%;
  }
`;


const GreenBox = styled.div`
  height: 100%;
  width: 100%;
  padding-left: 10px;
  padding-top: 10px;
  display: flex;

  p {
    color: #2f2c2a ;
    font-family: Arial, sans-serif;
    font-size: 16px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    word-wrap: break-word;
    max-height: calc(2 * 1.4em); // Adjust '1.2em' based on your font-size and line-height
  }
`;

const BlueBox = styled.div`
  height: 70%;
  min-height: 35px;
  margin-left: 3%;
  overflow: hidden; 
  
  a {
    color: ${colors.TextBlackColor};
  }

  h2 {
   display: inline-block;
    white-space: nowrap;     
    overflow: hidden;          
    text-overflow: ellipsis;
    max-width: 100%;
    font-family: ${fonts.InputPlaceHolderFontFamily};
  }
`;

const PurpleBox = styled.div`
  height: 50%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  svg {
    color: white;
  }
`;


const RedPillParentDiv = styled.div`
  display: flex;
  margin-left: 10px;
`;


const TestWrapper = styled.div`
  height: 100%;
  overflow-y: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  p {
    font-family: "Helvetica Neue", helvetica, arial, sans-serif;
  }
`;


const SearchBar = styled.input`
  width: 25%;
  min-width: 200px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  display: block;
  margin-left: auto;
  background-color: white;
  position: sticky;
  top: 0;
  z-index: 1;
  overflow: hidden;
  @media (max-width: 1150px) {
    margin-left: 170px;
  }

  @media ${noResponseJobs.mobile} {
    display: flex;
    align-items: flex-start;
    margin-right: auto;
    margin-left: 30px;
    min-width: 120px;
  }

  @media ${noResponseJobs.laptop} {
    min-width: 200px;
    left: 5%;
    transform: translateX(-10%);
    margin-right: 10%;
  }
`;

const SwitchContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column-reverse;
  min-width: 200px;
  height: 30px;
  background-color: #b4a86b;
  border-radius: 15px;
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.5);
  margin-right: 1.5%;

  border: 2px solid black;
  text-align: center;

   svg {
    margin-left: 10px;
    padding-right: 5px;
  }

  &:hover {
    cursor: pointer;
  }

  @media ${noResponseJobs.mobile} {
    min-width: 100px;
    height: 90px;
    display: flex;
    flex-direction: column;
    padding-top: 10px;
  }
`;

const RedPillContainer = styled.div`
  display: inline-block;
  min-width: 150px;
  height: 30px;
  background-color: #b4a86b;
  border-radius: 15px;
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.5);
  margin-right: 1.5%;
  border: 2px solid black;
  text-align: center;

  svg {
    margin-left: 10px;
    padding-right: 5px;
  }

  &:hover {
    cursor: pointer;
  }

  @media ${noResponseJobs.mobile} {
    display: none;
  }
`;

const StickySearchDiv = styled.div`
  position: sticky;
  top: 0;
  z-index: 5;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-right: 180px;
  height: 12vh;
  background-color: #2a4153;
  width: 100%;
  margin-bottom: 1%;

  @media ${noResponseJobs.mobile} {
    width: 100vw;
    background-color: grey;
    padding-right: 12%;
    min-height: 50px;
  }
`;

const SelectDiv = styled.div`
  display: flex;
  margin-left: 10px;

  @media ${noResponseJobs.laptop} {
    display: none;
  }
`;

const SimpleSelect = styled.select`
  padding: 5px 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  appearance: none;
  outline: none;
  width: 25vw;
  margin-right: -4px;
`;
