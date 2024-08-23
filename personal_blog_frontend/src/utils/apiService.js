import axios from 'axios';

export const fetchData = async (url, method = 'get', data = null, successCallback, errorCallback) => {
    try {
        const response = await axios({ method, url, data });
        successCallback(response.data);
    } catch (error) {
        let error_msg = '';
        if (error.response) {
            const status = error.response.status;
            if (status === 400) {
                error_msg = `Bad Request: ${error.response.data.message}`;
            } else if (status === 500) {
                error_msg = `Internal Server Error: ${error.response.data.message}`;
            } else {
                error_msg = `Error: ${error.response.data.message}`;
            }
        } else {
            error_msg = error
        }

        if (errorCallback) {
            errorCallback(error_msg);
        }
    }
};
