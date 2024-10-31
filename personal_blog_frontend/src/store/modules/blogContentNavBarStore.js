import { createSlice } from "@reduxjs/toolkit"
import { produce } from 'immer'
import { fetchData } from '../../utils/apiService'
import { editErrorMsg } from './blogContentErrorPopUpStore'
import { editArticleInfo, editShowTextArea } from "./blogContentMainContentStore"

const blogContentNavbarStore = createSlice({
    name: "navbar",
    initialState: {
        expandedCategories: {},
        allCategories: {},
        tempFolderCreated: false,
        tempFolderDisplay: false,
        currentAncestorNames: [],
        folderCreated: false,
        folderDeletedObj: false,
        fileCreatedObj: {
            status: false,
            fileId: null,
            fileName: null
        },
        fileHidObj: {
            status: false,
            fileId: null
        },
        canRender: false
    },
    reducers: {
        editExpandedCategories(state, action) {
            state.expandedCategories = action.payload
        },
        editAllCategories(state, action) {
            state.allCategories = action.payload
        },
        editTempFolderCreated(state, action) {
            state.tempFolderCreated = action.payload
        },
        editTempFolderDisplay(state, action) {
            state.tempFolderDisplay = action.payload
        },
        editCurrentAncestorNames(state, action) {
            state.currentAncestorNames = action.payload
        },
        editFolderCreated(state, action) {
            state.folderCreated = action.payload
        },
        editFileHidObj(state, action) {
            state.fileHidObj = action.payload
        },
        editFileCreatedObj(state, action) {
            state.fileCreatedObj = action.payload
        },
        editFolderDeleted(state, action) {
            state.folderDeleted = action.payload
        },
        editCanRender(state, action) {
            state.canRender = action.payload
        }

    }
})

const {
    editExpandedCategories,
    editAllCategories,
    editCurrentAncestorNames,
    editTempFolderCreated,
    editTempFolderDisplay,
    editFolderCreated,
    editFileHidObj,
    editFolderDeleted,
    editFileCreatedObj,
    editCanRender
} = blogContentNavbarStore.actions

// fetch the next category
const fetchNextCategory = (checkExpanded, ...categories) => {
    return async (dispatch, getState) => {
        const expandedCategories = getState().blogContentNavbar.expandedCategories;
        const allCategories = getState().blogContentNavbar.allCategories;
        let url = 'https://localhost:7219/api/categories';
        // let categoryName = null
        const categoryLevels = ['first_category', 'second_category', 'third_category', 'fourth_category'];
        categories.forEach((category, index) => {
            if (category) {
                url += `/${categoryLevels[index]}/${category}`;
                // categoryName = category;
            }
        });

        let expanded = true
        if (checkExpanded === true) {
            let currentExpandedLevel = expandedCategories;
            categories.forEach((category, index) => {
                if (index === categories.length - 1) {
                    if (currentExpandedLevel.hasOwnProperty(category)) {
                        expanded = false;
                    }
                } else {
                    currentExpandedLevel = currentExpandedLevel[category];
                }
            });
        }

        if (categories.length !== 4 && expanded) {
            // const response = await axios.get(url);
            await fetchData(
                url,
                'get',
                null,
                (data) => {
                    const updatedAllCategories = produce(allCategories, draft => {
                        let currentLevel = draft;
                        categories.forEach((category, index) => {
                            if (index === categories.length - 1) {
                                if (data !== null && currentLevel[category].subCategories !== null) {
                                    // key in data but not in subCategories
                                    const missingKeysInData = Object.keys(data).filter(key => !(key in currentLevel[category].subCategories));
                                    missingKeysInData.forEach(key => {
                                        currentLevel[category].subCategories[key] = data[key]
                                    })

                                    // key in subCategories but not in data
                                    const missingKeysInCate = Object.keys(currentLevel[category].subCategories).filter(key => !(key in data));
                                    missingKeysInCate.forEach(key => {
                                        delete currentLevel[category].subCategories[key]
                                    })
                                } else {
                                    currentLevel[category].subCategories = data;
                                }

                                let subCateLength = 0;
                                let articleLength = 0;
                                if (data !== null) {
                                    subCateLength = Object.keys(data).length
                                }
                                if (currentLevel[category].articles !== null) {
                                    articleLength = Object.keys(currentLevel[category].articles).length
                                }

                                if (articleLength === 0 && subCateLength === 0) {
                                    currentLevel[category].hasChildren = false;
                                } else {
                                    currentLevel[category].hasChildren = true;
                                }
                            } else {
                                currentLevel = currentLevel[category].subCategories;
                            }
                        });
                    });
                    dispatch(editAllCategories(updatedAllCategories));
                },
                (error) => {
                    dispatch(editErrorMsg({ type: 'ERROR', msg: error.message }))
                }
            );

        }
    };
}

const setExpandedCategories = (...categories) => {
    return (dispatch, getState) => {
        const expandedCategories = getState().blogContentNavbar.expandedCategories;
        let updatedExpandedCategories = produce(expandedCategories, draft => {
            let currentExpandedLevel = draft;
            categories.forEach((category, index) => {
                if (index === categories.length - 1) {
                    if (currentExpandedLevel.hasOwnProperty(category)) {
                        delete currentExpandedLevel[category];
                    } else {
                        currentExpandedLevel[category] = {};
                    }
                } else {
                    currentExpandedLevel = currentExpandedLevel[category];
                }
            });
        });

        dispatch(editExpandedCategories(updatedExpandedCategories));
    }
}

// delete operation(either delete an article or a folder)
const deleteOperation = (deleteType, articleId) => {
    return async (dispatch, getState) => {
        const currentArticleInfo = getState().blogContentMainContent.articleInfo;
        if (deleteType === 'article') {
            const url = `https://localhost:7219/api/articles/${articleId}/hide`
            // hide article
            await fetchData(url, 'patch', null,
                (data) => {
                    dispatch(editErrorMsg({ type: 'INFO', msg: 'Success' }))
                    dispatch(editFileHidObj(
                        {
                            status: true,
                            fileId: articleId
                        }
                    ))
                    let newArticleInfo = produce(currentArticleInfo, draft => {
                        draft.articleId = null;
                    })
                    dispatch(editShowTextArea(false))
                    dispatch(editArticleInfo(newArticleInfo))
                },
                (error) => {
                    dispatch(editErrorMsg({ type: 'ERROR', msg: error.message }))
                })
        } else {
            // delete folder
            const url = `https://localhost:7219/api/categories`
            const updatedAncestorNames = getState().blogContentNavbar.currentAncestorNames;


            const categories = ['first_category', 'second_category', 'third_category', 'fourth_category']
            let Data = {}
            categories.forEach((category, index) => {
                if (updatedAncestorNames[index]) {
                    Data[category] = updatedAncestorNames[index].trim()
                } else {
                    Data[category] = null
                }
            })

            await fetchData(url, 'delete', Data,
                (data) => {
                    dispatch(editFolderDeleted(true))
                },
                (error) => {
                    dispatch(editErrorMsg({ type: 'ERROR', msg: error.message }))
                    console.log('An error occurred:', error)
                })
        }
    }
}
export {
    editExpandedCategories,
    editCurrentAncestorNames,
    editAllCategories,
    editTempFolderCreated,
    editTempFolderDisplay,
    editFolderCreated,
    editFileHidObj,
    editFileCreatedObj,
    editFolderDeleted,
    editCanRender
}

export { fetchNextCategory, setExpandedCategories, deleteOperation }

const reducer = blogContentNavbarStore.reducer

export default reducer