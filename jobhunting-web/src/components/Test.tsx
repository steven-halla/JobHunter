import React, {useContext, useEffect, useState} from "react";
import {JobsContext} from "../services/jobcontext";
import styled from 'styled-components';
import {device, deviceCompanyNoResponse, deviceHome, noResponseJobs} from "../common/ScreenSizes";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown, faCaretUp, faGlasses} from "@fortawesome/free-solid-svg-icons";
import { useSortAndSelect } from './useSortAndSelect'; // Make sure to import from the correct path
import { SelectValue } from './useSortAndSelect';
import {DateMutation} from "../common/DateMutation";
import {useTheme} from "@mui/material"; // Replace with the actual path

// shrink down vertically,
//more shade on south partk of box
//add more space between cards, look at linkedin toom there should be space from all sides

export const Test = () => {
    const { jobs, updateJobResponded, updateJobRejected, dateApplied } = useContext(JobsContext);
    const [searchTerm, setSearchTerm] = useState('');
    // const [sortingCriteria, setSortingCriteria] = useState('date-asc'); // default sorting criteria
    const [sortingCriteria, setSortingCriteria] = useState("");

    const [isMobile, setIsMobile] = useState(window.matchMedia(deviceCompanyNoResponse.mobile).matches);
    const [isLaptop, setIsLaptop] = useState(window.matchMedia(deviceCompanyNoResponse.laptop).matches);
    const [dateSortDirection, setDateSortDirection] = useState('dsc');
    const [contactSortDirection, setContactSortDirection] = useState('dsc'); // New state for contact sorting
    const [companySortDirection, setCompanySortDirection] = useState('dsc'); // New state for company sorting
    const [rejectedSortStatus, setRejectedSortStatus] = useState('no'); // New state for rejected sorting

    // const {
    //     sortOrder,
    //     setSortOrder, // Ensure you have this in your destructured object
    //     selectValue,
    //     handleDateSortAsc,
    //     handleDateSortDesc,
    //     handleContactNameSortAsc,
    //     handleContactNameSortDesc,
    //     handleCompanyNameSortAsc,
    //     handleCompanyNameSortDesc,
    //     handleSelectChange,
    // } = useSortAndSelect();



    // Toggle functions updated to reset other sort states
    const toggleDateSortDirection = () => {
        setDateSortDirection(dateSortDirection === 'asc' ? 'dsc' : 'asc');
        setSortingCriteria(dateSortDirection === 'asc' ? 'date-desc' : 'date-asc');
        // Reset other sort buttons to their original state
        setContactSortDirection('dsc');
        setCompanySortDirection('dsc');
        setRejectedSortStatus('yes');
    };

    const toggleContactSortDirection = () => {
        setContactSortDirection(contactSortDirection === 'asc' ? 'dsc' : 'asc');
        setSortingCriteria(contactSortDirection === 'asc' ? 'contact-z-a' : 'contact-a-z');
        // Reset other sort buttons to their original state
        setDateSortDirection('dsc');
        setCompanySortDirection('dsc');
        setRejectedSortStatus('yes');
    };

    const toggleCompanySortDirection = () => {
        setCompanySortDirection(companySortDirection === 'asc' ? 'dsc' : 'asc');
        setSortingCriteria(companySortDirection === 'asc' ? 'company-z-a' : 'company-a-z');
        // Reset other sort buttons to their original state
        setDateSortDirection('dsc');
        setContactSortDirection('dsc');
        setRejectedSortStatus('yes');
    };

    const toggleRejectedSortStatus = () => {
        setRejectedSortStatus(rejectedSortStatus === 'no' ? 'yes' : 'no');
        setSortingCriteria(rejectedSortStatus === 'no' ? 'rejected-yes' : 'rejected-no');
        // Reset other sort buttons to their original state
        setDateSortDirection('dsc');
        setContactSortDirection('dsc');
        setCompanySortDirection('dsc');
    };

    const handleSortingChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setSortingCriteria(e.target.value);
    };


    useEffect(() => {
        console.log("orky boys here to party" + jobs[0]?.dateapplied, typeof jobs[0]?.dateapplied);
    }, [jobs]);





    //this is for filter
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

    // const handleRejectedSortYes = () => {
    //     setSortOrder('rejected-yes');
    // };
    //
    // const handleRejectedSortNo = () => {
    //     setSortOrder('rejected-no');
    // };

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

    const handleRejectionChange = (jobId: number, checked: boolean) => {
        if (checked) {
            const isConfirmed = window.confirm("Confirm company rejected?");
            if (isConfirmed) {
                updateJobRejected(jobId, true);
            }
        } else {
            updateJobRejected(jobId, false);
        }
    };


    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.matchMedia(deviceCompanyNoResponse.mobile).matches);
            setIsLaptop(window.matchMedia(deviceCompanyNoResponse.laptop).matches);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    const theme = useTheme();


    const handleDateAscSort = () => {
        setSortingCriteria('date-asc');
        // The sortedAndRespondedJobs will automatically recalculate and sort jobs by date in ascending order
    };


    return (
        <CompanyNoResponseDiv>

            <StickySearchDiv>
                <SearchBar
                    type="text"
                    placeholder="Search"
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

                    <RedPillContainer onClick={toggleContactSortDirection}>
                        {contactSortDirection === 'asc' ? 'Contact Asc' : 'Contact Desc'}
                        <FontAwesomeIcon icon={contactSortDirection === 'asc' ? faCaretUp : faCaretDown} size="lg" />
                    </RedPillContainer>


                    <RedPillContainer onClick={toggleCompanySortDirection}>
                        {companySortDirection === 'asc' ? 'Company Asc' : 'Company Desc'}
                        <FontAwesomeIcon icon={companySortDirection === 'asc' ? faCaretUp : faCaretDown} size="lg" />
                    </RedPillContainer>



                    <RedPillContainer onClick={toggleRejectedSortStatus}>
                        {rejectedSortStatus === 'no' ? 'Rejected No' : 'Rejected Yes'}
                        <FontAwesomeIcon icon={rejectedSortStatus === 'no' ? faCaretDown : faCaretUp} size="lg" />
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
                <CardDiv key={job.id}>
                    <BusinessCardDiv>
                        <DateDiv>
                            {DateMutation(typeof job.dateapplied === 'string' ? job.dateapplied : job.dateapplied.toISOString())}

                        </DateDiv>
                        <NameDiv>
                            <HDiv>
                                <h2>
                                   {job.companyname}
                                </h2>
                                <div className="hide">{job.companyname}</div>
                            </HDiv>
                            <div>
                                <a href={job.joblink} target="_blank" rel="noreferrer">
                                    <FontAwesomeIcon icon={faGlasses} />
                                </a>
                            </div>
                        </NameDiv>


                        <ContactContainerDiv>
                            <ContactNameDiv>
                                <DataItemDiv>{job.primarycontact}</DataItemDiv>

                            </ContactNameDiv>
                            <CheckBoxDiv>
                                <DataItemDiv>
                                    respond?
                                    <CheckBoxInput
                                        type="checkbox"
                                        checked={job.companyresponded}
                                        onChange={(event: { target: { checked: boolean; }; }) => handleCheckboxChange(job.id, event.target.checked)}
                                    />
                                </DataItemDiv>

                                <DataItemDiv>
                                    rejected?
                                    <CheckBoxInput
                                        type="checkbox"
                                        checked={job.companyrejected}
                                        onChange={(event: { target: { checked: boolean; }; }) => handleRejectionChange(job.id, event.target.checked)}

                                    />
                                </DataItemDiv>

                            </CheckBoxDiv>

                        </ContactContainerDiv>


                    </BusinessCardDiv>




                </CardDiv>
            ))}


        </CompanyNoResponseDiv>

    );
};

