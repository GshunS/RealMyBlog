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
        return response;
    },
    (error) => {
        let errMsg = 'Unknown Error, Check console';
        const originalRequest = error.config;
        if (error.response) {
            if (error.response.status === 401) {
                if (localStorage.getItem('refreshToken_key') && !originalRequest._retry) {
                    originalRequest._retry = true;
                    // refresh token
                    const refreshToken = localStorage.getItem('refreshToken_key')
                    return fetchData(
                        `${process.env.REACT_APP_API_URL}/authors/refreshToken?refToken=${refreshToken}`,
                        'post',
                        null,
                        (res) => {
                            localStorage.setItem('token_key', res.accessToken);
                            localStorage.setItem('refreshToken_key', res.refreshToken);
                            axios.defaults.headers.common['Authorization'] = `Bearer ${res.accessToken}`;
                            originalRequest.headers.Authorization = `Bearer ${res.accessToken}`;
                            console.log('refresh token success');
                            return axiosInstance(originalRequest);
                        },
                        (err) => {
                            console.log(err);
                        }
                    );
                } else {
                    if (error.response.data && error.response.data.message) {
                        errMsg = error.response.data.message;
                    } else {
                        // Token is expired or invalid, remove it
                        store.dispatch(logout());
                        errMsg = 'Unauthorized';
                    }
                }
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
export const fetchData = async (url, method = 'get', data = null, successCallback = () => { }, errorCallback = () => { }) => {
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
        if (typeof successCallback === 'function') {
            if (response === true) {
                successCallback("success");
            } else {
                successCallback(response.data.data);
            }
        }
        return true;
    } catch (error) {
        // The error will be handled by the response interceptor, so this block may not be needed
        errorCallback(error.message || error);
        return false;
    }
};
