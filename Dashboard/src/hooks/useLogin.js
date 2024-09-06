import { useAuthContext } from "../context/AuthContext";
import { useTokenContext } from "../context/TokenContext";

const useLogin = () => {
    const {setAuthUser} = useAuthContext();
    const {setAccessToken, setRefreshToken} = useTokenContext()
    const getCookie = async (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };
    const login = async({userName, password}) => {
        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                credentials: "include",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({userName, password})
            });
            const data = await res.json();
            if (data.error){
                throw new Error(data.error);
            }
            
            // localStorage
            localStorage.setItem("user-details", JSON.stringify(data))
            localStorage.setItem("refresh-token", JSON.stringify(data.refreshToken))
            setRefreshToken(JSON.parse(localStorage.getItem("user-details")).refreshToken)            
            
            const accessToken = await getCookie('accessToken');
            setAccessToken(accessToken)
            localStorage.setItem("access-token", JSON.stringify(accessToken))
            // console.log(accessToken);
            // context
            setAuthUser(data)


        } catch (error) {
            console.log("Error in login hook", error);
            
        }
        
    }

    return {login}
}

export default useLogin