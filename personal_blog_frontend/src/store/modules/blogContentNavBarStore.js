import { createSlice } from "@reduxjs/toolkit"
import { produce } from 'immer'
import axios from 'axios'

const blogContentNavbarStore = createSlice({
    name: "navbar",
    initialState: {
        expandedCategories: {},
        allCategories: {},
        tempFolderCreated: false,
        tempFolderDisplay: false,
        currentAncestorNames: [],
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
     
        
    }
})

const {
    editExpandedCategories,
    editAllCategories,
    editCurrentAncestorNames,
    editTempFolderCreated,
    editTempFolderDisplay
} = blogContentNavbarStore.actions

// fetch the next category
const fetchNextCategory = (categoryValue, ...categories) => {
    return async (dispatch, state) => {
        const expandedCategories = state().blogContentNavbar.expandedCategories;
        const allCategories = state().blogContentNavbar.allCategories;
        let url = 'https://localhost:7219/api/categories';
        // let categoryName = null
        const categoryLevels = ['first_category', 'second_category', 'third_category', 'fourth_category'];
        categories.forEach((category, index) => {
            if (category) {
                url += `/${categoryLevels[index]}/${category}`;
                // categoryName = category;
            }
        });

        try {
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
                const response = await axios.get(url);
                const updatedAllCategories = produce(allCategories, draft => {
                    let currentLevel = draft;
                    categories.forEach((category, index) => {
                        if (index === categories.length - 1) {
                            currentLevel[category].subCategories = response.data;
                        } else {
                            currentLevel = currentLevel[category].subCategories;
                        }
                    });
                });
                dispatch(editAllCategories(updatedAllCategories));
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
            // dispatch(editCurrentCategoryInfo({ categoryName, categoryValue }))

        } catch (error) {
            if (error.response) {
                const status = error.response.status;
                if (status === 400) {
                    console.log(`[Bad Request: ${error.response.data}]`);
                } else if (status === 500) {
                    console.log(`[Internal Server Error: ${error.response.data}]`);
                } else {
                    console.log(`[Error: ${error.response.data}]`);
                }
            } else {
                console.log('[No response received]', error);
            }
        }
    };
}

export {
    editCurrentAncestorNames,
    editAllCategories,
    editTempFolderCreated,
    editTempFolderDisplay
}

export { fetchNextCategory }

const reducer = blogContentNavbarStore.reducer

export default reducer