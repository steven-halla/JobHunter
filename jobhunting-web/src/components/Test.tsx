import React, {useState} from 'react';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Slider} from "@mui/material";



export const Test = () => {
    const [sliderPosition, setSliderPosition] = useState(0); // 0 as the starting middle position
    const getSliderColor = () => {
        switch (sliderPosition) {
            case -1: return 'green'; // Accepted
            case 1: return 'red'; // Declined
            default: return 'grey'; // No Response
        }
    };

    return (
        <div>
            <Slider
                aria-label="Temperature"
                defaultValue={3}
                valueLabelDisplay="auto"
                step={1}
                marks
                min={1}
                max={3}
                style={{ width: '10%' }} // Adjust the width as needed
            />

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Accepted</span>
                <span>No Response</span>
                <span>Declined</span>
            </div>


            <p>Hi I'm the place</p>
            <FontAwesomeIcon
                icon={faTrash}
                size="2x"
                style={{ cursor: 'pointer', marginRight: '10px' }} // marginRight for some spacing
            />

            <FontAwesomeIcon
                icon={faEdit}
                size="2x"
                style={{ cursor: 'pointer' }}
            />

        </div>
    )
};
