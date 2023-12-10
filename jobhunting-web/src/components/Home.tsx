

import React, {useState, ChangeEvent, FormEvent, useContext, useEffect} from "react";
import { User } from "../models/User";
import AuthService from "../services/auth.service";
import { UserContext } from "../services/usercontext";
import styled from 'styled-components';
import "react-datepicker/dist/react-datepicker.css";
import UserService from "../services/user.service";
import {device, deviceHome, deviceJobViewAll} from "../common/ScreenSizes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faGithub, faLinkedin} from '@fortawesome/free-brands-svg-icons';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';
import Button from '@mui/material/Button';
import {InputLabel, TextFieldProps, useTheme} from '@mui/material';
import TextField from '@mui/material/TextField';
import {useNavigate, useParams} from "react-router-dom";
import {DateMutation} from "../common/DateMutation";
import Box from "@mui/material/Box";
import {JobCarousel} from "./JobCarousel";
import {Job} from "../models/Job";
import {colors, fonts} from "../common/CommonStyles";


export const Home: React.FC = () => {
    const [searchResult, setSearchResult] = useState<Job[] | null>(null);


    //useContext might be a better idea for V2
    const [companyname, setCompanyName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [jobposter, setJobPoster] = useState<string>("n/a");
    const [  primarycontact, setPrimaryContact] = useState<string>("");
    const [ companywebsitelink, setCompanyWebSiteLink] = useState<string>("");
    const [ joblink, setJobLink] = useState<string>("");
    const [ interviewnotes, setInterviewNotes] = useState<string>("n/a");
    const [ customfield, setCustomField] = useState<string>("n/a");
    const [ interviewernames, setInterviewerNames] = useState<string>("n/a");
    const [dateapplied, setDateApplied] = useState<Date>(new Date());
    const [ interviewdate, setInterviewDate] = useState<Date>(new Date("2023-07-22"));
    const [companyresponded, setCompanyResponded] = useState<boolean>(false);
    const [companyrejected, setCompanyRejected] = useState<boolean>(false);
    const [jobsoftdelete, setJobSoftDelete] = useState<boolean>(false);
    const [selectedOption1, setSelectedOption1] = useState(localStorage.getItem('selectedOption1') || 'github');
    const [selectedOption2, setSelectedOption2] = useState(localStorage.getItem('selectedOption2') || 'default');
    const [selectedOption3, setSelectedOption3] = useState(localStorage.getItem('selectedOption3') || 'portfolio');
    const currentUser: User | null = AuthService.getCurrentUser();
    const { user } = useContext(UserContext);
    const { id } = useParams<{ id: string }>();

    const [count, setCount] = useState<number>(() => {
        const storedCount = localStorage.getItem('count');
        const storedDate = localStorage.getItem('date');
        const today = new Date().toISOString().split('T')[0]; // get today's date in YYYY-MM-DD format
        if (storedDate === today && storedCount !== null) {
            return parseInt(storedCount);
        } else {
            return 0;
        }
    });

    // const [searchResult, setSearchResult] = useState<Job[] | null>(null);




    // interface Job {
    //     companyname: string;
    //     primarycontact: string;
    //     joblink: string;
    //     dateapplied: Date;
    //     companyresponded: boolean;
    //     companyrejected: boolean;
    //     jobsoftdelete: boolean;
    // }






    useEffect(() => {
        console.log("am I being user id?" + id)

        if (companyname) {

            handleSearch(companyname);
        } else {
            setSearchResult(null);
        }
    }, [companyname]);


    //need  to build out a feature so that if copy /paste/ typing a company
    // it shows up if it exist in the databasse

    useEffect(() => {
        localStorage.setItem('count', count.toString());
        localStorage.setItem('date', new Date().toISOString().split('T')[0]);
    }, [count]);

    useEffect(() => {
        localStorage.setItem('selectedOption1', selectedOption1);
        localStorage.setItem('selectedOption2', selectedOption2);
        localStorage.setItem('selectedOption3', selectedOption3);
    }, [selectedOption1, selectedOption2, selectedOption3]);


    const navigate = useNavigate(); // Add this line to get the navigate function

    useEffect(() => {
        if (id) {
            console.log("am I being called?")
            console.log("am I being user id?" + id)

            const userId = parseInt(id, 10); // Parse id as an integer

            UserService.getUserById(userId)
                .then((user: User) => {
                    console.log(`User ${user.id}`);
                    console.log(` - Username: ${user.username}`);
                    console.log(` - Email: ${user.email}`);
                    console.log(` - CustomField1: ${user.customfield1}`);
                    console.log(` - CustomField2: ${user.customfield2}`);
                    console.log(` - CustomField3: ${user.customfield3}`);

                    if (currentUser?.id !== user.id) {
                        alert("You are not authorized to be here")
                        console.log("User ID mismatch. Logging out.");
                        AuthService.logout(); // You should implement your logout logic here
                        navigate("/"); // Redirect to the login page or any desired page after logout
                    }
                })
                .catch((error: any) => {
                    console.error("Error fetching user: ", error);
                });
        }
    }, [id, currentUser, navigate]);

    const handleJobSubmit = async (e: FormEvent) => {
        console.log("I'm the handle submit button on the home page");
        e.preventDefault();
        const error = validateCompanyName(companyname);
        setCompanyNameError(error);

        let isValid = true;
        const trimmedCompanyName = companyname.trim();

        // Validate company name
        if (!trimmedCompanyName) {
            setCompanyNameError("Minimum 1 character required");
            isValid = false;
        } else if (trimmedCompanyName.length > 55) {
            setCompanyNameError("Company name cannot exceed 55 characters");
            isValid = false;
        } else {
            setCompanyNameError("");
        }





        let updatedDescription = description.trim() || "N/A";
        if (!updatedDescription) {
            setDescription("N/A"); // Set to "N/A" if blank
        } else if (updatedDescription.length > 255) {
            setCompanyDescriptionError("Description cannot exceed 255 characters");
            isValid = false;
        } else {
            setDescription(updatedDescription);
            setCompanyDescriptionError("");
        }

        let updatedPrimaryContact = primarycontact.trim() || "N/A";
        if (updatedPrimaryContact.length > 30) {
            setCompanyContactError("Primary contact cannot exceed 30 characters");
            isValid = false;
        } else {
            setPrimaryContact(updatedPrimaryContact); // Assuming you have a state setter for primarycontact
            setCompanyContactError(null);
        }


        let updatedCompanyWebsiteLink = companywebsitelink.trim() || "N/A";
        if (updatedCompanyWebsiteLink.length > 1000) {
            setCompanyWebSiteLinkError("Company website link cannot exceed 1000 characters");
            isValid = false;
        } else {
            setCompanyWebSiteLink(updatedCompanyWebsiteLink);
            setCompanyWebSiteLinkError(null);
        }

        // Process job link
        let updatedJobLink = joblink.trim() || "N/A";
        if (updatedJobLink.length > 1000) {
            setCompanyJobLinkError("Job link cannot exceed 1000 characters");
            isValid = false;
        } else {
            setJobLink(updatedJobLink);
            setCompanyJobLinkError(null);
        }




        // Update state with new values
        setDescription(updatedDescription);
        setPrimaryContact(updatedPrimaryContact);
        setCompanyWebSiteLink(updatedCompanyWebsiteLink);
        setJobLink(updatedJobLink);

        // Validate description
        // if (description.trim().length < 3) {
        //     setCompanyDescriptionError("Minimum 3 characters such as N/A");
        //     isValid = false;
        // } else {
        //     setCompanyDescriptionError("");
        // }
        //
        // if (primarycontact.trim().length < 3) {
        //     setCompanyContactError("Minimum 3 characters such as N/A");
        //     isValid = false;
        // } else {
        //     setCompanyContactError("");
        // }
        //
        // if (companywebsitelink.trim().length < 3) {
        //     setCompanyWebSiteLinkError("Minimum 3 characters such as N/A");
        //     isValid = false;
        // } else {
        //     setCompanyWebSiteLinkError("");
        // }
        //
        // if (joblink.trim().length < 3) {
        //     setCompanyJobLink("Minimum 3 characters such as N/A");
        //     isValid = false;
        // } else {
        //     setCompanyJobLink("");
        // }

        // Check if any validations failed
        if (!isValid) {
            return; // Stop form submission if there are validation errors
        }

        // Clear error message if the validation passes
        setCompanyNameError("");

        // if (error) {
        //     // If there's an error, stop the function
        //     return;
        // }


        try {
            if (currentUser) {
                const response = await fetch(
                    `http://localhost:8080/api/jobs/createjob/${currentUser.id}`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ companyname, customfield, description, jobposter, primarycontact,
                            companywebsitelink, joblink , interviewnotes,  interviewernames, dateapplied,
                            interviewdate, companyresponded, companyrejected, jobsoftdelete}),
                    }
                );
                if (response.ok) {
                    alert("Your job is created in the database.")
                    console.log("Job created successfully");
                    setCompanyName("");
                    setDescription("");
                    setJobPoster("");
                    setPrimaryContact("");
                    setCompanyWebSiteLink("");
                    setJobLink("");
                    setInterviewNotes("n/a");
                    setCustomField("n/a");
                    setInterviewerNames("n/a");
                    setDateApplied(new Date());
                    setInterviewDate(new Date());
                    setCompanyResponded(false);
                    setCompanyRejected(false);
                    setJobSoftDelete(false);
                    setCount(count + 1);
                    alert("Adding +1 to the counter.")
                } else {
                    console.log("Failed to create job");
                }
            } else {
                console.log("Current user is null or undefined");
            }
        } catch (error) {
            console.log("Error occurred:", error);
        }
    };

    const handleCompanyNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCompanyName(e.target.value);
        if (companyNameError) setCompanyNameError("");
    };

    const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value);
        if (companyDescriptionError) setCompanyDescriptionError("");

    };

    const handlePrimaryContact = (e: ChangeEvent<HTMLInputElement>) => {
        setPrimaryContact(e.target.value);
        if (companyContactError) setCompanyContactError("");

    }

    const handleCompanyWebSiteLink = (e: ChangeEvent<HTMLInputElement>) => {
        setCompanyWebSiteLink(e.target.value);
        if (companyWebSiteLinkError) setCompanyWebSiteLinkError("");

    }




    const handleJobLink = (e: ChangeEvent<HTMLInputElement>) => {
        setJobLink(e.target.value);
        if (companyJobLinkError) setCompanyJobLinkError("");

    }

    const copyToClipboard = async (selectedOption: string) => {
        const textToCopy = () => {
            switch(selectedOption) {
                case 'github':
                    return user?.customfield3 || '';
                case 'linkedin':
                    return user?.customfield2 || '';
                case 'portfolio':
                default:
                    return user?.customfield1 || '';
            }
        }
        try {
            await navigator.clipboard.writeText(textToCopy());
            alert('Copied!');
        } catch (err) {
            alert('Failed to copy text');
        }
    };

    const handleSearch = async (companyName: string) => {
        try {
            const response = await fetch(`http://localhost:8080/api/jobs`, {
                headers: {
                    'Authorization': `Bearer YOUR_AUTH_TOKEN`, // Replace with your actual token
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const companies: Job[] = await response.json();
            console.log("API Response: ", companies); // Debugging - to understand the structure of the response

            // Logging the typed company name
            console.log("Typed Company Name: ", companyName);

            // Check if any company name exactly matches the typed companyName
            const matchingJobs = companies.filter((job: Job) => job.companyname === companyName);

            // Logging the result of the search
            if (matchingJobs.length > 0) {
                console.log("Matching companies found: ", matchingJobs);
                setSearchResult(matchingJobs);
            } else {
                console.log("No matching companies found");
                setSearchResult([]);
            }
        } catch (error) {
            console.error("Error during search: ", error);
        }
    };




    const [isMobile, setIsMobile] = useState(window.matchMedia(deviceHome.mobile).matches);
    const [isLaptop, setIsLaptop] = useState(window.matchMedia(deviceHome.laptop).matches);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.matchMedia(deviceHome.mobile).matches);
            setIsLaptop(window.matchMedia(deviceHome.laptop).matches);
        };

        checkScreenSize();
        window.addEventListener('resize', checkScreenSize);

        return () => {
            window.removeEventListener('resize', checkScreenSize);
        };
    }, []);

    const theme = useTheme();


    const [companyNameError, setCompanyNameError] = useState<string | null>(null);
    const [companyDescriptionError, setCompanyDescriptionError] = useState<string | null>(null);
    const [companyContactError, setCompanyContactError] = useState<string | null>(null);
    const [companyWebSiteLinkError, setCompanyWebSiteLinkError] = useState<string | null>(null);
    const [companyJobLinkError, setCompanyJobLinkError] = useState<string | null>(null);

