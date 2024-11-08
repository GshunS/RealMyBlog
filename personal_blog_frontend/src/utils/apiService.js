import axios from 'axios';

export const fetchData = async (url, method = 'get', data = null, successCallback, errorCallback) => {
    try {
        const token = localStorage.getItem('token_key');

        const config = {
            method,
            url,
            data,
            headers: {
                ...(token && { 'Authorization': `Bearer ${token}` })
            }
        };
        const response = await axios(config);
        successCallback(response.data);
        return true;
    } catch (error) {
        console.log(error)
        let error_msg = '';
        if (error.response) {
            error_msg = `${error.response.data.error}`;
        } else {
            error_msg = error
        }

        if (errorCallback) {
            errorCallback(error_msg);
        }
        return false;
    }
};
