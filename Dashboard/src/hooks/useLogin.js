import { useAuthContext } from "../context/AuthContext";

const useLogin = () => {
    const {setAuthUser} = useAuthContext();
    const login = async({userName, password}) => {
        try {
            const res = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({userName, password})
            });
            const data = await res.json();
            if (data.error){
                throw new Error(data.error);
            }
            console.log(JSON.stringify(data));
            
            // localStorage
            localStorage.setItem("user-details", JSON.stringify(data))
            // context
            setAuthUser(data)


        } catch (error) {
            console.log("Error in login hook", error);
            
        }
        
    }

    return {login}
}

export default useLogin