const CheckBoxDiv = styled.div`
  height: 50%;
  width: 100%;
  padding: 10px;
  display: flex;
  align-items: center; /* Vertically center the content */

  /* Direct child divs (assuming these are the containers for each checkbox) */
  > div {
    flex: 1; /* This makes each child div take equal space */
    display: flex;
    justify-content: center; /* Center the content of each child div */
  }

  /* First child div (for the first checkbox) */
  > div:first-child {
    justify-content: flex-start; /* Aligns content to the left */
  }

  /* Last child div (for the second checkbox) */
  > div:last-child {
    justify-content: flex-end; /* Aligns content to the right */
  }
`;


const ContactNameDiv = styled.div`
height: 50%;
  width: 100%;
justify-content: center;
  align-items: center;

`;

const ContactContainerDiv = styled.div`
  position: absolute;
  bottom: 0;
  height: 40%;
  width: 100%;
  /* Ensure it's horizontally centered */
  left: 50%;
  transform: translateX(-50%);
`;

const HDiv = styled.div`
  
  max-width: 80%;
  overflow: hidden;
  margin-right: 3%;
  margin-left: 7%;
`;

const NameDiv = styled.div`
  display: flex;
  align-items: center;
  height: 30%;
  margin: 0 auto;
  justify-content: center;
  overflow: visible; /* Allow content to overflow */
  text-overflow: ellipsis;
  position: relative; /* Needed for absolute positioning of pseudo-element */

  h2 {
    display: flex;
    align-items: center;
    justify-content: flex-start; /* Display text from left to right */
    content: attr(data-content); /* Display the content of the data-content attribute */
    overflow: hidden; /* Hide any overflowing content */
    box-sizing: content-box; /* Ensure padding doesn't affect the width */
    position: relative; /* Needed for z-index */
    white-space: nowrap; /* Prevent text from wrapping */
    max-width: 20ch; /* Set the maximum width to 20 characters (adjust as needed) */
    

    &:hover ~ .hide {
      display: block; /* Show the .hide div when h2 is hovered */
      z-index: 10;
    }
  }

  svg:not(:root).svg-inline--fa,
  svg:not(:host).svg-inline--fa {
    color: white;
    font-size: 24px;
  }

  .hide {
    display: none; /* Initially hidden */
    position: absolute;
    top: -20px; /* Position 20 pixels above the company name */
    left: 0; /* Align with the left edge of the h2 */
    z-index: 10; /* Increase the z-index value to ensure it appears above other content */
    background-color: grey;
    margin-bottom: 20px; /* Add some margin to separate from h2 */
    padding: 10px; /* Add padding for the character limit indicator */
    pointer-events: none; /* Ignore pointer events on the .hide element */
  }

  .hide::before {
    content: attr(data-text); /* Use the data-text attribute for the content */
    display: block;
    white-space: nowrap; /* Prevent text from wrapping */
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;








export const DateDiv = styled.div`
    height: 20%;
  width: 30%;
