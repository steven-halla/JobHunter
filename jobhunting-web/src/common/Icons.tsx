import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBriefcase,
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
import {faGithub, faLinkedin} from "@fortawesome/free-brands-svg-icons";


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


            <FontAwesomeIcon
                icon={faGithub}
                size="2x"
                style={{ marginTop: '10%' }}
            />
            <FontAwesomeIcon
                icon={faLinkedin}
                size="2x"
            />

            <FontAwesomeIcon
                icon={faBriefcase}
                size="2x"
                style={{  marginBottom: "10%" }}
            />
        </div>
    );
};