import React, {useContext, useEffect, useState} from 'react';
import {Job} from '../models/Job';
import styled from 'styled-components';
import {JobsContext} from "../services/jobcontext";
import {Link, useNavigate} from 'react-router-dom';
import {SortingAToZ} from "./SortingAToZ";
import {FilterCompanyNamesInput} from "./FilterCompanyNamesInputProps";
import { deviceJobViewAll} from "../common/ScreenSizes";

// currently this is filtered by a-z when it SHOULD be filtered by date as a default
// I also need other options to filter, such as A-Z, Date,  and anything else I can think on

export const JobViewAll = () => {
    const {job, jobs, updateJobResponded, setJob} = useContext(JobsContext);
    const [filter, setFilter] = useState('');
    const [onlyShowResponded, setOnlyShowResponded] = useState(false);
    const [sortOrder, setSortOrder] = useState<'a-z' | 'z-a'>('a-z');
    const navigate = useNavigate();
    const currentDateMs = new Date().getTime();


    const filteredAndRespondedJobs = jobs
        .filter(job =>
            (onlyShowResponded ? job.companyresponded : true) &&
            job.companyname.toLowerCase().includes(filter.toLowerCase())
        );

    const sortedAndRespondedJobs = [...filteredAndRespondedJobs].sort((a, b) => {
        const isReversed = sortOrder === 'z-a' ? 1 : -1;
        if (a.companyname.toLowerCase() < b.companyname.toLowerCase()) {
            return -1 * isReversed;
        }
        if (a.companyname.toLowerCase() > b.companyname.toLowerCase()) {
            return 1 * isReversed;
        }
        return 0;
    });

    const handleSortOrderChange = () => {
        setSortOrder(prevOrder => prevOrder === 'a-z' ? 'z-a' : 'a-z');
    };

    const handleCheckboxChange = (id: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
        updateJobResponded(id, event.target.checked);
        alert("Congrats on getting them to respond!")
    };




    const [isMobile, setIsMobile] = useState(window.matchMedia(deviceJobViewAll.mobile).matches);
    const [isLaptop, setIsLaptop] = useState(window.matchMedia(deviceJobViewAll.tablet).matches);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.matchMedia(deviceJobViewAll.mobile).matches);
            setIsLaptop(window.matchMedia(deviceJobViewAll.tablet).matches);
        };

        // Run once to set the initial state
        checkScreenSize();

        // Add a listener for window resize events
        window.addEventListener('resize', checkScreenSize);

        // Cleanup: remove the listener when the component unmounts
        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    return (
        <JobViewAllDiv>
            {sortedAndRespondedJobs.map((job, index) => (
                <JobCard key={job.id}>
                    {(isMobile || (isLaptop && index === 0)) && (
                        <TitleDiv>
                            <JobTitleDiv>Date </JobTitleDiv>
                            <JobTitleDiv>Company </JobTitleDiv>
                            <JobTitleDiv>Description </JobTitleDiv>
                            <JobTitleDiv>Contact </JobTitleDiv>
                            <JobTitleDiv>Job Poster </JobTitleDiv>
                            <JobTitleDiv>Job Link </JobTitleDiv>
                            <JobTitleDiv> Website Link</JobTitleDiv>
                            <JobTitleDiv> Responded </JobTitleDiv>
                        </TitleDiv>
                    )}

                    <DataDiv>
                        {/* Render data for each job */}
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
                        <JobDataDiv> Not yet </JobDataDiv>
                    </DataDiv>
                </JobCard>
            ))}
        </JobViewAllDiv>
    );


};






const JobViewAllDiv = styled.div`
  // Add your styling here
  // background-color: red;

  @media ${deviceJobViewAll.mobile} {
    background-color:  #ff38ec;
    display: flex; /* Use flexbox layout */
    flex-direction: column; /* Display items in one row on mobile */
  }

  @media ${deviceJobViewAll.tablet} {
    display: flex; /* Use flexbox layout */
    flex-direction: column; /* Display items in one column on laptop view */
    //width: 90vw;
    background-color: #ff38ec;
    justify-content: center;
    align-items: center;
  }
  
`;
const TitleDiv = styled.div`
  // Add your styling here
  // background-color: red;

  @media ${deviceJobViewAll.mobile} {
    flex-direction: column; /* Display items in one column */
    flex: 1; /* Expand to take up remaining space in the row */
    background-color: orangered;
  }
    @media ${deviceJobViewAll.tablet} {
      display: flex;
      flex-direction: row;
      width: 90vw;
      //align-items: center;
      //justify-content: space-evenly;
      background-color: orangered;
      border: 2px solid darkred; /* Add a blue-violet border */

    }

    //justify-content: space-between; /* Add space between items */
    //margin-right: 5vw; /* Added this line */

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
    //align-items: center;//
    //justify-content: space-evenly;
    background-color: red;
    width: 90vw;
    border: 2px solid dimgray; /* Add a blue-violet border */

  }
`;



const JobTitleDiv = styled.div`
  display: flex;
  //flex-direction: row;
  //align-items: center;

  @media ${deviceJobViewAll.mobile} {
    flex-direction: column;
    align-items: center;
    background-color: yellow;
  }

    @media ${deviceJobViewAll.tablet} {
      border: 2px solid blueviolet; /* Add a blue-violet border */
      
      //flex-direction: column;
      justify-content: center;      
      //align-items: center;
      background-color: yellow;
      width: 90vw;
      
      //justify-content: center;
      //justify-content: space-evenly;
  }

`;

const JobDataDiv = styled.div`
  @media ${deviceJobViewAll.mobile} {
    background-color: green;
  }

    @media ${deviceJobViewAll.tablet} {
      display: flex;
      //flex-direction: row;
      //align-items: center;
      background-color: green;
      width: 90vw;
      //align-items: center;
      justify-content: center;
      //justify-content: center;

      border: 2px solid blueviolet; /* Add a blue-violet border */

    }
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
    //display: flex;
    flex-direction: row; /* Display items in one column on mobile */
  }

  @media ${deviceJobViewAll.tablet} {
    display: flex;
    
    flex-direction: column; /* Display items in one column on mobile */
  }
`;