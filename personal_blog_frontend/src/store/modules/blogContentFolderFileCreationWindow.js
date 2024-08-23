import { createSlice } from "@reduxjs/toolkit"

const blogContentFolderFileCreationWindowStore = createSlice({
    name: "FFCreation",
    initialState: {
        addType: ""
    },
    reducers: {
        editAddType(state, action){
            state.addType = action.payload
        }
    }

})

const {
    editAddType
} = blogContentFolderFileCreationWindowStore.actions


export {
    editAddType
}

const reducer = blogContentFolderFileCreationWindowStore.reducer

export default reducer