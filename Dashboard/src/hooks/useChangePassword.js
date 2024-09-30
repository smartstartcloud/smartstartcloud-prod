import { useAuthContext } from "../context/AuthContext";
import useApi from "./useApi";

const useChangePassword = () => {
    const {setAuthUser} = useAuthContext()
    const api = useApi()
    
    const changePassword = async({password, userName }) => {
        try {
            console.log(password, userName);
            const res = await api.post(`/api/auth/renew`, {
                password, 
                userName, 
            })
            const data = await res.data;
            if (data.error){
                throw new Error(data.error);
            }
            console.log(JSON.stringify(data));
            console.log('hoise');
            
            // localStorage
            localStorage.setItem("user-details", JSON.stringify(data))
            // context
            setAuthUser(data)
            
        } catch (error) {
            console.log("Error in changePassword hook", error);      
        }
    }

    return {changePassword}
}

export default useChangePassword;