// ... your existing state and functions ...

    const validateCompanyName = (name: string): string | null => {
        if (name.trim().length < 1) {
            return "Company name must be at least 1 letter long.";
        }
        return null;
    };

    useEffect(() => {
        console.log('searchResult:', searchResult);
    }, [searchResult]);





    return (
        <Box
            sx={{
                backgroundColor: colors.AppBackGroundColor,
                height: "100%",
                width: "100vw",

            }}
        >
            <Box
                sx={{
                    // backgroundColor: "blue",
                    height: "10vh",
                    width: "100vw",
                    display: "flex",
                    // flexDirection: "row",
                    justifyContent: "center",
                    position: "relative",
                    minHeight: "30px",
                    // justifyContent: "space-around", // Even space around items
                    marginBottom: {
                        md: "0",
                        xs: "1%"
                    },


                }}
            >
                {/*<VerticalLine2></VerticalLine2>*/}


                <Box
                    sx={{
                        // backgroundColor: "purple",
                        height: "8vh",
                        width: "5vw",
                        display: "flex",
                        justifyContent: "center", // Corrected property name
                        alignItems: "center",
                        position: "relative",
                        minHeight: "30px",
                        marginRight: {
                            xs: "15%",
                            sm: "5%",

                        },







                    }}
                >
                    <FontAwesomeIcon
                        icon={faGithub}
                        size="2x"
                        onClick={() => copyToClipboard(selectedOption1)}
                        style={{
                            cursor: 'pointer',
                            transform: 'scale(1)',
                            transition: 'transform 0.2s',
                            color: colors.TextBlackColor,
                        }}                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.10)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />

                    {/*<VerticalLine2></VerticalLine2>*/}
                </Box>

                <Box
                    sx={{
                        // backgroundColor: "purple",
                        height: "8vh",
                        width: "5vw",
                        display: "flex",
                        justifyContent: "center", // Corrected property name
                        alignItems: "center",
                        position: "relative",
                        minHeight: "30px",
                        paddingRight: "0.5%",

                        marginRight: {
                            xs: "15%",
                            sm: "5%",

                        },





                    }}
                >
                    {/*<VerticalLine2></VerticalLine2>*/}
                    <FontAwesomeIcon
                        icon={faLinkedin}
                        size="2x"
                        onClick={() => copyToClipboard(selectedOption2)}
                        style={{
                            cursor: 'pointer',
                            transform: 'scale(1)',
                            transition: 'transform 0.2s',
                            color: colors.TextBlackColor,
                        }}                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.10)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />

                </Box>





                <Box
                    sx={{
                        // backgroundColor: "purple",
                        height: "8vh",
                        width: "5vw",

                        display: "flex",
                        justifyContent: "center", // Corrected property name
                        alignItems: "center",
                        position: "relative",
                        minHeight: "30px",

                    }}
                >
                    {/*<VerticalLine2></VerticalLine2>*/}
                    <FontAwesomeIcon
                        icon={faBriefcase}
                        size="2x"
                        onClick={() => copyToClipboard(selectedOption3)}
                        style={{
                            cursor: 'pointer',
                            transform: 'scale(1)',
                            transition: 'transform 0.2s',
                            color: colors.TextBlackColor,
                        }}                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.10)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    />

                </Box>
            </Box>

            <Box
                sx={{
                    display: "flex", // Enable flexbox
                    justifyContent: "center", // Center horizontally
                    alignItems: "center", // Center vertically
                    height: "90%", // Remaining height after the blue box
                    width: "100vw",
                    position: "relative",

                }}
            >



                <Box
                    sx={{
                        // backgroundColor: "brown",
                        // height: "90%",
                        height: {
                            xs: "100%",
                            md: "90%",
                        },
                        width: "95vw",
                        display: "flex",
                        justifyContent: "center", // Center horizontally
                        alignItems: "center", // Center vertically
                        position: "relative",
                        // overflow: "auto",          // Add scrollbars if content overflows


                        flexDirection: {
                            xs: "column", // On extra small screens (mobile), set flexDirection to column
                            md: "row" // On medium screens and above (601px and more), set flexDirection to row
                        },

                    }}
                >

                    <Box
                        sx={{
                            backgroundColor: colors.FormContainer,
                            // height: "70vh",
                            height: {
                                xs: "500px",
                                md: "70%",
                            },
                            width: "44vw",
                            position: 'relative', // Important for absolute positioning of children
                            // marginLeft: "28.8%",
                            // minHeight: "540px",
                            minHeight: {
                                xs: "500px",
                                sm: "470px",
                                md: "540px",
                            },
                            minWidth: "300px",
                            // marginLeft: {
                            //     xs: "0",
                            //     md: "28.5",
                            // },
                            marginLeft: {
                                xs: "0",       // 0 for extra-small devices
                                md: "28.5%",   // 28.5% margin for medium devices and above
                                lg: "28.5%",   // 28.5% margin for large devices and above
                            },
                            marginTop: {
                                md: "0",
                                xs: "5%"
                            },
                            boxShadow: {
                                xs: "none", // No box shadow for extra-small devices
                                md: `-4px 0 8px -2px rgba(0, 0, 0, 0.2), 4px 0 8px -2px rgba(0, 0, 0, 0.2), 0 4px 8px -2px rgba(0, 0, 0, 0.2)`, // Box shadow for medium devices and above
                            },

                            borderRadius: 6, // Add this line to set the border-radius to 10px



                        }}
                    >
                        {/*<VerticalLine2></VerticalLine2>*/}




                        <CustomFieldForm onSubmit={handleJobSubmit}>


                            <FieldContainerDiv>
                                {/*<VerticalLine2></VerticalLine2>*/}

                                <StyledTextField
                                    type="text"
                                    variant="outlined"

                                    placeholder="company name" // Using placeholder instead of label
                                    value={companyname}
                                    onChange={handleCompanyNameChange}
                                />

                                {companyNameError && <div style={{color: colors.errorRedColor}}>{companyNameError}</div>}

                            </FieldContainerDiv>


                            <FieldContainerDiv>
                                <StyledTextField
                                    type="text"
                                    variant="outlined"
                                    placeholder="description"
                                    value={description}
                                    onChange={handleDescriptionChange} />
                                {companyDescriptionError && <div style={{color: colors.errorRedColor,}}>{companyDescriptionError}</div>}

                            </FieldContainerDiv>


                            <FieldContainerDiv>
                                <StyledTextField
                                    type="text"
                                    variant="outlined"
                                    placeholder="contact"
                                    value={primarycontact}
                                    onChange={handlePrimaryContact} />
                                {companyContactError && <div style={{ color: colors.errorRedColor}}>{companyContactError}</div>}

                            </FieldContainerDiv>

                            <FieldContainerDiv>
                                <StyledTextField
                                    type="text"
                                    variant="outlined"
                                    placeholder="company website link"
                                    value={companywebsitelink} onChange={handleCompanyWebSiteLink} />
                                {companyWebSiteLinkError && <div style={{color: colors.errorRedColor}}>{companyWebSiteLinkError}</div>}

                            </FieldContainerDiv>

                            <FieldContainerDiv>
                                <StyledTextField
                                    type="text"
                                    variant="outlined"
                                    placeholder="job link"

                                    value={joblink} onChange={handleJobLink} />

                                {companyJobLinkError && <div style={{ color: colors.errorRedColor}}>{companyJobLinkError}</div>}

                            </FieldContainerDiv>

                            <ButtonDiv>
                                <SubmitButton
                                    sx={{
                                        borderRadius: 10,
                                        background: colors.ButtonColor,
                                        border: '1px solid #007BFF',
                                        '&:hover': {
                                            background: colors.HoverButtonColor,
                                            boxShadow: '0 0 10px #00C9FF',
                                        },
                                        textTransform: 'none',
                                        fontSize: fonts.ButtonFontREM,
                                        fontWeight: 'bold',
                                        fontFamily: fonts.ButtonFontFamily,
                                    }}
                                    variant="contained"
                                    type="submit"

                                >
                                    Submit
                                </SubmitButton>

                            </ButtonDiv>
                        </CustomFieldForm>


                    </Box>

                    <Box
                        sx={{
                            // backgroundColor: "yellow",
                            height: {
                                xs: "20%",
                                md: "70%",
                            },
                            // width: "30vw",
                            width: {
                                xs: "44vw",
                                md: "30vw",
                            },
                            position: "relative",
                            // minHeight: "540px",
                            minHeight: {
                                xs: "200px",
                                md: "540px",
                            },
                            marginTop: {
                                xs: "10px",
                            },
                            minWidth: "300px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",





                        }}
                    >

                        {
                            Array.isArray(searchResult) && searchResult.length > 0 && (
                                <JobCardDiv style={Array.isArray(searchResult) && searchResult.length > 0 ? jobCardStyle : {}}>
                                    <JobCarousel searchResult={searchResult} />
                                </JobCardDiv>
                            )
                        }

                    </Box>
                    {/* Content of the brown box */}
                </Box>
                {/*<VerticalLine></VerticalLine>*/}

            </Box>
            <Footer></Footer>
        </Box>


    );
};

