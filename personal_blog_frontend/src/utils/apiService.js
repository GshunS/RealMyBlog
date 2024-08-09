// src/services/apiService.js
import axios from 'axios';

export const fetchData = async (url, method = 'get', data = null, successCallback, errorCallback) => {
    try {
        const response = await axios({ method, url, data });
        successCallback(response.data);
    } catch (error) {
        if (error.response) {
            const status = error.response.status;
            if (status === 400) {
                console.error(`Bad Request: ${error.response.data}`);
            } else if (status === 500) {
                console.error(`Internal Server Error: ${error.response.data}`);
            } else {
                console.error(`Error: ${error.response.data}`);
            }
        } else {
            console.error('No response received');
        }

        if (errorCallback) {
            errorCallback(error);
        }
    }
};
