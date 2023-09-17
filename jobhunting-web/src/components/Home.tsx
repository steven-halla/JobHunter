import React, {useState, ChangeEvent, FormEvent, useContext, useEffect} from "react";
import { User } from "../models/User";
import AuthService from "../services/auth.service";
import { UserContext } from "../services/usercontext";
import DatePicker from "react-datepicker";
import styled from 'styled-components';
import { Link } from 'react-router-dom';


import "react-datepicker/dist/react-datepicker.css";
import UserService from "../services/user.service";
import {device} from "../common/ScreenSizes";
import {JobsContext} from "../services/jobcontext";




export const Home: React.FC = () => {

    const [companyname, setCompanyName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [jobposter, setJobPoster] = useState<string>("");
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

    const [selectedOption1, setSelectedOption1] = useState(localStorage.getItem('selectedOption1') || 'default');
    const [selectedOption2, setSelectedOption2] = useState(localStorage.getItem('selectedOption2') || 'default');
    const [selectedOption3, setSelectedOption3] = useState(localStorage.getItem('selectedOption3') || 'default');

    const currentUser: User | null = AuthService.getCurrentUser();
    const { user } = useContext(UserContext);


    const [id, setId] = useState(null); // or some initial value

    const [count, setCount] = useState<number>(() => {
        const storedCount = localStorage.getItem('count');
        const storedDate = localStorage.getItem('date');
        const today = new Date().toISOString().split('T')[0]; // get today's date in YYYY-MM-DD format
        if (storedDate === today && storedCount !== null) {
            // if the stored date is today, return the stored count
            return parseInt(storedCount);
        } else {
            // if the stored date is not today or doesn't exist, return 0
            return 0;
        }
    });

// Effect to update local storage whenever count changes
    useEffect(() => {
        localStorage.setItem('count', count.toString());
        localStorage.setItem('date', new Date().toISOString().split('T')[0]); // store today's date in YYYY-MM-DD format
    }, [count]);


    useEffect(() => {
        localStorage.setItem('selectedOption1', selectedOption1);
        localStorage.setItem('selectedOption2', selectedOption2);
        localStorage.setItem('selectedOption3', selectedOption3);
    }, [selectedOption1, selectedOption2, selectedOption3]);


    console.log('currentUser:', currentUser);
    console.log('UserContext user:', user);


    useEffect(() => {
        if(id) {
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
                    // Perform further actions if needed
                    setCount(count + 1);
                    alert("Adding +1 to the counter.")


                } else {
                    console.log("Failed to create job");
                    // Handle the error case if needed
                }
            } else {
                console.log("Current user is null or undefined");
                // Handle the case when the current user is null or undefined
            }
        } catch (error) {
            console.log("Error occurred:", error);
            // Handle the error case if needed
        }
    };

    const handleCompanyNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCompanyName(e.target.value);
    };

    const handleDescriptionChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDescription(e.target.value);
    };

    const handleJobPosterChange = (e: ChangeEvent<HTMLInputElement>) => {
        setJobPoster(e.target.value);
    }

    const handlePrimaryContact = (e: ChangeEvent<HTMLInputElement>) => {
        setPrimaryContact(e.target.value);
    }

    const handleCompanyWebSiteLink = (e: ChangeEvent<HTMLInputElement>) => {
        setCompanyWebSiteLink(e.target.value);
    }

    const handleJobLink = (e: ChangeEvent<HTMLInputElement>) => {
        setJobLink(e.target.value);
    }

    const handleInterviewNotes = (e: ChangeEvent<HTMLInputElement>) => {
        setInterviewNotes(e.target.value);
    }

    const handleCustomField = (e: ChangeEvent<HTMLInputElement>) => {
        setCustomField(e.target.value);
    }

    const handleInterviewerNames = (e: ChangeEvent<HTMLInputElement>) => {
        setInterviewerNames(e.target.value);
    }

    const handleDateApplied = (date: Date) => {
        setDateApplied(date);
    };

    const handleInterviewDate = (date: Date) => {
        setInterviewDate(date);
    };

    const handleCompanyResponded = (e: ChangeEvent<HTMLInputElement>) => {
        setCompanyResponded(e.target.checked);
    };

    const handleCompanyRejected = (e: ChangeEvent<HTMLInputElement>) => {
        setCompanyRejected(e.target.checked);
    };

    // Define TypeScript interface for props
    interface CopyButtonProps {
        selectedOption: string;
    }

    const CopyButton: React.FC<CopyButtonProps> = ({ selectedOption }) => {
        const [copySuccess, setCopySuccess] = useState<string>('');

        const textToCopy = () => {
            switch(selectedOption) {
                case 'linkedin':
                    return user?.customfield1 || '';  // Provide default empty string if undefined
                case 'portfolio':
                    return user?.customfield2 || '';
                case 'url':
                default:
                    return user?.customfield3 || '';
            }
        }

        const copyToClipboard = async () => {
            try {
                await navigator.clipboard.writeText(textToCopy());
                setCopySuccess('Copied!');
                // set a timer to reset copySuccess after 3 seconds
                setTimeout(() => setCopySuccess(''), 3000);
            } catch (err) {
                setCopySuccess('Failed to copy text');
            }
        };


        return (
            <>
                <p style={{ cursor: 'pointer', color: '#0000FF' , marginTop: "5px"}} onClick={copyToClipboard}>
                    {copySuccess ? copySuccess : 'Copy URL'}
                </p>
            </>
        );
}

        // Correct way to use the component
    // <CopyButton selectedOption={selectedOption1} />
