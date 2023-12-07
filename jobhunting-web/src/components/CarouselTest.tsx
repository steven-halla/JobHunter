import React, {useContext, useEffect, useState} from 'react';
// import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, MenuItem } from '@mui/material';
// import { JobsContext } from "../services/jobcontext";
// import { useNavigate } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//     faCaretUp,
//     faCaretDown,
//     faTimes,
//     faTimesCircle,
//     faBan,
//     faSkullCrossbones, faGlasses
// } from "@fortawesome/free-solid-svg-icons";
// import styled from "styled-components";
// import {deviceJobViewAll, noResponseJobs} from "../common/ScreenSizes";
// import {nothingHere} from "../common/ScreenSizes";
// import axios from "axios";
// import { useSortAndSelect } from './useSortAndSelect'; // Make sure to import from the correct path
// import { SelectValue } from './useSortAndSelect'; // Replace with the actual path
// import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
// import {Slider} from "@mui/material";
// import { faCalendar } from '@fortawesome/free-solid-svg-icons';
//
//
//
// export const Test = () => {
//     const [searchTerm, setSearchTerm] = useState('');
//
//     const { jobs, updateJobSoftDelete, updateJobRejected, meetingLink} = useContext(JobsContext);
//     const [filter] = useState('');
//     const [onlyShowResponded] = useState(false);
//
//     const [sortingCriteria, setSortingCriteria] = useState(""); // default sorting criteria
//
//
//     const [sortOrder, setSortOrder] = useState<
//         'select' |
//         'companyResponded' |
//         'company-a-z' |
//         'company-z-a' |
//         'contact-a-z' |
//         'contact-asc' |
//         'contact-desc' |
//         'contact-z-a' |
//         'date-asc' |
//         'date-desc' |
//         'accepted' |
//         'meetingLink' |
//         'declined' |
//         'no response' |
//         'delete' |
//         'update' |
//         'olderThanSevenDays' |
//         'company-asc' | // Add this
//         'company-desc'  // And this
//     >('select');
//
//     const [selectValue, setSelectValue] = useState<
//         'select' |
//         'accepted' |
//         'no response' |
//         'declined' |
//         'delete' |
//         'update' |
//         'olderThanSevenDays' // include this in your type definition
//
//     >('select');
//
//
//     // const [jobResponses, setJobResponses] = useState<Record<string, JobResponse>>({});
//     const history = useNavigate();
//     const navigate = useNavigate();
//
//
//     const [isDescriptionModalOpen, setDescriptionModalOpen] = useState(false);
//     const [selectedDescription, setSelectedDescription] = useState('');
//
//
//     const [open, setOpen] = useState(false);
//     const [jobDeclined, setJobDeclined] = useState(false);
//
//     const [jobResponses, setJobResponses] = useState<Record<string, JobResponse>>(
//         () => JSON.parse(localStorage.getItem("jobResponses") || '{}')
//     );
//
//     const [dateSortDirection, setDateSortDirection] = useState('dsc');
//     const [contactSortDirection, setContactSortDirection] = useState('dsc'); // New state for contact sorting
//     const [companySortDirection, setCompanySortDirection] = useState('dsc'); // New state for company sorting
//     const [interviewSortDirection, setInterviewSortDirection] = useState('dsc'); // New state for company sorting
//     const [rejectedSortStatus, setRejectedSortStatus] = useState('no'); // New state for rejected sorting
//
//
//
//     useEffect(() => {
//         // You can add additional logic here if needed
//         setSortOrder(selectValue);
//         console.log("hi")
//         //this is only ran when selectValue changes, this is powerful and important to remember
//     }, [selectValue]);
//
//     useEffect(() => {
//         localStorage.setItem("jobResponses", JSON.stringify(jobResponses));
//     }, [jobResponses]);
//
//
//     type JobResponse = 'accepted' | 'declined' | 'no response' | 'delete' | 'update' | 'olderThanSevenDays' ;
//
//     const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
//
//     const openDescriptionModal = (description: string) => {
//         console.log("openDescriptionModal called with:", description);
//         setSelectedDescription(description);
//         setDescriptionModalOpen(true);
//     };
//
//     const closeDescriptionModal = () => {
//         setDescriptionModalOpen(false);
//     };
//
//     const onButtonClick = async (response: JobResponse, jobId: string) => {
//         const targetJob = jobs.find(job => job.id === Number(jobId));
//
//         if (!targetJob) return; // Exit if job is not found
//
//         if (response === 'accepted') {
//             targetJob.companyrejected = false;
//             targetJob.companyresponded = true;
//             setJobDeclined(false);
//             navigate(`/interviewsecured/${jobId}`);
//             console.log("Preparing for interview");
//         }
//         else if (response === 'update') {
//             navigate(`/updatejob/${jobId}`);  // <-- navigate to the update job page with the jobId
//
//         }
//
//         else if (response === 'no response') {
//             setJobResponses(jobResponses)
//
//         }
//
//         else if (response === 'delete') {
//             // targetJob.companyrejected = true;
//             // targetJob.jobsoftdelete = true;
// // Assuming jobId is the ID of the job you want to soft delete
//             updateJobSoftDelete(Number(jobId), true);
//             console.log("the state of soft delete is " + targetJob.jobsoftdelete)
//
//         }
//
//         else if (response === 'declined') {
//             console.log("Handling declined job application");
//
//             // Set companyrejected to true and companyresponded to false
//             targetJob.companyrejected = true;
//             targetJob.companyresponded = false;
//
//             // Update the state for UI feedback
//             setJobDeclined(true);
//             setJobResponses(prev => ({
//                 ...prev,
//                 [jobId]: 'declined'
//             }));
//
//             // Update the database
//             await updateJobOnServer(jobId, {
//                 companyrejected: true,
//                 companyresponded: false
//             });
//         } else {
//             console.log("Awaiting response from company");
//         }
//     };
//
//
//
//     const updateJobOnServer = async (jobId: string, data: { companyrejected: boolean; companyresponded?: boolean }) => {
//         // Make a PATCH request to your server to update the job with jobId
//         try {
//             const response = await fetch(`http://localhost:8080/api/jobs/update/${jobId}`, {
//                 method: 'PATCH',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify(data)
//             });
//
//             if (!response.ok) {
//                 throw new Error("Failed to update job.");
//             }
//             // Optionally, update your local state if the server responds with updated data.
//             // const updatedJob = await response.json();
//         } catch (error) {
//             console.error("Error updating job:", error);
//         }
//     };
//
//
//     const currentDateMs = new Date().getTime(); // 1. Get current date in milliseconds
//     const TWENTY_ONE_DAYS = 21 * 24 * 60 * 60 * 1000; // Equivalent of 21 days in milliseconds
//     const twentyOneDaysAgoMs = currentDateMs - TWENTY_ONE_DAYS; // 2. Calculate the timestamp 21 days before current date
//
//     const filteredAndRespondedJobs = jobs
//         .filter(job => !job.companyrejected) // Keeps jobs not rejected by the company
//         .filter(job =>
//             job.companyresponded || // Keeps jobs where the company has responded
//             new Date(job.dateapplied).getTime() >= twentyOneDaysAgoMs // Keeps jobs applied within the last 21 days
//         )
//         .filter(job =>
//             (onlyShowResponded ? job.companyresponded : true) && // Conditionally filters based on company response
//             job.companyname.toLowerCase().includes(filter.toLowerCase()) // Keeps jobs that match the search filter
//         )
//         .filter(job => !job.jobsoftdelete); // Excludes jobs where softDelete is true
//
//
//
//
//     const sortedAndRespondedJobs = [...filteredAndRespondedJobs]
//         .filter(job =>
//             !job.companyresponded &&
//             (searchTerm.length < 3 || job.companyname.toLowerCase().includes(searchTerm.toLowerCase().trim()) || job.primarycontact.toLowerCase().includes(searchTerm.toLowerCase().trim()))
//         )
//
//
//         .sort((a, b) => {
//
//
//             switch (sortingCriteria) {
//
//                 case 'select':
//                     // Default sorting, for example by date applied in ascending order
//                     return new Date(a.dateapplied).getTime() - new Date(b.dateapplied).getTime();
//
//                 case 'company-a-z':
//                     return a.companyname.toLowerCase().localeCompare(b.companyname.toLowerCase());
//                 case 'company-z-a':
//                     return b.companyname.toLowerCase().localeCompare(a.companyname.toLowerCase());
//                 case 'company-asc':
//                     return a.companyname.toLowerCase().localeCompare(b.companyname.toLowerCase());
//                 case 'company-desc':
//                     return b.companyname.toLowerCase().localeCompare(a.companyname.toLowerCase());
//                 case 'contact-a-z':
//                     return a.primarycontact.toLowerCase().localeCompare(b.primarycontact.toLowerCase());
//                 case 'contact-z-a':
//                     return b.primarycontact.toLowerCase().localeCompare(a.primarycontact.toLowerCase());
//                 case 'contact-asc':
//                     return a.primarycontact.toLowerCase().localeCompare(b.primarycontact.toLowerCase());
//                 case 'contact-desc':
//                     return b.primarycontact.toLowerCase().localeCompare(a.primarycontact.toLowerCase());
//                 case 'date-asc':
//                     return new Date(a.dateapplied).getTime() - new Date(b.dateapplied).getTime();
//                 case 'date-desc':
//                     return new Date(b.dateapplied).getTime() - new Date(a.dateapplied).getTime();
//                 case 'accepted':
//                     console.log("you have been accepted")
//                     return (jobResponses[b.id] === 'accepted' ? 1 : 0) - (jobResponses[a.id] === 'accepted' ? 1 : 0);
//                 case 'declined':
//                     return (jobResponses[b.id] === 'declined' ? 1 : 0) - (jobResponses[a.id] === 'declined' ? 1 : 0);
//                 case 'no response':
//                     console.log("Job A ID:", a.id, "Response:", jobResponses[a.id]);
//                     console.log("Job B ID:", b.id, "Response:", jobResponses[b.id]);
//                     // return (jobResponses[b.id] === 'no response' ? 1 : 0) - (jobResponses[a.id] === 'no response' ? 1 : 0);
//                     const responseA = jobResponses[a.id] || 'no response'; // default to 'no response' if undefined
//                     const responseB = jobResponses[b.id] || 'no response'; // default to 'no response' if undefined
//                     return (responseB === 'no response' ? 1 : 0) - (responseA === 'no response' ? 1 : 0);
//
//                 case 'delete':
//                     return (jobResponses[b.id] === 'delete' ? 1 : 0) - (jobResponses[a.id] === 'delete' ? 1 : 0);
//                 case 'olderThanSevenDays':
//                     // Assuming 'dateapplied' holds the application date
//                     const aDateDiff = new Date().getTime() - new Date(a.dateapplied).getTime();
//                     const bDateDiff = new Date().getTime() - new Date(b.dateapplied).getTime();
//                     const aOlderThan7Days = aDateDiff > 7 * 24 * 60 * 60 * 1000 ? 1 : 0;
//                     const bOlderThan7Days = bDateDiff > 7 * 24 * 60 * 60 * 1000 ? 1 : 0;
//                     return bOlderThan7Days - aOlderThan7Days;
//
//                 case 'companyResponded':
//                     return (b.companyresponded === false ? 1 : 0) - (a.companyresponded === false ? 1 : 0);
//
//
//                 case 'update':
//                     return (jobResponses[b.id] === 'update' ? 1 : 0) - (jobResponses[a.id] === 'update' ? 1 : 0);
//
//                 case 'meetingLink':
//                     console.log("I have a meeting link for you bud bud")
//                     return (b.meetingLink ? 1 : 0) - (a.meetingLink ? 1 : 0);
//                 default:
//                     return 0;
//             }
//         });
//
//
//     const [isMobileNothing, setIsMobileNothing] = useState(window.matchMedia(nothingHere.mobile).matches);
//
//     const [isMobile, setIsMobile] = useState(window.matchMedia(deviceJobViewAll.mobile).matches);
//     const [isLaptop, setIsLaptop] = useState(window.matchMedia(deviceJobViewAll.laptop).matches);
//
//     useEffect(() => {
//         const checkScreenSize = () => {
//             setIsMobile(window.matchMedia(deviceJobViewAll.mobile).matches);
//             setIsLaptop(window.matchMedia(deviceJobViewAll.laptop).matches);
//         };
//
//         checkScreenSize();
//         window.addEventListener('resize', checkScreenSize);
//
//         return () => {
//             window.removeEventListener('resize', checkScreenSize);
//         };
//     }, []);
//
//
//
//
//
//     const toggleDateSortDirection = () => {
//         setDateSortDirection(dateSortDirection === 'asc' ? 'dsc' : 'asc');
//         setSortingCriteria(dateSortDirection === 'asc' ? 'date-desc' : 'date-asc');
//         setContactSortDirection('dsc');
//         setCompanySortDirection('dsc');
//         setInterviewSortDirection('dsc');
//     };
//
//     const toggleCompanySortDirection = () => {
//         setCompanySortDirection(companySortDirection === 'asc' ? 'dsc' : 'asc');
//         setSortingCriteria(companySortDirection === 'asc' ? 'company-desc' : 'company-asc');
//         setDateSortDirection('dsc');
//         setContactSortDirection('dsc');
//         setInterviewSortDirection('dsc');
//     };
//
//     const toggleContactSortDirection = () => {
//         setContactSortDirection(contactSortDirection === 'asc' ? 'dsc' : 'asc');
//         setSortingCriteria(contactSortDirection === 'asc' ? 'contact-desc' : 'contact-asc');
//         setDateSortDirection('dsc');
//         setCompanySortDirection('dsc');
//         setInterviewSortDirection('dsc');
//     };
//
//     const toggleInterviewSortDirection = () => {
//         setInterviewSortDirection(interviewSortDirection === 'asc' ? 'dsc' : 'asc');
//         setSortingCriteria(interviewSortDirection === 'asc' ? 'accepted' : 'no response');
//         setDateSortDirection('dsc');
//         setContactSortDirection('dsc');
//         setCompanySortDirection('dsc');
//     };
//
//     const handleSortingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         setSortingCriteria(e.target.value);
//     };
//
// //give min heights for containers like our grey boy so it dont get flat
//
//
//     return (
//         <TestWrapper>
//
//                     <StickySearchDiv>
//                         <SearchBar
//                             type="text"
//                             placeholder="Search by company name or contact..."
//                             value={searchTerm}
//                             onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setSearchTerm(e.target.value)}
//                         />
//                         <RedPillParentDiv>
//
//                             <RedPillContainer>
//                                 <button onClick={toggleDateSortDirection} style={{ all: 'unset' }}>
//                                     {dateSortDirection === 'asc' ? 'Date Asc' : 'Date Desc'}
//                                     <FontAwesomeIcon icon={dateSortDirection === 'asc' ? faCaretUp : faCaretDown} size="lg" />
//                                 </button>
//                             </RedPillContainer>
//
//                             <RedPillContainer>
//                                 <button onClick={toggleCompanySortDirection} style={{ all: 'unset' }}>
//                                     {companySortDirection === 'asc' ? 'Company Asc' : 'Company Desc'}
//                                     <FontAwesomeIcon icon={companySortDirection === 'asc' ? faCaretUp : faCaretDown} size="lg" />
//                                 </button>
//                             </RedPillContainer>
//
//
//                             <RedPillContainer>
//                                 <button onClick={toggleContactSortDirection} style={{ all: 'unset' }}>
//                                     {contactSortDirection === 'asc' ? 'Contact Asc' : 'Contact Desc'}
//                                     <FontAwesomeIcon icon={contactSortDirection === 'asc' ? faCaretUp : faCaretDown} size="lg" />
//                                 </button>
//                             </RedPillContainer>
//
//                             <RedPillContainer>
//                                 <button onClick={toggleInterviewSortDirection} style={{ all: 'unset' }}>
//                                     {interviewSortDirection === 'asc' ? 'Accepted' : 'No Response'}
//                                     <FontAwesomeIcon icon={interviewSortDirection === 'asc' ? faCaretUp : faCaretDown} size="lg" />
//                                 </button>
//                             </RedPillContainer>
//
//                         </RedPillParentDiv>
//
//                         <SelectDiv>
//                             <SimpleSelect value={sortingCriteria} onChange={handleSortingChange}>
//                                 <option value="">Default Filter</option> {/* Default option */}
//
//                                 <option value="date-asc">Date Ascending</option>
//                                 <option value="date-desc">Date Descending</option>
//                                 <option value="company-a-z">Company A-Z</option>
//                                 <option value="company-z-a">Company Z-A</option>
//                                 <option value="contact-a-z">Contact A-Z</option>
//                                 <option value="contact-z-a">Contact Z-A</option>
//                                 <option value="rejected-yes">Rejected Yes</option>
//                                 <option value="rejected-no">Rejected No</option>
//                                 {/* other options */}
//                             </SimpleSelect>
//
//
//                         </SelectDiv>
//
//                     </StickySearchDiv>
//                 <RedBox>
//                     {/*<VerticalLine></VerticalLine>*/}
//                     <TopBox>
//                         <YellowBox>
//                             <p>
//                                 Jan 1st 1919
//                             </p>
//
//
//
//
//                         </YellowBox>
//                         <IconBox>
//                             <FontAwesomeIcon
//                                 icon={faCalendar}
//                                 style={{  color: "black" }} // Added marginRight here
//                                 size="lg" // Example size - adjust as needed
//
//                             />
//
//                             {/*<FontAwesomeIcon*/}
//                             {/*    icon={faSkullCrossbones}*/}
//                             {/*    style={{  color: "black" }} // Added marginRight here*/}
//
//                             {/*/>*/}
//
//                             <FontAwesomeIcon
//                                 icon={faEdit}
//                                 style={{  color: "black" }} // Added marginRight here
//                                 size="lg" // Example size - adjust as needed
//
//
//                             />
//
//
//
//                         </IconBox>
//
//                         <GreenBox>
//                             <p>
//                                 Description
//                             </p>
//                         </GreenBox>
//
//                     </TopBox>
//
//                     <MiddleBox>
//
//                         <VioletBox>
//                             <BlueBox>
//                                 <p>
//                                     Orky Inc
//                                 </p>
//                             </BlueBox>
//
//                             <PurpleBox>
//                                 <FontAwesomeIcon icon={faGlasses}
//                                                  size="lg" // Example size - adjust as needed
//                                 />
//
//                             </PurpleBox>
//                         </VioletBox>
//
//                     </MiddleBox>
//                     <BottomBox>
//
//                         <TurquoiseBox>
//
//                             <SkyBlueBox>
//                                 <p>
//                                     Goregutz Noobstompa
//                                 </p>
//                             </SkyBlueBox>
//
//                             <GoldBox>
//                                 <GreyBox>
//                                     Responded?
//                                     <CheckBoxInput
//                                         type="checkbox"
//                                     />
//                                 </GreyBox>
//
//                                 <PinkBox>
//                                     Rejected?
//                                     <CheckBoxInput
//                                         type="checkbox"
//                                     />
//                                 </PinkBox>
//                             </GoldBox>
//
//
//
//                         </TurquoiseBox>
//
//
//
//
//
//
//                     </BottomBox>
//
//
//
//
//
//                 </RedBox>
//
//
//         </TestWrapper>
//     );
// };
//
// const IconBox = styled.div`
//   height: 90%;
//   width: 100%;
//   //background-color: violet;
//   margin-top: 2.2%;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   display: flex;
//   justify-content: space-between;
//
//
//   p {
//     color: black;
//   }
// `;
//
//
// const VioletBox = styled.div`
//   height: 90%;
//   width: 100%;
//   //background-color: violet;
//   margin-top: 1%;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//
//
//   p {
//     color: black;
//   }
// `;
//
//
// const GoldBox = styled.div`
//   height: 50%;
//   width: 100%;
//   //background-color: gold;
//   display: flex;
//   flex-direction: row;
//   margin-top: 5%;
// `;
// const TurquoiseBox = styled.div`
//   height: 80%;
//   width: 60%;
//   //background-color: turquoise;
//   //margin-left: 22%;
//   margin-top: 1%;
//
//
//
//   p {
//     color: black;
//   }
// `;
//
// const PinkBox = styled.div`
//   height: 100%;
//   width: 50%;
//   //background-color: pink;
//   margin-left: 1%;
//   margin-top: 1%;
//
//
//   p {
//     color: black;
//   }
// `;
//
//
// const GreyBox = styled.div`
//   height: 100%;
//   width: 50%;
//   background-color: grey;
//   margin-left: 7%;
//   margin-top: 1%;
//   padding-left: 60px;
//
//
//   p {
//     color: black;
//   }
// `;
//
//
//
// const SkyBlueBox = styled.div`
//   height: 30%;
//   width: 80%;
//   //background-color: skyblue;
//   margin-left: 9.5%;
//   margin-top: 1%;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//
//
//   p {
//     color: black;
//   }
// `;
//
//
// const TopBox = styled.div`
//   height: 15%;
//   width: 100%;
//   //background-color: goldenrod;
//   display: flex;
//   justify-content: space-between; // Added this line
// `;
//
//
//
//
// const BottomBox = styled.div`
//   height: 43%;
//   width: 100%;
//   //background-color: cadetblue;
//   display: flex;
//   justify-content: center;
//   //flex-direction: column;
//   //position: relative; /* Add this line to create a positioning context for absolute positioning */
//
//   svg {
//     position: absolute;
//     bottom: 0;
//     right: 0;
//   }
// `;
//
//
// const RedBox = styled.div`
//   height: 30%;
//   width: 50%;
//   background-color: grey;
//   margin-left: 25%;
//   display: flex;
//   flex-direction: column;
//   align-items: stretch; // Changed from center to stretch
// `;
//
//
//
//
// const YellowBox = styled.div`
//   height: 80%;
//   width: 25%;
//   //background-color: yellow;
//   margin-left: 3%;
//   margin-top: 2.5%;
//   display: flex;
// justify-content: space-between;
//
//
//   p {
//     color: black;
//   }
// `;
//
//
//
//
//
// const GreenBox = styled.div`
//   height: 100%;
//   width: 20%;
//   //background-color: green;
//   padding-left: 15px;
//   margin-right: 2.5%;
//   padding-top: 40px;
// justify-content: space-between;
//   align-items: center;
//   display: flex;
//   p {
//     color: white;
//   }
// `;
// const MiddleBox = styled.div`
//   height: 41%;
//   width: 100%;
//   //background-color: chocolate;
//   display: flex; // Enable flex layout
//   align-items: center; // Align children vertically in the center
//   justify-content: center;
// `;
//
// const BlueBox = styled.div`
//   height: 20%;
//   //background-color: blue;
//   //padding-left: 30px;
//   padding-top: 10px;
//   margin-top: 8%;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//  margin-left: 15%;
//
//
//   a {
//     color: white;
//
//   }
//
//   p {
//     font-family: "Helvetica Neue", helvetica, arial, sans-serif;
//
//   }
//
// `;
//
// const PurpleBox = styled.div`
//   height: 20%;
//   width: 15%;
//   //background-color: purple;
//   padding-left: 2px;
//   padding-top: 1px;
//   margin-top: 7.9%;
//   margin-left: 2%;
//   display: flex;
//   svg {
//     color: white;
//   }
// `;
//
//
// // const BrownBox = styled.div`
// //   height: 20%;
// //   width: 15%;
// //   background-color: brown;
// //   margin-left: auto; // Adjust to push the box to the far right
// //   padding-left: 10px;
// //   padding-top: 10px;
// //
// //   p {
// //     color: white;
// //   }
// // `;
// //
//
//
//
//
//
//
//
// const RedPillParentDiv = styled.div`
//   display: flex;
//   margin-left: 10px;
//
//
//   @media ${noResponseJobs.mobile} {
//     display: none; // Hide on larger screens
//
//     @media (max-width: 1150px) {
//     }
//   }
// `;
//
//
//
//
//
// // const StyledTableContainer = styled(TableContainer)`
// //     height: 93vh;  /* Adjust to your preference */
// //     overflow-y: auto;
// //   background-color: lightsalmon;
// // `;
// const TestWrapper = styled.div`
//     height: 93vh;
//   overflow-y: auto;
//   //background-color: lightskyblue;
//
//   p {
//     font-family: "Helvetica Neue", helvetica, arial, sans-serif;
//
//   }
// `;
//
//
// const TextButton = styled.button`
//     background: none;
//     border: none;
//     color: inherit;  // Use the same color as the surrounding text
//     font: inherit;  // Use the same font and size as the surrounding text
//     cursor: pointer;  // Change mouse cursor to pointer on hover
//     padding: 0;
//     margin: 0;
//     text-decoration: underline;  // Optionally add underline to make it obvious it's clickable
//     outline: none;  // Remove focus border on click
//
//     &:hover, &:focus {
//         color: #007BFF;  // Change color on hover/focus. Pick any color that suits your design
//     }
// `;
//
//
// const CardBoxDiv = styled.div`
//   display: flex;
//   flex-direction: column; /* Keep the cards aligned vertically */
//   gap: 10px; /* Maintain the 10px spacing between cards */
//   align-items: center; /* Center-align the cards horizontally */
//   justify-content: center; /* Center the content vertically if needed */
// `;
//
// interface CardProps {
//     companyRejected: boolean;
//     companyResponded: boolean;
//     meetingLink: string;
//     isOlderThanSevenDays: boolean;
// }
//
// const CardDiv = styled.div<CardProps>`
//   position: relative;
//   background: ${props => {
//     if (props.companyRejected) {
//         return 'linear-gradient(to left, #ff0000, #ff9999)'; // Red gradient
//     } else if (props.meetingLink) {
//         return 'linear-gradient(to left, #34e89e, #78ffd6)'; // Green gradient
//     } else if (props.isOlderThanSevenDays) {
//         return 'linear-gradient(to left, #FFDD3C, #FFEA61)'; // Yellow gradient
//     } else if (!props.companyResponded) {
//         return 'linear-gradient(to left, #808080, #b3b3b3)'; // Grey gradient
//     }
//     return 'linear-gradient(to left, #808080, #b3b3b3)'; // Default gradient color
// }};
//   box-shadow:
//           -4px 0 8px -2px rgba(0, 0, 0, 0.2), /* Left shadow */
//           4px 0 8px -2px rgba(0, 0, 0, 0.2),  /* Right shadow */
//           0 4px 8px -2px rgba(0, 0, 0, 0.2);  /* Bottom shadow */
//   // ... other styles
//   padding: 10px;
//   border: 1px solid #ccc;
//   min-width: 50%;
//   margin-top: 1%;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//
//
//   // Icons styles
//   .hidden-icons {
//     display: none;
//     position: absolute;
//
//     top: 50%; // Center vertically within the card
//     left: 0%; // Shift to the right by 30% of the CardDiv's width
//     transform: translateY(-50%); // Adjust vertically to center
//     // ... other icon styles
//   }
//
//   &:hover {
//     .hidden-icons {
//       display: block;
//
//     }
//     min-height: 70px;
//   }
//
//   .custom-icon {
//     font-size: 20px;
//   }
//
//   .custom-icon-lg {
//     font-size: 30px;
//   }
//
//   .custom-icon-sm {
//     font-size: 16px;
//   }
//
//   .soft-delete-icon {
//     font-size: 16px;
//     margin-top: 50px;
//   }
//
//   @media ${noResponseJobs.mobile} {
//     width: 80%; /* Adjust width to 80% on mobile devices */
//   }
// `;
//
// const SearchBar = styled.input`
//   width: 25%;
//   min-width: 200px;
//   padding: 10px;
//   border: 1px solid #ccc;
//   border-radius: 4px;
//   display: block;
//   margin-left: auto;
//   //margin-right: auto;
//   background-color: white; /* Set the background color of SearchBar */
//   position: sticky; /* Make it sticky */
//   top: 0; /* Stick it to the top */
//   z-index: 1; /* Ensure it's above other elements */
//   overflow: hidden; /* Hide any overflow */
//   @media (max-width: 1150px) {
//     margin-left: 170px; // Background color for screens wider than 1150px
//   }
//
//   @media ${noResponseJobs.mobile} {
//     display: flex;
//     align-items: flex-start;
//     margin-right: auto;
//     margin-left: 40px;
//     min-width: 150px;
//
//
//   }
//
//   @media ${noResponseJobs.laptop} {
//     min-width: 200px; /* Adjust width to 80% on mobile devices */
//     left: 5%;
//     transform: translateX(-10%); // Adjust to move the element back by 10% of its own width
//     margin-right: 10%;
//
//   }
// `;
//
//
// const RedPillContainer = styled.div`
//   display: inline-block;
//   min-width: 140px;
//   height: 30px;
//   background-color: red;
//   border-radius: 15px;
//   box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.5);
//   margin-right: 1.5%;
//
//   border: 2px solid black;
//   text-align: center; /* Center children horizontally */
//   //line-height: 30px; /* Center children vertically */
//
//   & > svg {
//     margin-left: 10px; /* Add margin to the left of the FontAwesomeIcon */
//   }
//
//   &:hover {
//     cursor: pointer;
//   }
//
//   @media ${noResponseJobs.mobile} {
//     display: none; // Hide on mobile devices
//   }
//
//   @media (max-width: 1150px) {
//     background-color: blue; // Background color for screens wider than 1150px
//   }
// `;
//
//
// const StickySearchDiv = styled.div`
//   position: sticky;
//   top: 0%;
//   z-index: 5;
//   display: flex;
//   flex-direction: row;
//   justify-content: center;
//   align-items: center;
//   padding-right: 180px;
//   height: 10vh;
//   background-color: blue;
//
//   @media ${noResponseJobs.mobile} {
//     width: 100vw;
//     background-color: grey;
//     padding-right: 12%;
//     min-height: 50px;
//
//   }
//
// `;
//
//
// const SelectDiv = styled.div`
//     display: flex;
//
//
//   // @media ${noResponseJobs.mobile} {
//   //   display: block; // Show on mobile devices
//   // }
//
//   @media ${noResponseJobs.laptop} {
//     display: none; // Hide on larger screens
//   }
// `;
//
//
// const SimpleSelect = styled.select`
//     padding: 5px 10px;
//     font-size: 16px;
//     border: 1px solid #ccc;
//     border-radius: 4px;
//     appearance: none;
//     outline: none;
//   width: 25vw;
//    margin-right: -4px;
//
// `;
//
// const CheckBoxInput = styled.input`
// margin-left: 11%;
// `;
//
//
// const VerticalLine = styled.div`
//   position: fixed; // or absolute, depending on your layout
//   left: 50%;
//   height: 100vh;
//   width: 1px; // or as thick as you want
//   background-color: #000; // or any color of your choice
//   z-index: 10; // adjust as needed
// `;