const jobCardStyle = {
    backgroundColor: colors.FormContainer,
    justifyContent: "center",
    alignItems: "center",


    // marginTop: "1%",
    // paddingTop: device.mobile ? '3%' : '0.1%', // 3% padding for mobile, 1% for others
    boxShadow: '-4px 0 8px -2px rgba(0, 0, 0, 0.2), 4px 0 8px -2px rgba(0, 0, 0, 0.2), 0 4px 8px -2px rgba(0, 0, 0, 0.2)'
};

const JobCardDiv = styled.div`
  height: 50%;
  width: 20%;
  min-width: 250px;
  //display: flex;
  //margin-top: 20%;

  padding-bottom: 2%;
  border-radius: 10px; /* Adjust the value as needed for desired roundness */
  justify-content: center;
  align-items: center;
  background-color: lightgray;
  color: black;

  box-shadow:
          -4px 0 8px -2px rgba(0, 0, 0, 0.2), /* Left shadow */
          4px 0 8px -2px rgba(0, 0, 0, 0.2),  /* Right shadow */
          0 4px 8px -2px rgba(0, 0, 0, 0.2);  /* Bottom shadow */

  .slick-prev,
  .slick-next {
    top: 10%; // Vertically center the arrows within the container
    transform: translateY(-30%);
    z-index: 1; // Ensure the arrows are above the carousel content
  }

  .slick-prev {
    left: 10px; // Adjust the distance from the left edge
  }

  .slick-next {
    right: 10px; // Adjust the distance from the right edge
  }
  

  @media ${deviceHome.mobile} {
    position: relative; // Keeps the element in the normal document flow
    width: 100%; // Sets the width to 80% of the parent element
    height: 50%;

    margin-top: 1%;
    padding-bottom: 0%;




    //background-color: rgba(150,116,169,0.86); // Optional background color change for mobile


  }

`;


