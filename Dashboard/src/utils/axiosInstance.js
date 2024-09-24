import axios from 'axios';

// Create an axios instance
export const api = axios.create({
  baseURL: process.env.REACT_APP_LOCALHOST,
  withCredentials: true, // Ensures cookies are sent with requests
});

// Request interceptor to add Authorization header
api.interceptors.request.use((config) => {
    const token = JSON.parse(localStorage.getItem('access-token'));
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor to handle 403 errors (token expiration)
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 403) {            
            try {
                // Attempt to refresh the access token
                const { data } = await api.post('/dummyRequest/token');
                const newAccessToken = data.accessToken;
                if (newAccessToken) {
                localStorage.setItem('access-token', JSON.stringify(newAccessToken));
                api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
                alert('Access Token refreshed!');
                // Retry the original request
                error.config.headers.Authorization = `Bearer ${newAccessToken}`;
                return api.request(error.config);
                }
            } catch (refreshError) {
                console.error('Error refreshing access token:', refreshError);
                alert('Session expired. Please log in again.');
            }
        }
        return Promise.reject(error);
    }
);