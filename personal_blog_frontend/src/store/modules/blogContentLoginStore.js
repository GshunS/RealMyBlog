import { createSlice } from "@reduxjs/toolkit"
import { fetchData } from "../../utils/apiService";
import { editErrorMsg } from "./blogContentErrorPopUpStore";

const blogContentLoginStore = createSlice({
    name: "Login",
    initialState: {
        token: localStorage.getItem('token_key') || '',
        tokenValid: false
    },
    reducers: {
        editToken(state, action) {
            state.token = action.payload;
            localStorage.setItem('token_key', action.payload)
        },
        editTokenValid(state, action) {
            state.tokenValid = action.payload;
        },
        logout(state) {
            state.token = '';
            localStorage.removeItem('token_key')
            localStorage.removeItem('refreshToken_key')
        }
    }

})

const {
    editToken,
    editTokenValid,
    logout
} = blogContentLoginStore.actions

const fectchLoginToken = (username, password) => {
    return async (dispatch) => {
        const postData = {
            "username": username,
            "password": password
        }
        const url = `https://localhost:7219/api/login`
        return await fetchData(
            url,
            'POST',
            postData,
            (data) => {
                dispatch(editToken(data.accessToken))
                localStorage.setItem('refreshToken_key', data.refreshToken)
                dispatch(editErrorMsg({ type: 'INFO', msg: "login successfully" }))
            },
            (error) => {
                dispatch(editErrorMsg({ type: 'ERROR', msg: error }))
            }
        )
    }
}

const JwtValidation = () => {
    return async (dispatch) => {
        const url = `https://localhost:7219/api/validation`
        const res = await fetchData(
            url,
            'GET',
            null,
        )
        dispatch(editTokenValid(res))
    }
}

export {
    editToken,
    editTokenValid,
    logout
}

export {
    fectchLoginToken,
    JwtValidation
}

const reducer = blogContentLoginStore.reducer

export default reducer