const Footer = styled.div`
  height: 20vh;
  //background-color: red;
`;

const VerticalLine = styled.div`
  position: fixed; // or absolute, depending on your layout
  left: 50%;
  height: 100vh;
  width: 10px; // or as thick as you want
  background-color: #000; // or any color of your choice
  z-index: 10; // adjust as needed
`;

const VerticalLine2 = styled.div`
  position: absolute; // Positioned relative to its nearest positioned ancestor
  left: 50%;
  top: 0; // Align to the top of the container
  height: 100%; // Full height of the container
  width: 2px; // or as thick as you want
  background-color: #000; // or any color of your choice
  z-index: 10; // adjust as needed
`;


export const CustomFieldForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  width: 100%;
  
  
  input {
    display: flex;
    //width: 20vw;
    height: 40px;
    //max-width: 200px;
    //min-width: 150px;
    //background-color: lightsalmon;
  }

  label {
    display: flex;
    margin-left: 5px;
    //background-color: orangered;
  }

  @media ${deviceHome.mobile} {
    // Adjust styles for mobile view

    // Example: Adjust input width and padding for mobile devices
    input {
      width: 100%; // Increase width for better visibility on mobile
      height: 50px; // Increase height for better touch interaction

      padding: 5px; // Add some padding for better appearance

      //background-color: chartreuse;
      padding-right: 10px;
    }

    // Example: Adjust label styling for mobile devices
    label {
      margin-left: 2px; // Reduce margin

      //font-size: 33px; // Adjust font size for readability
    }
  }

