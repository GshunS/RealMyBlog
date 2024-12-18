import { createSlice } from "@reduxjs/toolkit"
import { fetchData } from '../../utils/apiService'
import { produce } from 'immer'
import { editErrorMsg } from './blogContentErrorPopUpStore'


const blogContentMainContentStore = createSlice({
    name: "mainContent",
    initialState: {
        showTextArea: false,
        articleInfo: {
            articleId: null,
            articleTitle: null,
            articleContent: null,
            articleJsonContent: null,
            articlePath: null,
            authorName: null,
            articleViewAmount: null,
            articleUpvoteAmount: null,
            articleCreatedTime: null,
            articleUpdatedTime: null
        },
        articleSaveStatus: "unsave"
    },
    reducers: {
        editShowTextArea(state, action) {
            state.showTextArea = action.payload
        },
        editArticleInfo(state, action) {
            state.articleInfo = action.payload
        },
        editArticleSaveStatus(state, action) {
            state.articleSaveStatus = action.payload
        },
    }
})

const replaceSrcInJson = (jsonContent, srcMap) => {
    const parsedContent = JSON.parse(jsonContent);

    const replaceSrc = (node) => {
        if (typeof node === 'object' && node !== null) {
            if (node.type === 'image' && node.attrs && srcMap[node.attrs.src]) {
                node.attrs.src = srcMap[node.attrs.src];
            } else if (node.content) {
                node.content.forEach(replaceSrc);
            }
        }
    };

    replaceSrc(parsedContent);
    return JSON.stringify(parsedContent);
};

const getArticleInfo = (articleId, cateNames = null) => {
    return async (dispatch, getState) => {
        // request all images
        const mimeTypes = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.bmp': 'image/bmp',
            '.tiff': 'image/tiff',
            '.webp': 'image/webp',
            '.svg': 'image/svg+xml',
            '.heif': 'image/heif',
        };
        let mappedImages = null;
        let imageUrl = `${process.env.REACT_APP_API_URL}/images/articles-id/${articleId}`
        await fetchData(
            imageUrl,
            'get',
            null,
            (data) => {
                mappedImages = data.reduce((acc, image) => {
                    const hashvalue = image.image_hashvalue;
                    const imageData = `data:${mimeTypes[image.image_ext.toLowerCase()]};base64,${image.image_data}`;

                    acc[hashvalue] = imageData;
                    return acc;
                }, {});
            },
            (error => {
                dispatch(editErrorMsg({ type: 'ERROR', msg: error }))
            })
        )

        let url = `${process.env.REACT_APP_API_URL}/articles/id/${articleId}`;
        await fetchData(
            url,
            'get',
            null,
            (data) => {
                let updatedJson = data.json_content
                if (Object.keys(mappedImages).length !== 0) {
                    updatedJson = replaceSrcInJson(data.json_content, mappedImages);
                }

                const path = '/' + Object.values(data.category)
                    .filter(ele => ele !== null)
                    .join('/');
                dispatch(editArticleInfo(
                    {
                        articleId: articleId,
                        articleTitle: data.title,
                        articleContent: data.content,
                        articleJsonContent: updatedJson,
                        authorName: data.author_name,
                        articlePath: path,
                        articleViewAmount: data.view_count,
                        articleUpvoteAmount: data.upvote_count,
                        articleCreatedTime: data.created_time,
                        articleUpdatedTime: data.update_time
                    }
                ));
                dispatch(editShowTextArea(true));
            },
            (error) => {
                dispatch(editErrorMsg({ type: 'ERROR', msg: error }))
            }
        )
    }
}

// update attrs of articles except for content
const updateAttrs = (patchData) => {
    return async (dispatch, getState) => {
        const articleInfo = getState().blogContentMainContent.articleInfo
        const url = `${process.env.REACT_APP_API_URL}/articles/id/${articleInfo.articleId}`;
        return await fetchData(
            url,
            "PATCH",
            patchData,
            (data) => {
                let newArticleInfo = produce(articleInfo, draft => {
                    draft.articleId = data.id;
                    draft.articleTitle = data.title;
                    // draft.articlePath = articlePath;
                    draft.articleViewAmount = data.view_count;
                    draft.articleUpvoteAmount = data.upvote_count;
                    draft.articleCreatedTime = data.created_time;
                    draft.articleUpdatedTime = data.update_time;
                });
                dispatch(editArticleInfo(newArticleInfo))
                dispatch(editErrorMsg({ type: 'INFO', msg: "Saved!" }))
            },
            (error) => {
                dispatch(editErrorMsg({ type: 'ERROR', msg: error }))
            }
        )
    }
}

const {
    editShowTextArea,
    editArticleInfo,
    editArticleSaveStatus
} = blogContentMainContentStore.actions


export {
    editShowTextArea,
    editArticleInfo,
    editArticleSaveStatus
}

export {
    getArticleInfo,
    updateAttrs
}

const reducer = blogContentMainContentStore.reducer

export default reducer