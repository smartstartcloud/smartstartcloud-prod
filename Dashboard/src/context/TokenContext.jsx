import { createContext, useContext, useState } from "react";

export const TokenContext = createContext()

export const useTokenContext = () => {
    return useContext(TokenContext);
}

export const TokenContextProvider = ({children}) => {
    const [accessToken, setAccessToken] = useState(JSON.parse(localStorage.getItem("access-token")) || null)
    const [refreshToken, setRefreshToken] = useState(JSON.parse(localStorage.getItem("refresh-token")) || null)
    return <TokenContext.Provider value={{accessToken, setAccessToken, refreshToken, setRefreshToken}}>
        {children}
    </TokenContext.Provider>
}