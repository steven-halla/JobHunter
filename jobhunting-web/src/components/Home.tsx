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
import {useParams} from "react-router-dom";
import {Job} from "../models/Job";
import {DateMutation} from "../common/DateMutation";
import Box from "@mui/material/Box";

export const Home: React.FC = () => {

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
    const [id] = useState(null); // or some initial value
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

    const [searchResult, setSearchResult] = useState<Job[] | null>(null);




    interface Job {
        companyname: string;
        primarycontact: string;
        joblink: string;
        dateapplied: Date;
        companyresponded: boolean;
        companyrejected: boolean;
        jobsoftdelete: boolean;
    }





    useEffect(() => {
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

    useEffect(() => {
        if(id) {
            console.log("am I being called?")

            UserService.getUserById(id) // ensure to pass an id here
                .then((user: User) => {
                    console.log(`User ${user.id}`);
                    console.log(` - Username: ${user.username}`);
                    console.log(` - Email: ${user.email}`);
                    console.log(` - CustomField1: ${user.customfield1}`);
                    console.log(` - CustomField2: ${user.customfield2}`);
                    console.log(` - CustomField3: ${user.customfield3}`);
                })
                .catch((error: any) => {
                    console.error("Error fetching user: ", error);
                });
        }
    }, [id]);

    const handleJobSubmit = async (e: FormEvent) => {
        console.log("I'm the handle submit button on the home page");
        e.preventDefault();
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
    };

    const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value);
    };

    const handlePrimaryContact = (e: ChangeEvent<HTMLInputElement>) => {
        setPrimaryContact(e.target.value);
    }

    const handleCompanyWebSiteLink = (e: ChangeEvent<HTMLInputElement>) => {
        setCompanyWebSiteLink(e.target.value);
    }

    const handleJobLink = (e: ChangeEvent<HTMLInputElement>) => {
        setJobLink(e.target.value);
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
                    'Authorization': `Bearer YOUR_AUTH_TOKEN`, // Replace with your actual token if needed
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Define the type for the company
            interface Job {
                companyname: string;
                primarycontact: string;
                joblink: string;
                dateapplied: Date;
                companyresponded: boolean;
                companyrejected: boolean;
                jobsoftdelete: boolean;
            }

            const companies: Job[] = await response.json();
            console.log("API Response: ", companies); // Debugging - to understand the structure of the response

            // Logging the typed company name
            console.log("Typed Company Name: ", companyName);

            // Check if any company name exactly matches the typed companyName
            const matchingJobs: Job[] = companies.filter((job: Job) => job.companyname === companyName);

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



    //need to get rid of labels
    //have it like face book where we put text in the input, and as we type, the place holder
    //goes away
    return (
        <Box
            sx={{
                position: "relative",
                width: "100%",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#3D4849",


                // Add other CSS styles as needed
            }}
        >

            <Box
                sx={{
                    display: "flex",
                    marginTop: "20px",
                    paddingLeft: "1.2%",
                    flexDirection: "row",
                    gap: "15px",
                    width: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "5%",
                    backgroundColor: "#3D4849",

                    // Add other CSS styles as needed


                    [theme.breakpoints.down('sm')]: {
                        // padding: '10px',
                        height: "5vh",

                    },
                }}
            >
                <Box
                    display="flex"
                    paddingLeft="20px"
                    paddingRight="30px"
                    marginBottom="-3%"

                >
                    <FontAwesomeIcon
                        icon={faGithub}
                        size="2x"
                        onClick={() => copyToClipboard(selectedOption1)}
                        style={{ cursor: 'pointer' ,color: 'lightblue' }}
                    />
                </Box>
                <Box
                    display="flex"
                    paddingLeft="20px"
                    paddingRight="30px"
                    marginBottom="-3%"

                >
                    <FontAwesomeIcon
                        icon={faLinkedin}
                        size="2x"
                        onClick={() => copyToClipboard(selectedOption2)}
                        style={{ cursor: 'pointer'  ,color: 'lightblue'}}
                    />
                </Box>

                <Box
                    display="flex"
                    paddingLeft="20px"
                    paddingRight="30px"
                    marginBottom="-3%"

                >
                    <FontAwesomeIcon
                        icon={faBriefcase}
                        size="2x"
                        onClick={() => copyToClipboard(selectedOption3)}
                        style={{ cursor: 'pointer'  ,color: 'lightblue'}}
                    />
                </Box>
            </Box>







            <Box
                sx={{

                    justifyContent: "space-evenly", // Evenly distribute space around items

                    // marginBottom: "30%",

                    // backgroundColor: "#c7f3ff",
                    background: "linear-gradient(#00C5C8, #70E7D1)",


                    // marginTop: "2%",
                    width: "40vw",
                    minWidth: "300px",
                    height: "70vh",
                    minHeight: "500px",
                    maxHeight: "550px",
                    borderRadius: "5%",
                    display: "flex",
                    alignItems: "center",
                    // justifyContent: "space-around",
                    margin: "auto",
                    marginBottom: "10%",
                    // flexDirection: "colum",

                    gap: "20px", // Adjust the value as needed
                    // marginBottom: "7%",
                    // paddingTop: "3%",
                    boxShadow: "0px 4px 8px -2px rgba(0, 0, 0, 0.2)", // Horizontal shadow, Vertical shadow, Blur radius, Spread radius, Color

                    "& > *:not(.MuiTextField-root)": {
                        // backgroundColor: "#c7f3ff",
                        background: "linear-gradient(#00C5C8, #70E7D1)",

                        width: "60vw",
                    },

                    [theme.breakpoints.down('sm')]: {
                        // padding: '10px',
                        height: "5vh",

                    },
                    // Add other CSS styles as needed
                }}
            >
                <CustomFieldForm onSubmit={handleJobSubmit}>



                    <FieldContainerDiv

                    >

                        <StyledTextField         label="company name"
                                                 value={companyname} onChange={handleCompanyNameChange} />
                    </FieldContainerDiv>



                    <FieldContainerDiv>
                        <StyledTextField  label="description" value={description} onChange={handleDescriptionChange} />
                    </FieldContainerDiv>


                    <FieldContainerDiv>
                        <StyledTextField   label="contact" value={primarycontact} onChange={handlePrimaryContact} />
                    </FieldContainerDiv>
                    <FieldContainerDiv>
                        <StyledTextField   label="website" value={companywebsitelink} onChange={handleCompanyWebSiteLink} />
                    </FieldContainerDiv>
                    <FieldContainerDiv>
                        <StyledTextField  label="job link" value={joblink} onChange={handleJobLink} />
                    </FieldContainerDiv>
                    <ButtonDiv>
                        <SubmitButton
                            sx={{
                                borderRadius: 10,
                                background: 'linear-gradient(to right, #00C9FF, #00B4D8)', // Neon blue gradient
                                color: 'white', // Text color
                                border: '1px solid #007BFF', // Adding a border for contrast
                                '&:hover': {
                                    background: 'linear-gradient(to left, #00C9FF, #00B4D8)', // Change gradient direction on hover for effect
                                    boxShadow: '0 0 10px #00C9FF', // Optional: Adding a glow effect on hover
                                },
                                textTransform: 'none', // Optional: Prevents uppercase text transformation common in MUI Buttons
                                fontWeight: 'bold', // Optional: Makes the text bold
                            }}
                            variant="contained"
                            type="submit"
                        >
                            Submit
                        </SubmitButton>


                    </ButtonDiv>

                </CustomFieldForm>

            </Box>



            <JobCardDiv style={Array.isArray(searchResult) && searchResult.length > 0 ? jobCardStyle : {}}>
                {Array.isArray(searchResult) && searchResult.length > 0 && (
                    <div>

                        <h3>Matches Found:</h3>
                        {searchResult.map((job: Job, index: number) => (
                            <div key={index}>
                                <p>Result {index + 1}:</p>
                                <p>Company Name: {job.companyname}</p>
                                <p>Primary Contact: {job.primarycontact}</p>
                                <p>Job Link: {job.joblink}</p>
                                {DateMutation(typeof job.dateapplied === 'string' ? job.dateapplied : job.dateapplied.toISOString())}
                                <p>Company Responded: {job.companyresponded ? 'Yes' : 'No'}</p>
                                <p>Company Rejected: {job.companyrejected ? 'Yes' : 'No'}</p>
                            </div>
                        ))}
                    </div>
                )}
            </JobCardDiv>





            {/*<FooterDiv/>*/}
        </Box>
    );
};

const jobCardStyle = {
    backgroundColor: 'grey',
    justifyContent: "center",
alignItems: "center",

    // marginTop: "1%",
    paddingTop: device.mobile ? '3%' : '0.1%', // 3% padding for mobile, 1% for others
    boxShadow: '-4px 0 8px -2px rgba(0, 0, 0, 0.2), 4px 0 8px -2px rgba(0, 0, 0, 0.2), 0 4px 8px -2px rgba(0, 0, 0, 0.2)'
};


const JobCardDiv = styled.div`
  height: 59%;
  width: 20%;
  min-width: 200px;
  display: flex;
  position: absolute;
  margin-left: 75%;
  margin-top: 15%;
  padding-bottom: 2%;
  border-radius: 10px; /* Adjust the value as needed for desired roundness */
  justify-content: center;
  align-items: center;
  

  @media ${deviceHome.mobile} {
    position: relative; // Keeps the element in the normal document flow
    width: 76%; // Sets the width to 80% of the parent element
    height: 50%;
    margin-left: auto; // Centers the element along the horizontal axis
    margin-right: auto; // Centers the element along the horizontal axis
    margin-top: 1em; // Adds space above the element
    height: auto; // Lets the height adjust based on content
    //background-color: rgba(150,116,169,0.86); // Optional background color change for mobile
    padding-top: 3%;
  }

`;


const ButtonDiv = styled.div`
  justify-content: center;
  align-items: center;


  @media ${deviceHome.mobile} {
    //background-color: rgba(150,116,169,0.86);
    width: 36vw;
    display: flex;

    .button {
      background-color: red;
    }
  }
`;





const BaseStyledTextField = styled(TextField)`
  & .MuiFilledInput-input {
    height: 20px;
  }
`;
const StyledTextField: React.FC<TextFieldProps> = (props) => (
    <BaseStyledTextField

        type="text"
        id="outlined-basic"
        size="small"
        style={{ width: '100%' ,  marginBottom: '5%' , backgroundColor: 'white'}}
        {...props}
    />
);

const SubmitButton = styled(Button)`
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




export const CustomFieldForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  width: 100vw;




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

      font-size: 14px; // Adjust font size for readability
    }
  }

`;


const FieldContainerDiv = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;



const VerticalLine = styled.div`
  position: fixed; // or absolute, depending on your layout
  left: 50%;
  height: 100vh;
  width: 1px; // or as thick as you want
  background-color: #000; // or any color of your choice
  z-index: 10; // adjust as needed
`;
