export const switchBackendURL = () => {
    let baseURL;
    console.log(process.env.REACT_APP_NODE_ENV);
    if (process.env.REACT_APP_NODE_ENV === "development"){
        baseURL = process.env.REACT_APP_LOCALHOST
    } else if (process.env.REACT_APP_NODE_ENV === "production"){
        baseURL = process.env.REACT_APP_PRODUCTION
    } else if (process.env.REACT_APP_NODE_ENV === "staging"){
        baseURL = process.env.REACT_APP_STAGING
    }
    return baseURL
}