`;
export const BusinessCardDiv = styled.div`
    background-color: chartreuse;
  position: relative;
    height: 25vh;
  width: 50vw;
  @media ${noResponseJobs.mobile} {
    width: 80%; /* Adjust width to 80% on mobile devices */
  }
`;
const RedPillParentDiv = styled.div`
  display: flex;
  margin-left: 150px;
  

  @media ${noResponseJobs.mobile} {
    display: none; // Hide on larger screens

    @media (max-width: 1150px) {
    }
  }
`;


const SearchBar = styled.input`
  width: 30%;
  padding: 10px;
  margin-bottom: 10px;
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

  @media ${noResponseJobs.mobile} {
   display: flex;
    align-items: flex-start;
    margin-left: 12%;
    width: 150px; /* Adjust width to 80% on mobile devices */
    margin-top: 10px;
  }

  @media ${noResponseJobs.laptop} {
   min-width: 200px; /* Adjust width to 80% on mobile devices */
    left: 5%;
    transform: translateX(-10%); // Adjust to move the element back by 10% of its own width

  }
`;



const CheckBoxInput = styled.input`
margin-left: 11%;
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



const CompanyNoResponseDiv = styled.div`
  display: flex;
  //height: 100vh;
  width: 100vw;
  height: 100%;
  
  flex-direction: column;
  //background-color: rgba(138,169,142,0.86); /* Sets background color to red */
  background-color: rgba(138,169,142,0.86); /* Sets background color to red */


`;




export const CardDiv = styled.div`
  display: flex;
  justify-content: center; /* Centers ColumnDiv horizontally */
  align-items: center; /* Centers ColumnDiv vertically */
  height: 50%; /* Sets the height of the card to 50% of its container */
  width: 100%; /* Full width */
  margin: 0 auto; /* Centers the card itself horizontally if its container is wider */
  //background-color: rgba(138,169,142,0.86); /* Sets background color to red */
  padding: 10px; /* Adds some spacing inside the card */
  box-sizing: border-box; /* Ensures padding is included in width/height calculations */
`;






 const DataItemDiv = styled.div`
    /* You can add specific styles for data items here */
   justify-content: center;
   align-items: center;
     display: flex;
     margin: 0 auto;

 `;

const StickySearchDiv = styled.div`
  position: sticky;
  top: 8.5%;
  z-index: 5;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding-right: 150px;
  height: 10vh;
  background-color: blue;
  min-height: 50px;


  @media ${noResponseJobs.mobile} {
    width: 100vw;
    background-color: grey;
    padding-right: 12%;

  }
  //
  // @media ${noResponseJobs.laptop} {
  //  
  //   @media (max-width: 1150px) {
  //     margin-left: 10%; // Apply 10% left margin for screens up to 1150px
  //   }
  // }



`;

const SelectDiv = styled.div`
    display: flex;


  // @media ${noResponseJobs.mobile} {
  //   display: block; // Show on mobile devices
  // }

  @media ${noResponseJobs.laptop} {
    display: none; // Hide on larger screens
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
  text-align: center; /* Center children horizontally */
  //line-height: 30px; /* Center children vertically */

  & > svg {
    margin-left: 10px; /* Add margin to the left of the FontAwesomeIcon */
  }

  &:hover {
    cursor: pointer;
  }

  @media ${noResponseJobs.mobile} {
    display: none; // Hide on mobile devices
  }

  @media (max-width: 1150px) {
    background-color: blue; // Background color for screens wider than 1150px
  }
`;
