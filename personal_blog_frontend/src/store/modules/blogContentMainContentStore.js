import { createSlice } from "@reduxjs/toolkit"
import { fetchData } from '../../utils/apiService'
import { produce } from 'immer'
import { editErrorMsg } from './blogContentErrorPopUpStore'



const blogContentMainContent = createSlice({
    name: "mainContent",
    initialState: {
        showTextArea: false,
        articleInfo: {
            articleId: null,
            articleTitle: null,
            articleContent: null,
            articlePath: null,
            authorName: null,
            articleViewAmount: null,
            articleUpvoteAmount: null,
            articleCreatedTime: null,
            articleUpdatedTime: null
        }
    },
    reducers: {
        editShowTextArea(state, action) {
            state.showTextArea = action.payload
        },
        editArticleInfo(state, action) {
            state.articleInfo = action.payload
        }
    }
})

const getArticleInfo = (articleId) => {
    return async (dispatch, getState) => {
        const currentAncestorNames = getState().blogContentNavbar.currentAncestorNames;
        const articlePath = '/' + currentAncestorNames.join('/');

        let url = `https://localhost:7219/api/articles/id/${articleId}`;
        await fetchData(
            url,
            'get',
            null,
            (data) => {
                dispatch(editArticleInfo(
                    {
                        articleId: articleId,
                        articleTitle: data.title,
                        articleContent: data.content,
                        authorName: "123",
                        articlePath: articlePath,
                        articleViewAmount: data.view_count,
                        articleUpvoteAmount: data.upvote_count,
                        articleCreatedTime: data.created_time,
                        articleUpdatedTime: data.update_time
                    }
                ));
                dispatch(editShowTextArea(true));
            },
            (error) => {
                dispatch(editErrorMsg({ type: 'ERROR', msg: error.message }))
            }
        )
    }
}

const {
    editShowTextArea,
    editArticleInfo
} = blogContentMainContent.actions


export {
    editShowTextArea,
    editArticleInfo,
}

export {
    getArticleInfo
}

const reducer = blogContentMainContent.reducer

export default reducer