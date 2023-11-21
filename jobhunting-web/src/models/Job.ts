export interface Interview {
    secured: boolean;
    interviewtime: string;
    meetingLink: string;
    interviewnotes: string;
    interviewernames: string;
    interviewdate: Date | null;
    interviewbegintime: Date ;
    interviewendtime: Date;
}



export interface Job {
    interviewdate: ((prevState: (Date | null)) => (Date | null)) | Date | null;
    interviewernames: ((prevState: string) => string) | string;
    interviewnotes: ((prevState: string) => string) | string;
    // meetingLink: ((prevState: string) => string) | string;
    meetingLink:  string;
    id: number;
    userid: number;
    companyname: string;
    description: string;
    jobposter: string;
    primarycontact: string;
    companywebsitelink: string; // Change to camelCase
    joblink: string;
    customfield: string;
    dateapplied: Date;
    companyresponded: boolean;
    companyrejected: boolean;
    jobsoftdelete: boolean;
    interviews: Interview[];
    interviewbegintime: Date;
    interviewendtime: Date;
}
