import React, { useContext } from "react";
import {JobsContext} from "../services/jobcontext";
import styled from 'styled-components';
import { Link } from 'react-router-dom';


const ONE_WEEK = 168 * 60 * 60 * 1000;

export const CompanyNoResponse = () => {
    const { jobs, updateJobResponded, dateApplied } = useContext(JobsContext);

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


    return(
        <CompanyNoResponseDiv>
            <HeaderDiv>
                <CompanyNameDiv>Company </CompanyNameDiv>
                <DateAppliedDiv>Date </DateAppliedDiv>
                <JobPosterDiv>Contact</JobPosterDiv>
                <JobLinkDiv>
                    Job
                    Link
                </JobLinkDiv>
                <CompnanyRespondedDiv>Responded</CompnanyRespondedDiv>
            </HeaderDiv>

                {olderJobs.map((job) => (
            <DataDiv key={job.id}>
                {/*<span>{new Date(job.dateApplied).toISOString().split('T')[0]}</span>*/}
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
            </DataDiv>
        ))}


        </CompanyNoResponseDiv>
    );
};

const CompanyNoResponseDiv = styled.div`
  display: flex;
  background-color: #aeff93;
  height: 100vh;
  width: 100vw;
  flex-direction: column;

`;


const HeaderDiv = styled.div`
  display: flex;
  background-color: orangered;
  height: 10vh;
  width: 90vw;
  margin-left: 5vw;

`;

const CompanyNameDiv = styled.div`
  display: flex;
  background-color: linen;
  height: 10vh;
  width: 20%;
  justify-content: center;
  align-items: center;

`;

const JobPosterDiv = styled.div`
  display: flex;
  background-color: olive;
  height: 10vh;
  width: 20%;
  justify-content: center;
  align-items: center;

`;

const DateAppliedDiv = styled.div`
  display: flex;
  background-color: lightskyblue;
  height: 10vh;
  width: 20%;
  justify-content: center;
  align-items: center;

`;

const JobLinkDiv = styled.div`
  display: flex;
  background-color: lightsalmon;
  height: 10vh;
  width: 20%;
  justify-content: center;
  align-items: center;
  white-space: pre-line;
 padding-left: 4vw;


`;

const CompnanyRespondedDiv = styled.div`
  display: flex;
  background-color: plum;
  height: 10vh;
  width: 20%;
  justify-content: center;
  align-items: center;

`;



const DataDiv = styled.div`
  display: flex;
  background-color: skyblue;

  justify-content: center;
  align-items: center;
  width: 90vw;
  height: 90vh;
  margin-left: 5vw;

`;



const JobInfoDiv = styled.div`
  display: flex;
  background-color: skyblue;

  justify-content: center;
  align-items: center;
  width: 20%;
  height: 20vh;
  border: 1px solid black; /* Add border styling here */
  word-break: break-all; /* Break words at any character if they can't fit */

`;


// return(
//     <CompanyNoResponseDiv>
//
//         <JobHeaderDiv>
//             <span>company name</span>
//             <span>Job Poster</span>
//             <span>Date Applied</span>
//             <span>Job Link</span>
//             <span>Company Responded</span>
//         </JobHeaderDiv>
//         {olderJobs.map((job) => (
//             <JobRowDiv key={job.id}>
//                 {/*<span>{new Date(job.dateApplied).toISOString().split('T')[0]}</span>*/}
//                 <span>{job.companyname}</span>
//                 <span>{job.jobposter}</span>
//                 <span>{new Date(job.dateapplied).toISOString().split('T')[0]}</span>
//                 <span>
//                         <a href={job.joblink} target="_blank" rel="noreferrer">Link</a>
//                     </span>
//
//                 <span>
//                         <input
//                             type="checkbox"
//                             checked={job.companyresponded}
//                             onChange={(event) => handleCheckboxChange(job.id, event.target.checked)}
//                         />
//                     </span>
//             </JobRowDiv>
//         ))}
//     </CompanyNoResponseDiv>
// );
// };
//
// const CompanyNoResponseDiv = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   background-color: yellow;
// `;
//
// const JobRowDiv = styled.div`
//   display: flex;
//   justify-content: space-between;
//   width: 90%;
//   padding: 10px 0;
//   background-color: #ffc4f4;
//
//   span {
//     width: 13%;  // Adjusted width for 6 columns
//   }
// `;
//
// const JobHeaderDiv = styled(JobRowDiv)`
//   background-color: #c8fff8;
//   font-weight: bold;
// `;
