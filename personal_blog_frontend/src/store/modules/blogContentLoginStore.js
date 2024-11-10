import { createSlice } from "@reduxjs/toolkit"
import { fetchData } from "../../utils/apiService";
import { editErrorMsg } from "./blogContentErrorPopUpStore";

const blogContentLoginStore = createSlice({
    name: "Login",
    initialState: {
        token: localStorage.getItem('token_key') || '',
    },
    reducers: {
        editToken(state, action) {
            state.token = action.payload;
            localStorage.setItem('token_key', action.payload)
        },
        logout(state) {
            state.token = '';
            localStorage.removeItem('token_key')
        }
    }

})

const {
    editToken,
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
                dispatch(editToken(data))
                dispatch(editErrorMsg({ type: 'INFO', msg: "login successfully" }))
            },
            (error) => {
                dispatch(editErrorMsg({ type: 'ERROR', msg: error }))
            }
        )
    }
}

export {
    editToken,
    logout
}

export {
    fectchLoginToken
}

const reducer = blogContentLoginStore.reducer

export default reducer