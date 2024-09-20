import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import axios from "axios";

const useSignup = () => {
    const {setAuthUser} = useAuthContext();
    const navigate = useNavigate()
    const signup = async({email, firstName, lastName, userName, password, gender, role}) => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_LOCALHOST}/api/auth/signup`, {
                email, 
                firstName, 
                lastName, 
                userName, 
                password, 
                gender, 
                role
            }, {
                headers: {"Content-Type": "application/json"}
            })
            const data = await res.data;
            if (data.error){                            
                throw new Error(data.error);
            }
            
            // localStorage
            localStorage.setItem("user-details", JSON.stringify(data))
            // context
            setAuthUser(data)
            navigate("/welcome")

            return data

        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    throw new Error(error.response.data.error);
                } else if (error.response.status === 500) {
                    console.log("Error: Internal Server Error");
                    throw new Error("Internal Server Error");
                } else {
                    console.log("Error: ", error.response.data.error);
                    throw new Error(error.response.data.error); // Re-throw any other error
                }
            } 
            else {
                console.log("Network or other error", error);
                throw new Error("Something went wrong");
            }            
        }
        
    }

    return {signup}
}

export default useSignup