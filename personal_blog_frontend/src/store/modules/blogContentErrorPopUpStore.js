import { createSlice } from "@reduxjs/toolkit"

const blogContentErrorPopUpStore = createSlice({
    name: "ErrorPopUp",
    initialState: {
        type: '',
        msg: ''
    },
    reducers: {
        editErrorMsg(state, action) {
            const { type, msg } = action.payload
            state.type = type
            state.msg = msg
            if (msg === null || msg === "") {
                state.msg = "unknown error"
            }
        }
    }

})

const {
    editErrorMsg
} = blogContentErrorPopUpStore.actions


export {
    editErrorMsg
}

const reducer = blogContentErrorPopUpStore.reducer

export default reducer