//this has a lot of repeat code maybe I can do a for loop and iterate through
    // it 3 times.

    return (
        <HomeWrapperDiv>
            <CustomFieldsDiv>
                <FieldRow>
                    <URLSelect value={selectedOption1} onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedOption1(e.target.value)}>
                        <option value="url">URL</option>
                        <option value="linkedin">LinkedIn URL</option>
                        <option value="portfolio">Portfolio URL</option>
                        <option value="default">Default</option>
                        <option value="github">Github</option>
                    </URLSelect>
                    <CopyButton selectedOption={selectedOption1} />
                </FieldRow>

                <FieldRow>
                    <URLSelect value={selectedOption2} onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedOption2(e.target.value)}>
                        <option value="url">URL</option>
                        <option value="linkedin">LinkedIn URL</option>
                        <option value="portfolio">Portfolio URL</option>
                        <option value="default">Default</option>
                        <option value="github">GitHub</option>
                    </URLSelect>
                    <CopyButton selectedOption={selectedOption2} />
                </FieldRow>

                <FieldRow>
                    <URLSelect value={selectedOption3} onChange={(e: ChangeEvent<HTMLSelectElement>) => setSelectedOption3(e.target.value)}>
                        <option value="url">URL</option>
                        <option value="linkedin">LinkedIn URL</option>
                        <option value="portfolio">Portfolio URL</option>
                        <option value="default">Default</option>
                        <option value="github">Github</option>
                    </URLSelect>
                    <CopyButton selectedOption={selectedOption3} />
                </FieldRow>
            </CustomFieldsDiv>



            <CustomFieldForm onSubmit={handleJobSubmit}>

                <FieldContainer>
                    <Label>Company</Label>
                    <Input type="text" value={companyname} onChange={handleCompanyNameChange} />

                </FieldContainer>

                <FieldContainer>
                    <Label>Description</Label>
                    <Input type="text" value={description} onChange={handleDescriptionChange} />

                </FieldContainer>

                <FieldContainer>
                    <Label>Job Poster</Label>
                    <Input type="text" value={jobposter} onChange={handleJobPosterChange} />
                </FieldContainer>

                <FieldContainer>
                    <Label>Primary Contact</Label>
                    <Input type="text" value={primarycontact} onChange={handlePrimaryContact} />
                </FieldContainer>
                <FieldContainer>
                    <Label>Website Link</Label>
                    <Input type="text" value={companywebsitelink} onChange={handleCompanyWebSiteLink} />
                </FieldContainer>

                <FieldContainer>
                    <Label>Job Link</Label>
                    <Input type="text" value={joblink} onChange={handleJobLink} />
                </FieldContainer>

                <FieldContainer>
                    <Label>Custom Notes</Label>
                    <Input type="text" value={customfield} onChange={handleCustomField} />
                </FieldContainer>


                <SubmitButton type="submit">Create Job</SubmitButton>

                {/*<Link to="/companynoresponse">Go to Company No Response Page</Link>*/}

            </CustomFieldForm>


            <FooterDiv/>

        </HomeWrapperDiv>


    );

};