`;



const FieldContainerDiv = styled.div`
  width: 60%;
  padding-top: 3%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  //box-shadow:
  //        -4px 0 8px -2px rgba(0, 0, 0, 0.2), /* Left shadow */
  //        4px 0 8px -2px rgba(0, 0, 0, 0.2),  /* Right shadow */
  //        0 4px 8px -2px rgba(0, 0, 0, 0.2);  /* Bottom shadow */

  @media ${deviceHome.mobile} { // Apply for mobile screens
    width: 80%;

  }
`;





const BaseStyledTextField = styled(TextField)`
  & .MuiFilledInput-input {
    height: 20px;

  
    
  }
  & .MuiInputBase-input { // Target the input base for styling
    //font-family: 'Helvetica Neue', Arial, sans-serif;
    //font-size: 1.2rem;


    font-size: ${fonts.InputFontREM};


    font-family: ${fonts.InputFontFamily};
    
    
   

    
  }

  & .MuiInputBase-input::placeholder { // Target the placeholder with increased specificity
    //font-family: 'Roboto', sans-serif;
    //font-size: 1.3rem;

    font-size: ${fonts.InputFontREM};


    font-family: ${fonts.FontFamilyItalics};



  }
`;

const StyledTextField: React.FC<TextFieldProps> = (props) => {
    // Ensure the label is a string, default to an empty string if not
    const placeholder = typeof props.label === 'string' ? props.label : '';

    return (
        <BaseStyledTextField
            variant="outlined"
            type="text"
            size="small"

            style={{ width: '100%', marginBottom: '5%', backgroundColor: 'white' ,
            }}
            {...props}
        />
    );
};


const ButtonDiv = styled.div`
  justify-content: center;
  align-items: center;


  @media ${deviceHome.mobile} {
    //background-color: rgba(150,116,169,0.86);
    width: 36vw;
    display: flex;

    .button {
      //background-color: red;
    }
  }
`;


const SubmitButton = styled(Button)`
//color: green;
  height: 9vh;
  width: 23vw;
  display: flex;
  padding-bottom: 70px;
  //margin-bottom: 50px;
  //background-color: yellow;
  @media ${deviceHome.mobile} {
    //background-color: red;
    width: 30vw;
    height: 7vh;
  }


`;
