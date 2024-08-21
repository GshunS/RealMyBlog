import { createSlice } from "@reduxjs/toolkit"
import { produce } from 'immer'
import { fetchData } from '../../utils/apiService'

const blogContentNavbarStore = createSlice({
    name: "navbar",
    initialState: {
        expandedCategories: {},
        allCategories: {},
        tempFolderCreated: false,
        tempFolderDisplay: false,
        currentAncestorNames: [],
        folderCreated: false,
        fileHid: false
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
        editFileHid(state, action) {
            state.fileHid = action.payload
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
    editFileHid
} = blogContentNavbarStore.actions

// fetch the next category
const fetchNextCategory = (categoryValue, ...categories) => {
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
                                currentLevel[category].subCategories = data;
                                currentLevel[category].hasChildren = true;
                            } else {
                                currentLevel = currentLevel[category].subCategories;
                            }
                        });
                    });
                    dispatch(editAllCategories(updatedAllCategories));
                },
                (error) => console.log('An error occurred:', error)
            );

        }
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

    };
}

// delete operation(either delete an article or a folder)
const deleteOperation = (deleteType, articleId, categoryNames) => {
    return async (dispatch) => {
        if (deleteType === 'article') {
            const url = `https://localhost:7219/api/articles/${articleId}/hide`
            // hide article
            await fetchData(url, 'patch', null,
                (data) => {
                    // console.log('success')
                    dispatch(editFileHid(true))
                },
                (error) => {
                    console.log(error)
                })
        } else {
            // delete folder
            console.log('delete folder', categoryNames)
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
    editFileHid
}

export { fetchNextCategory, deleteOperation }

const reducer = blogContentNavbarStore.reducer

export default reducer