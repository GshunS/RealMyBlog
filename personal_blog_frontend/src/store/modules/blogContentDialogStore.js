import { createSlice } from "@reduxjs/toolkit"

const blogContentDialogStore = createSlice({
    name: "Dialog",
    initialState: {
        formDialog: {
            open: false,
            dialogTitle: '',
            dialogText: '',
            dialogLabel: '',
            defaultValue: '',
            dest: '',
            postData: null
        }
    },
    reducers: {
        editFormDialog(state, action) {
            state.formDialog = action.payload
        }
    }

})

const {
    editFormDialog
} = blogContentDialogStore.actions


export {
    editFormDialog
}

const reducer = blogContentDialogStore.reducer

export default reducer