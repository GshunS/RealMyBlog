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
        dataRefreshed: false
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
        editDataRefreshed(state) {
            state.dataRefreshed = !state.dataRefreshed
        }

    }
})

const {
    editExpandedCategories,
    editAllCategories,
    editCurrentAncestorNames,
    editTempFolderCreated,
    editTempFolderDisplay,
    editDataRefreshed
} = blogContentNavbarStore.actions

// fetch the next category
const fetchNextCategory = (categoryValue, ...categories) => {
    return async (dispatch, getState) => {
        const expandedCategories = getState().blogContentNavbar.expandedCategories;
        console.log(expandedCategories);
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
        
        await dispatch(editExpandedCategories(updatedExpandedCategories));

    };
}

export {
    editExpandedCategories,
    editCurrentAncestorNames,
    editAllCategories,
    editTempFolderCreated,
    editTempFolderDisplay,
    editDataRefreshed
}

export { fetchNextCategory }

const reducer = blogContentNavbarStore.reducer

export default reducer