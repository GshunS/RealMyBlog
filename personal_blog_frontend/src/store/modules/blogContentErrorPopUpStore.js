import { createSlice } from "@reduxjs/toolkit"

const blogContentErrorPopUpStore = createSlice({
    name: "ErrorPopUp",
    initialState: {
        errorMsg: ""
    },
    reducers: {
        editErrorMsg(state, action){
            state.errorMsg = action.payload
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