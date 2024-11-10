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
        },
        alertDialog: {
            open: false,
            dialogTitle: '',
            dialogText: '',
            dest: '',
            postData: null,
        }
    },
    reducers: {
        editFormDialog(state, action) {
            state.formDialog = action.payload
        },
        editAlertDialog(state, action) {
            state.alertDialog = action.payload
        }
    },

})


const {
    editFormDialog,
    editAlertDialog
} = blogContentDialogStore.actions


export {
    editFormDialog,
    editAlertDialog
}

const reducer = blogContentDialogStore.reducer

export default reducer