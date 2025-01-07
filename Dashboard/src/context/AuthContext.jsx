import { jwtDecode } from "jwt-decode";
import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem("user-details")) || null
  );
  const [token, setToken] = useState(localStorage.getItem("access-token") || null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isPortal, setIsPortal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  useEffect(() => {
    if (!token) return; // Exit if token is null or undefined

    const { userId = null, userRole = null } =
      extractDataFromToken(token) || {};
    // Update authUser with the extracted data
    if (userRole === "superAdmin") {
      setIsSuperAdmin(true);
      setIsAdmin(true);
    } else if (userRole === "admin") {            
      setIsAdmin(true);
    } else if (userRole === "edu" || userRole === "pen") {
      setIsPortal(true);
    }
  }, [token]);
  return (
    <AuthContext.Provider
      value={{
        authUser,
        setAuthUser,
        isAdmin,
        isSuperAdmin,
        isPortal,
        isCollapsed,
        setIsCollapsed,
        setToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Sample function to decode JWT token
const extractDataFromToken = (token) => {
  
  try {    
    if (token === "" || token === null){        
        throw new Error("Empty Token"); 
    }    
    // Decode the token using jwt-decode
    const decodedToken = jwtDecode(token);

    // Access data from the decoded token
    // console.log("Decoded Token:", decodedToken);

    // Extract specific data like user info, roles, etc.
    const userId = decodedToken.userId; // example
    // const email = decodedToken.email;   // example
    const userRole = decodedToken.userRole; // example

    // Return or use the extracted data as needed
    return { userId, userRole };
  } catch (error) {
    console.error("Invalid JWT Token:", error);
    return null;
  }
};
