import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteOperation, editCurrentAncestorNames } from '../../../../store/modules/blogContentNavBarStore'
import _ from 'lodash'
import produce from 'immer'
import { editAlertDialog } from '../../../../store/modules/blogContentDialogStore';

const NavBarDeleteOperation = React.memo((props) => {
    const dispatch = useDispatch()
    const { deleteType, articleId, categoryNames } = props
    const { alertDialog } = useSelector(state => state.blogContentDialog)

    // if deleteType is article, hide the article
    // if deleteType is folder, delete the folder
    const handleDeleteFileOrFolder = _.debounce(() => {
        let uptAlertDialog = produce(alertDialog, draft => {
            draft.open = true;
            draft.dialogTitle = 'Delete Confirmtion';
            draft.dialogText = 'The data may not be recovered. Are you sure to delete it?';
            draft.dest = 'DeleteFFConfirm';
            draft.postData = {
                categoryNames: categoryNames,
                deleteType: deleteType, 
                articleId: articleId
            }
        })
        dispatch(editAlertDialog(uptAlertDialog))
    }, 300)

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className='nav-bar__delete-file'
            onClick={handleDeleteFileOrFolder}>
            <title>delete</title>
            <path d="M448 480L64 480c-35.3 0-64-28.7-64-64L0 96C0 60.7 28.7 32 64 32l128 0c20.1 0 39.1 9.5 51.2 25.6l19.2 25.6c6 8.1 15.5 12.8 25.6 12.8l160 0c35.3 0 64 28.7 64 64l0 256c0 35.3-28.7 64-64 64zM184 272c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z" />
        </svg>
    )
})

export default NavBarDeleteOperation