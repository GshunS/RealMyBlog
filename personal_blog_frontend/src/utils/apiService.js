import axios from 'axios';
import store from '../store/index'
import { logout } from '../store/modules/blogContentLoginStore';
// Create an axios instance
const axiosInstance = axios.create();

// Request interceptor: Adding token to headers
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token_key');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor: Handle errors globally
axiosInstance.interceptors.response.use(
    (response) => {
        // If the request was successful, just return the response data
        return response;
    },
    (error) => {
        let errMsg = 'Unknown Error, Check console';

        if (error.response) {
            if (error.response.status === 401 || error.response.status === 403) {
                // Token is expired or invalid, remove it
                store.dispatch(logout());
                errMsg = 'Unauthorized or Forbidden';
            } else {
                // Handle other status codes (e.g., 500, 404, etc.)
                errMsg = error.response.data.message || 'Server error';
            }
        } else if (error.request) {
            // No response received, network error
            errMsg = 'Network error';
        } else {
            // Other errors (request setup issues)
            errMsg = `Unknown Error: ${error.message}`;
        }

        // Pass the error message to the callback if provided
        if (error.config && error.config.errorCallback) {
            error.config.errorCallback(errMsg);
        }

        // Reject the promise to propagate the error
        return Promise.reject(errMsg);
    }
);

// Fetch data using the axios instance
export const fetchData = async (url, method = 'get', data = null, successCallback, errorCallback) => {
    try {
        // Attach the errorCallback to the request config so it can be accessed in the response interceptor
        const config = {
            method,
            url,
            data,
            errorCallback
        };

        // Make the request using the axios instance
        const response = await axiosInstance(config);
        // Call the success callback with the response data
        successCallback(response.data.data);
        return true;
    } catch (error) {
        // The error will be handled by the response interceptor, so this block may not be needed
        return false;
    }
};
