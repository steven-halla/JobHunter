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
import {InputLabel, TextFieldProps} from '@mui/material';
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
                            interviewdate, companyresponded, companyrejected}),
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




    //need to get rid of labels
    //have it like face book where we put text in the input, and as we type, the place holder
    //goes away
    return (
        <Box
            sx={{
                position: "relative",
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
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
                    marginBottom: "5%"
                    // Add other CSS styles as needed
                }}
            >
                <Box
                    display="flex"
                    paddingLeft="20px"
                    paddingRight="30px"
                    marginBottom="4%"

                    style={{ backgroundColor: "red" }}
                >
                    <FontAwesomeIcon
                        icon={faGithub}
                        size="2x"
                        onClick={() => copyToClipboard(selectedOption1)}
                        style={{ cursor: 'pointer' }}
                    />
                </Box>
                <Box
                    display="flex"
                    paddingLeft="20px"
                    paddingRight="30px"
                    marginBottom="4%"

                    style={{ backgroundColor: "red" }}
                >
                    <FontAwesomeIcon
                        icon={faLinkedin}
                        size="2x"
                        onClick={() => copyToClipboard(selectedOption2)}
                        style={{ cursor: 'pointer' }}
                    />
                </Box>
                <Box
                    display="flex"
                    paddingLeft="20px"
                    paddingRight="30px"
                    style={{ backgroundColor: "red" }}
                    marginBottom="4%"
                >
                    <FontAwesomeIcon
                        icon={faBriefcase}
                        size="2x"
                        onClick={() => copyToClipboard(selectedOption3)}
                        style={{ cursor: 'pointer' }}
                    />
                </Box>
            </Box>




            <Box
                sx={{
                    backgroundColor: "#c7f3ff",

                    marginTop: "3%", // Adjust this margin-bottom value to control the gap

                    width: "40vw",
                    height: "70vh",
                    minHeight: "500px",
                    maxHeight: "550px",
                    borderRadius: "4%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "auto",
                    marginBottom: "7%",
                    paddingTop: "3%",
                    boxShadow: "0px 4px 8px -2px rgba(0, 0, 0, 0.2)", // Horizontal shadow, Vertical shadow, Blur radius, Spread radius, Color

                    "& > *:not(.MuiTextField-root)": {
                        backgroundColor: "#c7f3ff",
                        width: "50vw",
                    },
                    // Add other CSS styles as needed
                }}
            >
            <CustomFieldForm onSubmit={handleJobSubmit}>



                <Box
                    width="60%"
                    display="flex"
                    flexDirection="column"
                    alignItems="flex-start"
                    paddingTop="5%"
                >

                    <StyledTextField         label="company name"
                                             value={companyname} onChange={handleCompanyNameChange} />
                </Box>



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
                    <SubmitButton  sx={{
                        borderRadius: 10,

                    }} variant="contained" type="submit">Submit</SubmitButton>
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





            <FooterDiv/>
        </Box>
    );
};

const jobCardStyle = {
    backgroundColor: 'grey',
    boxShadow: '-4px 0 8px -2px rgba(0, 0, 0, 0.2), 4px 0 8px -2px rgba(0, 0, 0, 0.2), 0 4px 8px -2px rgba(0, 0, 0, 0.2)'
};


const JobCardDiv = styled.div`
  height: 50%;
  width: 20%;
  display: flex;
  position: absolute;
  margin-left: 75%;
  margin-top: 15%;
  border-radius: 10px; /* Adjust the value as needed for desired roundness */
  justify-content: center;
  align-items: center;

  @media ${deviceHome.mobile} {
    //background-color: rgba(150,116,169,0.86);

  }





`;


const ButtonDiv = styled.div`
  justify-content: center;
  align-items: center;
  margin-top: 10%;
  margin-bottom: 5%;
  
  @media ${deviceHome.laptop} {
    margin-top: 3%;
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
  width: 17vw;
  display: flex;
  padding-bottom: 70px;
  margin-bottom: 50px;
  background-color: yellow;
  
  @media ${deviceHome.mobile} {
    //background-color: rgba(50,86,169,0.86);

  }


`;

export const HomeWrapperDiv = styled.div`
  position: relative; // Needed for absolute positioning of the pseudo-element
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  


  @media ${deviceHome.mobile} {
    //background-color: rgba(48,169,52,0.86);

  }

`;


export const CustomFieldsDiv = styled.div`
  display: flex;
  margin-top: 20px;
  padding-left: 1.2%;
  flex-direction: row;
  gap: 15px;
  width: 100%;
  align-items: center;
  justify-content: center;
  
 
`;

export const FieldRowDiv = styled.div`
  display: flex;
  padding-left: 20px;
  padding-right: 30px;

  @media ${deviceHome.mobile} {
   //background-color: lightskyblue;
    
  }
`;

export const CustomFieldForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  width: 100vw;
  background-color: red;
  
  @media ${deviceHome.laptop} {
    display: flex;
    margin-bottom: 5%;
    //background-color: red;


    input {
      display: flex;
      width: 20vw;
      height: 40px;
      max-width: 150px;
    }
    
    label {
      display: flex;
      margin-left: 5px;
    }
  }

 
`;

const RoundColorWrapperDiv = styled.div`
  background-color: #c7f3ff;
  width: 40vw;  /* Example size */
  height: 70%;
  border-radius: 5%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
  margin-bottom: 7%;
  padding-top: 3%;

  /* Adding box shadow on left, right, and bottom sides */
  box-shadow: 
    -4px 0 8px -2px rgba(0, 0, 0, 0.2), /* Left shadow */
    4px 0 8px -2px rgba(0, 0, 0, 0.2),  /* Right shadow */
    0 4px 8px -2px rgba(0, 0, 0, 0.2);  /* Bottom shadow */

  /* Style for all children except MUI TextFields */
  > *:not(.MuiTextField-root) {
    background-color: #c7f3ff;
    width: 50vw;
  }

  @media ${deviceHome.mobile} {
    //background-color: purple;
  }

  /* Other styles as needed */
`;



const FieldContainerDiv = styled.div`
  @media ${deviceHome.laptop} {
    width: 60%; 
    display: flex;
    flex-direction: column;
    align-items: flex-start; 
  }

  @media ${deviceHome.mobile} {
   //background-color: red;
  }

`;

export const FooterDiv =  styled.div`
  
  @media ${device.mobile} {
    width: 100vw;
    height: 120px;
  }
`

const VerticalLine = styled.div`
  position: fixed; // or absolute, depending on your layout
  left: 50%;
  height: 100vh;
  width: 1px; // or as thick as you want
  background-color: #000; // or any color of your choice
  z-index: 10; // adjust as needed
`;
