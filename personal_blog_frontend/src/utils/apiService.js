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
        successCallback(response.data.data);
        return true;
    } catch (error) {
        console.log(error)
        let errMsg = 'Unknown Error, Check console'
        if (error.response) {
            if (error.response.status === 401 || error.response.status === 403) {
                errMsg = 'Unauthorized or Forbidden';
            } else {
                errMsg = error.response.data.message;
            }
        } else if (error.request) {
            errMsg = 'Network error';
        } else {
            errMsg = `Unknown Error: ${error.message}`;
        }

        if (errorCallback) {
            errorCallback(errMsg);
        }
        return false;
    }
};
