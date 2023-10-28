import React from 'react';
import { TextField, Button } from '@mui/material';
import Box from '@mui/material/Box';


export const Test = () => {
    return (
        <Box
            sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
        }}
        >


                <TextField
                    id="description"
                    label="Company name"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />

            <TextField
                id="description"
                label="Description"
                variant="outlined"
                fullWidth
                margin="normal"
            />

            <TextField
                id="jobposter"
                label="Job Poster"
                variant="outlined"
                defaultValue="vvvvv "
                fullWidth
                margin="normal"
            />

            <TextField
                id="primarycontact"
                label="Primary Contact"
                variant="outlined"
                fullWidth
                margin="normal"
            />

            <TextField
                id="companywebsitelink"
                label="Company Website Link"
                variant="outlined"
                fullWidth
                margin="normal"
            />

            <TextField
                id="joblink"
                label="Job Link"
                variant="outlined"
                fullWidth
                margin="normal"
            />

            <TextField
                id="meetingLink"
                label="Meeting Link"
                variant="outlined"
                fullWidth
                margin="normal"
            />

            <TextField
                id="interviewnotes"
                label="Interview Notes"
                variant="outlined"
                fullWidth
                margin="normal"
            />

            <TextField
                id="customfield"
                label="Custom Field"
                variant="outlined"
                fullWidth
                margin="normal"
            />

            <TextField
                id="interviewernames"
                label="Interviewer Names"
                variant="outlined"
                fullWidth
                margin="normal"
            />

            <TextField
                id="dateapplied"
                label="Date Applied"
                variant="outlined"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                margin="normal"
            />

            <TextField
                id="interviewdate"
                label="Interview Date"
                variant="outlined"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
                margin="normal"
            />

            <TextField
                id="companyresponded"
                label="Company Responded"
                variant="outlined"
                fullWidth
                margin="normal"
            />

            <TextField
                id="companyrejected"
                label="Company Rejected"
                variant="outlined"
                fullWidth
                margin="normal"
            />

            <Button
                variant="contained"
                color="primary"
                style={{ marginTop: '20px' }}
            >
                Submit
            </Button>
        </Box>
    );
};

