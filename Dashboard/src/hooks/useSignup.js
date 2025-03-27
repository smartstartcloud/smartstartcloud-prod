import { useAuthContext } from "../context/AuthContext";
import useApi from "./useApi";

const useSignup = ( ) => {
    const {setAuthUser} = useAuthContext();
    const api = useApi()
    // const navigate = useNavigate()
    const signup = async( {email, firstName, lastName, userName, password, gender, role} ) => {
        try {
            const res = await api.post(`/api/auth/signup`, {
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

            // localStorage.setItem("user-details", JSON.stringify(data))
            // setAuthUser(data)
            // navigate("/welcome")

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

    const updateUser = async (userData) => {
      const { userID, ...rest } = userData;
      const res = await api.put(`/api/auth/user/update/${userID}`, rest);      
      return res.data;
    };

    return { signup, updateUser };
}

export default useSignup