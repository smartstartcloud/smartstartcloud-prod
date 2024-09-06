import { useTokenContext } from "../context/TokenContext";



const useToken = () => {
    const {accessToken, setAccessToken} = useTokenContext()

    const handleToken = async () => {
        try {
            if (!accessToken) {
                alert('You need to login first!');
                return;
            }

            const res = await fetch('http://localhost:5000/dummyRequest', {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });

            if (res.ok ){
                const data = await res.json();
                console.log(data);
            } else if (res.status === 403 ){
                // If access token is expired, request a new one using the refresh token
                const tokenResponse = await fetch('http://localhost:5000/dummyRequest/token', {
                method: 'POST',
                credentials: 'include'
                });
                const tokenData = await tokenResponse.json();
                
                if (tokenData.error){
                    throw new Error(tokenData.error);
                }
                setAccessToken(tokenData.accessToken);
                localStorage.setItem("access-token", JSON.stringify(tokenData.accessToken))
                alert('Access Token refreshed!');
            }
            else {
                alert('Unable to access protected data.');
            }
        } catch (error) {
            console.log("Error in token hook", error);
        }        
    }

    return{handleToken}

}

export default useToken;