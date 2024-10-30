import axios from 'axios';

export const fetchData = async (url, method = 'get', data = null, successCallback, errorCallback) => {
    try {
        const response = await axios({ method, url, data });
        successCallback(response.data);
    } catch (error) {
        console.log(error)
        let error_msg = '';
        if (error.response) {
            error_msg = `${error.response.data.message}`;
        } else {
            error_msg = error
        }

        if (errorCallback) {
            errorCallback(error_msg);
        }
    }
};
