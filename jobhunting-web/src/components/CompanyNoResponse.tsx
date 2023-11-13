import React, {useContext, useEffect, useState} from "react";
import {JobsContext} from "../services/jobcontext";
import styled from 'styled-components';
import {device, deviceCompanyNoResponse} from "../common/ScreenSizes";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretDown, faCaretUp} from "@fortawesome/free-solid-svg-icons";
import { useSortAndSelect } from './useSortAndSelect'; // Make sure to import from the correct path
import { SelectValue } from './useSortAndSelect';
import {DateMutation} from "../common/DateMutation"; // Replace with the actual path

// shrink down vertically,
//more shade on south partk of box
//add more space between cards, look at linkedin toom there should be space from all sides

export const CompanyNoResponse = () => {
    const { jobs, updateJobResponded, dateApplied } = useContext(JobsContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortingCriteria, setSortingCriteria] = useState('date-asc'); // default sorting criteria

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

                <StickySearchDiv>
                    <SearchBar
                        type="text"
                        placeholder="Search by company name or contact..."
                        value={searchTerm}
                        onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setSearchTerm(e.target.value)}
                    />
                </StickySearchDiv>



            <SelectDiv>
                <SimpleSelect value={sortingCriteria} onChange={handleSortingChange}>
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

            {sortedAndRespondedJobs.map((job) => (
                <CardDiv key={job.id}>
                    <ColumnDiv>
                        <DataItemDiv>{job.companyname}</DataItemDiv>


                        {DateMutation(typeof job.dateapplied === 'string' ? job.dateapplied : job.dateapplied.toISOString())}


                        <DataItemDiv>
                            <a href={job.joblink} target="_blank" rel="noreferrer">Link</a>
                        </DataItemDiv>
                        <DataItemDiv>{job.primarycontact}</DataItemDiv>
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
                            />
                        </DataItemDiv>
                    </ColumnDiv>
                </CardDiv>
            ))}


        </CompanyNoResponseDiv>

    );
};
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
`;



const CheckBoxInput = styled.input`
margin-left: 11%;
`;







const SearchDiv = styled.div`
    display: flex;
    align-items: center;
  justify-content: center;
  width: 100%;
  
`;

 const SimpleSelect = styled.select`
    padding: 5px 10px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
    appearance: none;
    outline: none;
  width: 15vw;
   
`;



const CompanyNoResponseDiv = styled.div`
  display: flex;
  //height: 100vh;
  width: 100vw;
  flex-direction: column;
  //background-color: rgba(138,169,142,0.86); /* Sets background color to red */
  background-color: rgba(138,169,142,0.86); /* Sets background color to red */


`;



// export const CardDiv = styled.div`
//     display: flex;
//     flex-direction: row;
//     border: 1px solid #ccc;
//     margin: 10px 0;
// `;

export const CardDiv = styled.div`
  display: flex;
  justify-content: center; /* Centers ColumnDiv horizontally */
  align-items: center; /* Centers ColumnDiv vertically */
  height: 50%; /* Sets the height of the card to 50% of its container */
  width: 100%; /* Full width */
  margin: 0 auto; /* Centers the card itself horizontally if its container is wider */
  background-color: rgba(138,169,142,0.86); /* Sets background color to red */
  padding: 10px; /* Adds some spacing inside the card */
  box-sizing: border-box; /* Ensures padding is included in width/height calculations */
`;


export const ColumnDiv = styled.div`
  display: flex;
  flex-direction: column; /* Stack children vertically */
  justify-content: center; /* Center children vertically */
  padding: 10px;
  white-space: nowrap;
  word-break: break-all;
  width: 40%;
  overflow: hidden;
background-color: rgba(165,169,127,0.86);
  align-items: center;

  box-shadow:
          -4px 0 8px -2px rgba(0, 0, 0, 0.2), /* Left shadow */
          4px 0 8px -2px rgba(0, 0, 0, 0.2),  /* Right shadow */
          0 4px 8px -2px rgba(0, 0, 0, 0.2);  /* Bottom shadow */
`;



export const DataItemDiv = styled.div`
    /* You can add specific styles for data items here */
`;

const StickySearchDiv = styled.div`
  position: sticky;
  top: 7%;
  z-index: 5;
  background-color: white;
`;

const SelectDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
  justify-content: center;
  top: 14.3%;
  z-index: 5;
  position: sticky;
  background-color: white;
`;
