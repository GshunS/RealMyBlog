import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useSelector, useDispatch } from 'react-redux';
import { editFormDialog } from '../../../../store/modules/blogContentDialogStore';
import {produce} from 'immer'
import { fetchData } from '../../../../utils/apiService'
import { editErrorMsg } from '../../../../store/modules/blogContentErrorPopUpStore'
import { editAllCategories, editExpandedCategories } from '../../../../store/modules/blogContentNavBarStore';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogActions-root': {
        "justifyContent": "space-around"
    },
}));


export default function FormDialog() {
    const dispatch = useDispatch();
    const { formDialog } = useSelector(state => state.blogContentDialog)
    const { allCategories, expandedCategories } = useSelector(state => state.blogContentNavbar)


    const handleClose = () => {
        let tempFormDialog = produce(formDialog, draft => {
            draft.open = false;
        })

        dispatch(editFormDialog(tempFormDialog))
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());
        const newName = formJson.text;
        switch (formDialog.dest) {
            case "UpdateCategoryName":
                UpdateCategoryName(newName);
                break;
            default:
                break;
        }

        handleClose();
    }

    const UpdateCategoryName = async (newName) => {
        const { id, ancestorCategoryNames } = formDialog.postData;
        const ancestorLength = ancestorCategoryNames.length;
        let uptAncestorCategoryNames = [...ancestorCategoryNames]
        uptAncestorCategoryNames[ancestorLength - 1] = newName

        const postData = {
            id: id,
            first_category: uptAncestorCategoryNames[0],
            second_category: ancestorLength >= 2 ? uptAncestorCategoryNames[1] : null,
            third_category: ancestorLength >= 3 ? uptAncestorCategoryNames[2] : null,
            fourth_category: ancestorLength >= 4 ? uptAncestorCategoryNames[3] : null
        }

        const url = `${process.env.REACT_APP_API_URL}/categories/${id}`

        await fetchData(
            url,
            'PATCH',
            postData,
            () => {
                dispatch(editErrorMsg({ type: "INFO", msg: "Success" }))
                let updateAllCategories = produce(allCategories, draft => {
                    let current = draft;
                    uptAncestorCategoryNames.forEach((element, index) => {
                        if (current.hasOwnProperty(element)) {
                            current = current[element].subCategories
                        } else {
                            current[element] = current[ancestorCategoryNames[index]]
                            delete current[ancestorCategoryNames[index]]
                            return;
                        }
                    });
                })
                dispatch(editAllCategories(updateAllCategories));

                let updateExpaned = produce(expandedCategories, draft => {
                    let current = draft;
                    uptAncestorCategoryNames.forEach((element, index) => {
                        if (current.hasOwnProperty(element)) {
                            current = current[element]
                        } else {
                            if (current.hasOwnProperty(ancestorCategoryNames[index])){
                                current[element] = current[ancestorCategoryNames[index]]
                                delete current[ancestorCategoryNames[index]]
                            }
                        }
                    });
                })
                dispatch(editExpandedCategories(updateExpaned));

            },
            (error) => {
                dispatch(editErrorMsg({ type: "ERROR", msg: error }))
            }
        )
    }

    return (
        <React.Fragment>
            <BootstrapDialog
                open={formDialog.open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: handleSubmit,
                }}
            >
                <DialogTitle>{formDialog.dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {formDialog.dialogText}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="name"
                        name="text"
                        label={formDialog.dialogLabel}
                        fullWidth
                        variant="standard"
                        defaultValue={formDialog.defaultValue}
                        autoComplete='off'
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Confirm</Button>
                </DialogActions>
            </BootstrapDialog>
        </React.Fragment>
    );
}
