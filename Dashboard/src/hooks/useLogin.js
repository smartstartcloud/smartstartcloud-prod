import { useAuthContext } from "../context/AuthContext";
import { useTokenContext } from "../context/TokenContext";

const useLogin = () => {
    const {setAuthUser} = useAuthContext();
    const {setAccessToken} = useTokenContext()
    const login = async({userName, password}) => {
        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                credentials: "include",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({userName, password})
            });
            const data = await res.json();
            console.log(data);
            
            if (data.error){
                throw new Error(data.error);
            }
            
            // localStorage
            localStorage.setItem("user-details", JSON.stringify(data))
            localStorage.setItem("access-token", JSON.stringify(data.accessToken))
            setAccessToken(data.accessToken)            
            setAuthUser(data)


        } catch (error) {
            console.log("Error in login hook", error);
            
        }
        
    }

    return {login}
}

export default useLogin