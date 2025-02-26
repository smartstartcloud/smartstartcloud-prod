
// Check userLogged in Time
export const checkTokenExpiry = (expiresIn) => {
    const { duration, creationTime } = expiresIn;
    const interval = setInterval(() => {
        const currentTime = Date.now();
        const elapsedTime = currentTime - creationTime;
        if (elapsedTime >= duration*1000) {
            alert("Token has fully expired!");
            console.log("Token has fully expired!");
            clearInterval(interval); // Stop checking after expiration
        } else if (elapsedTime >= (duration / 2)*1000) {
            alert("Warning: More than half of the token duration has passed.");
            console.log("Warning: More than half of the token duration has passed.");
        } 
    }, 1000); // Check every minute
};