import { useAuthContext } from "../context/AuthContext";

const useChangePassword = () => {
    const {setAuthUser} = useAuthContext()
    
    const changePassword = async({password, userName }) => {
        try {
            console.log(password, userName);
            const res = await fetch(`${process.env.REACT_APP_LOCALHOST}/api/auth/renew`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({password, userName})
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
            
        } catch (error) {
            console.log("Error in changePassword hook", error);      
        }
    }

    return {changePassword}
}

export default useChangePassword;