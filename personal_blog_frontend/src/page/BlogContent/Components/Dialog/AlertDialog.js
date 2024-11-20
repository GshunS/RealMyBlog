import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useSelector, useDispatch } from 'react-redux';
import { editAlertDialog } from '../../../../store/modules/blogContentDialogStore';
import { editCurrentAncestorNames, deleteOperation} from '../../../../store/modules/blogContentNavBarStore'

import {produce} from 'immer'
import { editErrorMsg } from '../../../../store/modules/blogContentErrorPopUpStore'
import { logout } from '../../../../store/modules/blogContentLoginStore'


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogActions-root': {
        "justifyContent": "space-around"
    },
}));


export default function AlertDialog() {
    const dispatch = useDispatch();
    const { alertDialog } = useSelector(state => state.blogContentDialog)

    const handleClose = () => {
        let uptDialog = produce(alertDialog, draft => {
            draft.open = false;
        })
        dispatch(editAlertDialog(uptDialog))
    };

    const handleConfirm = () => {
        switch (alertDialog.dest) {
            case "LogOutConfirm":
                handleLogout();
                break;
            case "DeleteFFConfirm":
                handleDeleteFF();
                break;
            default:
                break;
        }

        handleClose()
    }

    const handleLogout = () => {
        dispatch(logout())
        dispatch(editErrorMsg({ type: "INFO", msg: "Log Out successfully" }))
    }

    const handleDeleteFF = () => {
        const {categoryNames, deleteType, articleId} = alertDialog.postData
        dispatch(editCurrentAncestorNames(categoryNames))
        dispatch(deleteOperation(deleteType, articleId, categoryNames))
    }

    return (
        <React.Fragment>
            <BootstrapDialog
                open={alertDialog.open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {alertDialog.dialogTitle}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {alertDialog.dialogText}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>No</Button>
                    <Button onClick={handleConfirm} autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </React.Fragment>
    );
}
