import { createSlice } from "@reduxjs/toolkit"
import { fetchData } from "../../utils/apiService";
import { editErrorMsg } from "./blogContentErrorPopUpStore";

const blogContentLoginStore = createSlice({
    name: "Login",
    initialState: {
        token: '',
    },
    reducers: {
        editToken(state, action) {
            state.token = action.payload;
        }
    }

})

const {
    editToken
} = blogContentLoginStore.actions

const fectchLoginToken = (username, password) => {
    return async (dispatch) => {
        const postData = {
            "username": username,
            "password": password
        }
        const url = `https://localhost:7219/api/login`
        await fetchData(
            url,
            'POST',
            postData,
            (data) => {
                dispatch(editToken(data))
            },
            (error) => {
                dispatch(editErrorMsg({ type: 'ERROR', msg: error }))
            }
        )
    }
}

export {
    editToken
}

export {
    fectchLoginToken
}

const reducer = blogContentLoginStore.reducer

export default reducer