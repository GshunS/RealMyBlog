import { createSlice } from "@reduxjs/toolkit"

const blogContentNavbarStore = createSlice({
    name: "navbar",
    initialState: {
        expandedCategories: {},
        allCategories: {},
        currentExpandedCategory: {},
        currentCategoryInfo: {
            categoryName: "",
            categoryValue: {}
        }
    },
    reducers: {
        editExpandedCategories(state, action) {
            state.expandedCategories = action.payload
        },
        editAllCategories(state, action) {
            state.allCategories = action.payload
        },
        editCurrentExpandedCategory(state, action) {
            state.currentExpandedCategory = action.payload
        },
        editCurrentCategoryInfo(state, action) {
            const { categoryName, categoryValue } = action.payload
            state.currentCategoryInfo = {
                ...state.currentCategoryInfo,
                'categoryName': categoryName,
                'categoryValue': categoryValue
            }
        }
    }
})

const { editExpandedCategories, editAllCategories, editCurrentExpandedCategory, editCurrentCategoryInfo } = blogContentNavbarStore.actions

const reducer = blogContentNavbarStore.reducer

export { editExpandedCategories, editAllCategories, editCurrentExpandedCategory, editCurrentCategoryInfo }

export default reducer