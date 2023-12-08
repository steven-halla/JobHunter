import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faCalendar,
    faCalendarPlus,
    faCaretDown,
    faCaretUp,
    faEdit,
    faGlobe,
    faUser
} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import {divide} from "lodash";


export const Icons = () => {

    return(
        <div>
            <FontAwesomeIcon
                icon={faCalendar}
                style={{  color: "black" }} // Added marginRight here
                size="lg" // Example size - adjust as needed
            />



            <FontAwesomeIcon
                icon={faEdit}
                style={{  color: "black" }} // Added marginRight here
                size="lg" // Example size - adjust as needed
            />

            <FontAwesomeIcon icon={faUser} />

            <FontAwesomeIcon icon={faCalendarPlus} />

            <FontAwesomeIcon icon={ faCaretDown}  />
            <FontAwesomeIcon icon={faCaretUp} />
            <FontAwesomeIcon icon={faGlobe} />

        </div>
    );
};