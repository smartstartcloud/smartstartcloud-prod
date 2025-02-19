export const switchBackendURL = () => {
    let baseURL;    
    if (process.env.NODE_ENV === "development"){
        baseURL = process.env.REACT_APP_LOCALHOST
    } else if (process.env.NODE_ENV === "production"){
        baseURL = process.env.REACT_APP_PRODUCTION
    } else if (process.env.NODE_ENV === "staging"){
        baseURL = process.env.REACT_APP_STAGING
    }
    return baseURL
}