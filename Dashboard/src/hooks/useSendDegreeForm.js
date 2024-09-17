import axios from 'axios'
import React from 'react'

const useSendDegreeForm = () => {

    const sendDegreeForm = async({degreeID, degreeYear, degreeName, degreeAgent, degreeStudentList, degreeModules}) => {
        try {
            console.log(degreeID, degreeYear, degreeName, degreeAgent, degreeStudentList, degreeModules);
            const res = await axios.post(`${process.env.REACT_APP_LOCALHOST}/api/degree/new`, {
                degreeID,
                degreeYear, 
                degreeName, 
                degreeAgent, 
                degreeStudentList, 
                degreeModules
            }, {
                headers: {"Content-Type": "application/json"}
            })

            const data = await res.data;
            if (data.error) {
                throw new Error(data.error);
            }
            console.log(JSON.stringify(data));
            console.log('hoise');
            return true
        } catch (error) {
            console.log("Error in sendDegreeForm hook", error);
            return false
        }
    }

    return {sendDegreeForm};
}

export default useSendDegreeForm