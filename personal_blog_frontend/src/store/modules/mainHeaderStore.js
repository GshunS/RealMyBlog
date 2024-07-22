import {createSlice} from "@reduxjs/toolkit"

const mainHeaderStore = createSlice({
    name: "header",
    initialState: {
        editable: false
    },
    reducers: {
        editStatus(state){
            state.editable = !state.editable
        }
    }
})

const {editStatus} = mainHeaderStore.actions

const reducer = mainHeaderStore.reducer

export {editStatus}

export default reducer