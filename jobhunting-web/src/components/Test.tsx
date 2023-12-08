import React, {useContext, useEffect, useState} from 'react';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem } from '@mui/material';
import { JobsContext } from "../services/jobcontext";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCaretUp,
    faCaretDown,
    faTimes,
    faTimesCircle,
    faBan,
    faSkullCrossbones, faGlasses, faCalendarPlus, faUser, faGlobe
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import {deviceJobViewAll, noResponseJobs} from "../common/ScreenSizes";
import {nothingHere} from "../common/ScreenSizes";
import axios from "axios";
import { useSortAndSelect } from './useSortAndSelect'; // Make sure to import from the correct path
import { SelectValue } from './useSortAndSelect'; // Replace with the actual path
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import {Slider} from "@mui/material";
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import Switch from '@mui/material/Switch';
import {DateMutation} from "../common/DateMutation";


export const Test = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const { jobs, updateJobSoftDelete,updateJobResponded, updateJobRejected, meetingLink} = useContext(JobsContext);
    const [filter] = useState('');
    const [onlyShowResponded] = useState(false);

    const [sortingCriteria, setSortingCriteria] = useState(""); // default sorting criteria

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
        setSortOrder(selectValue);
        console.log("hi")
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
            navigate(`/updatejob/${jobId}`);  // navigate to the update job page with the jobId
        }

        else if (response === 'no response') {
            setJobResponses(jobResponses)
        }

        else if (response === 'delete') {
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

    const filteredAndRespondedJobs = jobs
        .filter(job => !job.companyrejected)
        .filter(job =>
            job.companyresponded ||
            new Date(job.dateapplied).getTime() >= twentyOneDaysAgoMs
        )
        .filter(job =>
            (onlyShowResponded ? job.companyresponded : true) &&
            job.companyname.toLowerCase().includes(filter.toLowerCase())
        )
        .filter(job => !job.jobsoftdelete);

    const sortedAndRespondedJobs = jobs
        .filter(job =>
            !job.companyresponded &&
            (searchTerm.length < 3 || job.companyname.toLowerCase().includes(searchTerm.toLowerCase().trim()) || job.primarycontact.toLowerCase().includes(searchTerm.toLowerCase().trim()))
        )
        .sort((a, b) => {
            switch (sortingCriteria) {
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
                    return (b.companyrejected ? 1 : 0) - (a.companyrejected ? 1 : 0);
                case 'rejected-no':
                    return (a.companyrejected ? 1 : 0) - (b.companyrejected ? 1 : 0);
                default:
                    return 0;
            }
        });


    const [isMobileNothing, setIsMobileNothing] = useState(window.matchMedia(nothingHere.mobile).matches);

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

    const toggleContactSortDirection = () => {
        setContactSortDirection(contactSortDirection === 'asc' ? 'dsc' : 'asc');
        setSortingCriteria(contactSortDirection === 'asc' ? 'contact-desc' : 'contact-asc');
        setDateSortDirection('dsc');
        setCompanySortDirection('dsc');
        setInterviewSortDirection('dsc');
    };

    const toggleInterviewSortDirection = () => {
        setInterviewSortDirection(interviewSortDirection === 'asc' ? 'dsc' : 'asc');
        setSortingCriteria(interviewSortDirection === 'asc' ? 'accepted' : 'no response');
        setDateSortDirection('dsc');
        setContactSortDirection('dsc');
        setCompanySortDirection('dsc');
    };

    const handleSortingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortingCriteria(e.target.value);
    };

    const handleSwitchChange = (jobId: number, checked: boolean): void => {
        if (checked) {
            const isConfirmed = window.confirm("Confirm company responded?");
            if (isConfirmed) {
                updateJobResponded(jobId, true);
            }
        } else {
            updateJobResponded(jobId, false);
        }
    };

    const [isChecked, setIsChecked] = useState(false); // Initialize state

    const handleChange = () => {
        setIsChecked(!isChecked); // Toggle the state
    };


    interface LabeledSwitchProps {
        labelOn: string;
        labelOff: string;
        isChecked: boolean;
        onChange: () => void; // Update this type according to the actual onChange function
    }


    const LabeledSwitch: React.FC<LabeledSwitchProps> = ({ labelOn, labelOff, isChecked, onChange }) => {
        const labelStyle = {
            fontSize: '20px', // Set the font size to 16px
            fontFamily: 'Roboto, sans-serif', // Set the font family to Roboto with a generic sans-serif fallback

        };

        return (
            <div>
                <label style={labelStyle}>
                    {isChecked ? labelOn : labelOff}
                    <Switch checked={isChecked} onChange={onChange} />
                </label>
            </div>
        );
    };




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

                    <RedPillContainer>
                        <button onClick={toggleDateSortDirection} style={{ all: 'unset' }}>
                            {dateSortDirection === 'asc' ? 'Date Asc' : 'Date Desc'}
                            <FontAwesomeIcon icon={dateSortDirection === 'asc' ? faCaretUp : faCaretDown} size="lg" />
                        </button>
                    </RedPillContainer>

                    <RedPillContainer>
                        <button onClick={toggleCompanySortDirection} style={{ all: 'unset' }}>
                            {companySortDirection === 'asc' ? 'Company Asc' : 'Company Desc'}
                            <FontAwesomeIcon icon={companySortDirection === 'asc' ? faCaretUp : faCaretDown} size="lg" />
                        </button>
                    </RedPillContainer>


                    <RedPillContainer>
                        <button onClick={toggleContactSortDirection} style={{ all: 'unset' }}>
                            {contactSortDirection === 'asc' ? 'Contact Asc' : 'Contact Desc'}
                            <FontAwesomeIcon icon={contactSortDirection === 'asc' ? faCaretUp : faCaretDown} size="lg" />
                        </button>
                    </RedPillContainer>

                    <RedPillContainer>
                        <button onClick={toggleInterviewSortDirection} style={{ all: 'unset' }}>
                            {interviewSortDirection === 'asc' ? 'Accepted' : 'No Response'}
                            <FontAwesomeIcon icon={interviewSortDirection === 'asc' ? faCaretUp : faCaretDown} size="lg" />
                        </button>
                    </RedPillContainer>

                </RedPillParentDiv>

                <SelectDiv>
                    <SimpleSelect value={sortingCriteria} onChange={handleSortingChange}>
                        <option value="">Default Filter</option> {/* Default option */}

                        <option value="date-asc">Date Ascending</option>
                        <option value="date-desc">Date Descending</option>
                        <option value="company-a-z">Company A-Z</option>
                        <option value="company-z-a">Company Z-A</option>
                        <option value="contact-a-z">Contact A-Z</option>
                        <option value="contact-z-a">Contact Z-A</option>
                        <option value="rejected-yes">Rejected Yes</option>
                        <option value="rejected-no">Rejected No</option>
                        {/* other options */}
                    </SimpleSelect>


                </SelectDiv>

            </StickySearchDiv>



            {sortedAndRespondedJobs.map((job) => (

                <RedBox>



                {/*<VerticalLine></VerticalLine>*/}
                <TopBox>
                    <YellowBox>
                        <FontAwesomeIcon icon={faCalendarPlus} />

                        <p>

                            {/*Jan 1st 1919*/}
                            {DateMutation(typeof job.dateapplied === 'string' ? job.dateapplied : job.dateapplied.toISOString())}
                        </p>



                    </YellowBox>

                    <BlueBox>
                        <h2 title={job.companyname}>
                            {/*Orky Inc*/}
                            {job.companyname}

                        </h2>
                    </BlueBox>

                    <SkyBlueBox>
                        <FontAwesomeIcon icon={faUser} />

                        <p>
                            Goregutz Noobstompa
                        </p>
                    </SkyBlueBox>
                    {/*<VioletBox>*/}



                    {/*</VioletBox>*/}



                    <GreenBox>
                        <p title="  I am a bunch of notes that doesn't have much of an impact o,,dfsafn things how are you doing with me today i love you
">
                            Notes: I am a bunch of notes that doesn't have much of an impact on things though I kinda wis I did
                        </p>
                    </GreenBox>

                </TopBox>

                <MiddleBox>



                </MiddleBox>




                <BottomBox>

                    <PurpleBox>
                        {/*<FontAwesomeIcon icon={faGlasses}*/}
                        {/*                 size="lg" // Example size - adjust as needed*/}
                        {/*/>*/}
                        <LabeledSwitch
                            labelOn="Responded"
                            labelOff="No Response"
                            isChecked={isChecked} // Pass the state
                            onChange={handleChange} // Pass the handler
                        />

                        <LabeledSwitch
                            labelOn="Rejectd"
                            labelOff="No Rejection"
                            isChecked={isChecked} // Pass the state
                            onChange={handleChange} // Pass the handler
                        />


                    </PurpleBox>

                    <IconBox>

                        <GoldBox>
                            <p>Schedule Interview</p>
                            <FontAwesomeIcon
                                icon={faCalendar}
                                style={{  color: "black" }} // Added marginRight here
                                size="lg" // Example size - adjust as needed
                            />
                        </GoldBox>

                        <GoldBox>
                            <p>Edit</p>
                            <FontAwesomeIcon
                                icon={faEdit}
                                style={{  color: "black" }} // Added marginRight here
                                size="lg" // Example size - adjust as needed
                            />
                        </GoldBox>

                        <GoldBox>
                            <p>Job Link</p>
                            <FontAwesomeIcon icon={faGlobe}
                                             style={{  color: "black" }} // Added marginRight here
                                             size="lg"  />
                        </GoldBox>




                    </IconBox>

                    {/*<TurquoiseBox>*/}



                    {/*    <GoldBox>*/}
                    {/*        <GreyBox>*/}
                    {/*            Responded?*/}
                    {/*            <CheckBoxInput*/}
                    {/*                type="checkbox"*/}
                    {/*            />*/}
                    {/*        </GreyBox>*/}

                    {/*        <PinkBox>*/}
                    {/*            Rejected?*/}
                    {/*            <CheckBoxInput*/}
                    {/*                type="checkbox"*/}
                    {/*            />*/}
                    {/*        </PinkBox>*/}
                    {/*    </GoldBox>*/}



                    {/*</TurquoiseBox>*/}






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
  //align-items: flex-end;
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


const VioletBox = styled.div`
  height: 90%;
  width: 100%;
  margin-top: 1%;
  display: flex;
  justify-content: center;
  align-items: center;

  p {
    color: black;
  }
`;


const GoldBox = styled.div`
  height: 33%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-end; /* Aligns children to the far right */
  align-items: center;
  //background-color: gold;
  //border: 1px solid red;
  font-family: Arial, sans-serif; // Set the font family to Arial with a generic sans-serif fallback

  font-size: 18px;
  p {
    padding-top: 7%;
    margin-right: 15px; /* Adds right margin to <p> tag for spacing */
  }

  svg {
    /* 'justify-content: flex-end;' is not needed here as it's for flex containers */
  }
`;



/* ... rest of your styles ... */

const TurquoiseBox = styled.div`
  height: 80%;
  width: 60%;
  margin-top: 1%;
  background-color: lightgray;

  p {
    color: black;
  }
`;

const PinkBox = styled.div`
  height: 100%;
  width: 50%;
  margin-left: 1%;
  margin-top: 1%;

  p {
    color: black;
  }
`;


const GreyBox = styled.div`
  height: 100%;
  width: 50%;
  background-color: grey;
  margin-left: 7%;
  margin-top: 1%;
  padding-left: 60px;

  p {
    color: black;
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
  //background-color: green;
  flex-direction: column;
  overflow: hidden; // or 'auto' if you want scrollbars
`;


const MiddleBox = styled.div`
  height: 100%;
  width: 10%;
  display: flex;
  align-items: center;
  justify-content: center;
  //background-color: deeppink;
  flex-direction: column;

`;

const BottomBox = styled.div`
  height: 100%;
  width: 41%;
  display: flex;
  //background-color: purple;
  flex-direction: column;
  
`;


const RedBox = styled.div`
  height: 30%;
  width: 50%;
  background-color: darkgray;
  margin-left: 25%;
  display: flex;
  flex-direction: row;
  margin-top: 3%;
  align-items: stretch;
  border-radius: 5px; /* Rounds the corners. Adjust the value as needed */


  box-shadow:
          -4px 0 8px -2px rgba(0, 0, 0, 0.2), /* Left shadow */
          4px 0 8px -2px rgba(0, 0, 0, 0.2),  /* Right shadow */
          0 4px 8px -2px rgba(0, 0, 0, 0.2);  /* Bottom shadow */
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
  height: 100%; // Adjust if needed to fit the parent container
  width: 100%;
  padding-left: 10px;
  padding-top: 10px;
  //background-color: red;
  display: flex;

  p {
    color: #2f2c2a ;
    font-family: Arial, sans-serif; /* Arial font, with a generic sans-serif as a fallback */
    font-size: 16px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2; // Limit to two lines
    overflow: hidden;
    word-wrap: break-word;
    max-height: calc(2 * 1.4em); // Adjust '1.2em' based on your font-size and line-height
  }
`;

//
// const GreenBox = styled.div`
//   height: 100%; // Adjust if needed to fit the parent container
//   width: 100%;
//   padding-left: 10px;
//   padding-top: 10px;
//   //background-color: red;
//   display: flex;
//
//   p {
//     color: #2f2c2a ;
//     font-family: Arial, sans-serif; /* Arial font, with a generic sans-serif as a fallback */
//     font-size: 16px;
//     display: -webkit-box;
//     -webkit-box-orient: vertical;
//     -webkit-line-clamp: 2; // Limit to two lines
//     overflow: hidden;
//     word-wrap: break-word;
//     max-height: calc(2 * 1.4em); // Adjust '1.2em' based on your font-size and line-height
//   }
// `;


const BlueBox = styled.div`
  height: 70%;
  min-height: 35px;
  margin-left: 3%;
  background-color: grey;
  overflow: hidden; // This line is added to prevent overflow
  //width: 100%;

  a {
    color: white;
  }

  h2 {
    font-family: "Helvetica Neue", helvetica, arial, sans-serif;
    color: blue;
    display: inline-block; // Makes the element's width as wide as its content
    white-space: nowrap;       // Prevents the text from wrapping to the next line
    overflow: hidden;          // Hides overflowed text
    text-overflow: ellipsis;
    max-width: 100%;
  }
`;

const PurpleBox = styled.div`
  height: 50%;
  width: 100%;
  
  display: flex;
  //background-color: #FF6EC7;
  flex-direction: column;
  align-items: flex-end;
  svg {
    color: white;
  }
`;


const RedPillParentDiv = styled.div`
  display: flex;
  margin-left: 10px;

  @media ${noResponseJobs.mobile} {
    display: none;

    @media (max-width: 1150px) {
    }
  }
`;


const TestWrapper = styled.div`
  height: 93vh;
  overflow-y: auto;

  p {
    font-family: "Helvetica Neue", helvetica, arial, sans-serif;
  }
`;


const TextButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
  padding: 0;
  margin: 0;
  text-decoration: underline;
  outline: none;

  &:hover, &:focus {
    color: #007BFF;
  }
`;


const CardBoxDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  justify-content: center;
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
        return 'linear-gradient(to left, #ff0000, #ff9999)';
    } else if (props.meetingLink) {
        return 'linear-gradient(to left, #34e89e, #78ffd6)';
    } else if (props.isOlderThanSevenDays) {
        return 'linear-gradient(to left, #FFDD3C, #FFEA61)';
    } else if (!props.companyResponded) {
        return 'linear-gradient(to left, #808080, #b3b3b3)';
    }
    return 'linear-gradient(to left, #808080, #b3b3b3)';
}};
  box-shadow:
    -4px 0 8px -2px rgba(0, 0, 0, 0.2),
    4px 0 8px -2px rgba(0, 0, 0, 0.2),
    0 4px 8px -2px rgba(0, 0, 0, 0.2);
  padding: 10px;
  border: 1px solid #ccc;
  min-width: 50%;
  margin-top: 1%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .hidden-icons {
    display: none;
    position: absolute;
    top: 50%;
    left: 0%;
    transform: translateY(-50%);
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

  .soft-delete-icon {
    font-size: 16px;
    margin-top: 50px;
  }

  @media ${noResponseJobs.mobile} {
    width: 80%;
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
    margin-left: 40px;
    min-width: 150px;
  }

  @media ${noResponseJobs.laptop} {
    min-width: 200px;
    left: 5%;
    transform: translateX(-10%);
    margin-right: 10%;
  }
`;


const RedPillContainer = styled.div`
  display: inline-block;
  min-width: 140px;
  height: 30px;
  background-color: red;
  border-radius: 15px;
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.5);
  margin-right: 1.5%;

  border: 2px solid black;
  text-align: center;

  & > svg {
    margin-left: 10px;
  }

  &:hover {
    cursor: pointer;
  }

  @media ${noResponseJobs.mobile} {
    display: none;
  }

  @media (max-width: 1150px) {
    //background-color: blue;
  }
`;


const StickySearchDiv = styled.div`
  position: sticky;
  top: 0%;
  z-index: 5;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-right: 180px;
  height: 10vh;
  background-color: blue;

  @media ${noResponseJobs.mobile} {
    width: 100vw;
    background-color: grey;
    padding-right: 12%;
    min-height: 50px;
  }
`;


const SelectDiv = styled.div`
  display: flex;

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

const CheckBoxInput = styled.input`
  margin-left: 11%;
`;