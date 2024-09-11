import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const useSignup = () => {
    const {setAuthUser} = useAuthContext();
    const navigate = useNavigate()
    const signup = async({email, firstName, lastName, userName, password, gender}) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_LOCALHOST}/api/auth/signup`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, firstName, lastName, userName, password, gender})
            });
            const data = await res.json();
            if (data.error){
                throw new Error(data.error);
            }
            console.log(JSON.stringify(data));
            console.log('hoise');
            
            // localStorage
            localStorage.setItem("user-details", JSON.stringify(data))
            // context
            setAuthUser(data)
            navigate("/welcome")

        } catch (error) {
            console.log("Error in Signup hook", error);
            
        }
        
    }

    return {signup}
}

export default useSignup