const Label = styled.label`
  width: 100%;
  height: 30px;
`;

const Input = styled.input`
  width: 100%;
  height: 30px;
`;

const SubmitButton = styled.button`

  height: 30px;
  justify-content: center;
  align-content: center;
`;






export const HomeWrapperDiv = styled.div`
  // These are the styles that will apply by default (mobile first approach)
  display: flex;
  //background-color: black;




  // These styles will only apply for screens with 380px width and 800px height or less
  @media ${device.mobile} {
    display: flex;
    //background-color: #ffd0f6 ;
    width: 100vw;
    height: 100vh;
    flex-direction: column;  // Add this line
    justify-content: space-between; // distributes space evenly between items


    // Add more styles specific to this resolution here...
  }

  @media ${device.laptop} {
    display: flex;
    width: 100vw;
    height: 100vh;
    flex-direction: column;
    justify-content: space-between;
    
    p {
      text-align: center;
      color: red;
      //padding-right: 5vw;
    }
    
  }


  // You can add more media queries for larger screen sizes (if needed)
  //...
`;

export const CustomFieldsDiv = styled.div`
  display: flex;


  @media ${device.mobile} {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 15px;
    background-color: aquamarine;
   


    /* Add more styles specific to this resolution here... */
  }

  @media ${device.laptop} {
    display: flex;
    flex-direction: column;
    //justify-content: space-between;
    gap: 15px;
    background-color: #ffedc8;
    width: 100%;
    //margin-left: 40vw;
    align-items: center;
    justify-content: center;
    
    button {
      margin-top: 10vh;
    }


    /* Add more styles specific to this resolution here... */
  }
`;

export const FieldRow = styled.div`
  display: flex;
`;

export const CustomFieldForm = styled.form`
  display: flex;

  @media ${device.mobile} {
    display: flex;
    background-color: yellow;
    //height: 80vh;
    width: 100vw;
    flex-direction: column;
    justify-items: center;

    button {
      display: flex;
      margin-top: 30px;
      width: 20vw;
      //align-content: center;
      //justify-content: center;
      margin-left: 40vw;
    }
  }

 

  @media ${device.laptop} {
    display: flex;
    height: 30vh;
    align-items: flex-end; // Add this line

    background-color: red;
    flex-wrap: wrap;
    margin-bottom: 35vh;
padding-left: 4vw;   


    input {
      display: flex;
      width: 20vw;
      height: 40px;
      //margin-left: 5px;
      max-width: 150px;
    }
    
    label {
      display: flex;
      margin-left: 5px;
    }
    
    button {
      height: 40px;
      width: 21vw;
      max-width: 155px;

    }
  }
`;



const FieldContainer = styled.div`
  @media ${device.laptop} {
    width: 25%; // This will create a 4 column layout on laptop screens
    display: flex;
    flex-direction: column;
  }
`;


export const URLSelect = styled.select`

  // Add other styles as needed...

  @media ${device.mobile} {
    display: flex;
    width: 33vw; // adjust as needed
    height: 35px; // adjust as needed
    background-color: purple;
    flex-direction: row;
    justify-items: center;
    margin-right: 14px;


    /* Add more styles specific to this resolution here... */
  }

  @media ${device.laptop} {
    display: flex;
    width: 25vw;
    height: 35px;
    background-color: purple;
    flex-direction: row;
    justify-items: center;
    margin-right: 14px;
    max-width: 140px;
  }
`;

export const FooterDiv =  styled.div`
  display: flex;
  
  //bottom: 0; // Add this
  //position: fixed; // Add this

  @media ${device.mobile} {
    display: flex;
    background-color: #95c2ff;
    width: 100vw;
    height: 120px;



    /* Add more styles specific to this resolution here... */
  }

`



export const JobCounterDiv = styled.div`
  display: flex;


  @media ${device.mobile} {
    display: flex;

   


    /* Add more styles specific to this resolution here... */
  }

  @media ${device.laptop} {
    display: flex;
    margin-right: 5vw;
    //align-text: center;
    justify-content: center;
    align-content: center;

    /* Add more styles specific to this resolution here... */
  }
`;