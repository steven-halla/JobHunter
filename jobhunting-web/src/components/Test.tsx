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

