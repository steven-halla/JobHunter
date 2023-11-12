import React, {useState, ChangeEvent, FormEvent, useContext, useEffect} from "react";
import { User } from "../models/User";
import AuthService from "../services/auth.service";
import { UserContext } from "../services/usercontext";
import styled from 'styled-components';
import "react-datepicker/dist/react-datepicker.css";
import UserService from "../services/user.service";
import {device} from "../common/ScreenSizes";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faGithub, faLinkedin} from '@fortawesome/free-brands-svg-icons';
import { faBriefcase } from '@fortawesome/free-solid-svg-icons';
import Button from '@mui/material/Button';
import {InputLabel, TextFieldProps} from '@mui/material';
import TextField from '@mui/material/TextField';
import {useParams} from "react-router-dom";

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

    const [searchResult, setSearchResult] = useState<string | null>(null);
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
            interface Company {
                companyname: string;

                // ... include other properties if needed
            }

            const companies: Company[] = await response.json();
            console.log("API Response: ", companies); // Debugging - to understand the structure of the response

            // Logging the typed company name
            console.log("Typed Company Name: ", companyName);

            // Check if any company name exactly matches the typed companyName
            const isMatched = companies.some((c: Company) => c.companyname === companyName);

            // Logging the result of the search
            if (isMatched) {
                console.log("Matching company found: ", companyName);
                setSearchResult(companyName);
            } else {
                console.log("No matching company found");
                setSearchResult(null);
            }
        } catch (error) {
            console.error("Error during search: ", error);
        }
    };









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


    //need to get rid of labels
    //have it like face book where we put text in the input, and as we type, the place holder
    //goes away
    return (
        <HomeWrapperDiv>

            <CustomFieldsDiv>
                <FieldRowDiv>
                    <FontAwesomeIcon
                        icon={faGithub}
                        size="2x"
                        onClick={() => copyToClipboard(selectedOption1)}
                        style={{ cursor: 'pointer' }}
                    />
                </FieldRowDiv>
                <FieldRowDiv>
                    <FontAwesomeIcon
                        icon={faLinkedin}
                        size="2x"
                        onClick={() => copyToClipboard(selectedOption2)}
                        style={{ cursor: 'pointer' }}
                    />
                </FieldRowDiv>
                <FieldRowDiv>
                    <FontAwesomeIcon
                        icon={faBriefcase}
                        size="2x"
                        onClick={() => copyToClipboard(selectedOption3)}
                        style={{ cursor: 'pointer' }}
                    />
                </FieldRowDiv>
            </CustomFieldsDiv>
            <RoundColorWrapperDiv>

            <CustomFieldForm onSubmit={handleJobSubmit}>



                    <FieldContainerDiv>
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
                    <SubmitButton  sx={{
                        borderRadius: 10
                    }} variant="contained" type="submit">Submit</SubmitButton>
                </ButtonDiv>

            </CustomFieldForm>

            </RoundColorWrapperDiv>



            <JobCardDiv>
                {searchResult && (
                    <div>
                        <h3>Match Found:</h3>
                        <p>your result: {searchResult}</p>
                    </div>
                )}
            </JobCardDiv>

            <FooterDiv/>
        </HomeWrapperDiv>
    );
};

const JobCardDiv = styled.div`
    height: 50%;
    width: 20%;
  position: absolute;
  margin-left: 75%;
  margin-top: 15%;
`;

const ButtonDiv = styled.div`
  justify-content: center;
  align-items: center;
  margin-top: 7%;
  
  @media ${device.laptop} {
    margin-top: 3%;
  }
`;

const StyledInputLabel = styled(InputLabel)`
  width: 100%;
  height: 30px;
  transform: translateX(-1.5%); 

  @media ${device.mobile} {
    display: flex;
    transform: translateX(2%); 
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
  padding-bottom: 40px;
`;

export const HomeWrapperDiv = styled.div`
  position: relative; // Needed for absolute positioning of the pseudo-element
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  //&::before {
  //  content: '';
  //  position: absolute;
  //  left: 50%;
  //  top: 0;
  //  bottom: 0;
  //  width: 1px; // Width of the vertical line
  //  background-color: #000; // Color of the line
  //  z-index: 1; // Ensure it doesn't overlap content
  //}
`;


export const CustomFieldsDiv = styled.div`
  display: flex;
  margin-top: 20px;
  padding-left: 1.2%;
  @media ${device.mobile} {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 15px;
  }

  @media ${device.laptop} {
    display: flex;
    flex-direction: row;
    gap: 15px;
    width: 100%;
    align-items: center;
    justify-content: center;
  }
`;

export const FieldRowDiv = styled.div`
  display: flex;
  padding-left: 20px;
  padding-right: 30px;

  @media ${device.mobile} {
    display: flex;
    padding-left: 10px;
    padding-right: 20px;
  }
`;

export const CustomFieldForm = styled.form`
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  width: 100vw;
  background-color: red;
  
  @media ${device.laptop} {
    display: flex;
    margin-bottom: 5%;
    background-color: red;


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

  /* Other styles as needed */
`;



const FieldContainerDiv = styled.div`
  @media ${device.laptop} {
    width: 60%; 
    display: flex;
    flex-direction: column;
    align-items: flex-start; 
  }

  @media ${device.mobile} {
    width: 80%;
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
