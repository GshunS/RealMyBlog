import { createSlice } from "@reduxjs/toolkit"

const blogContentNavbarStore = createSlice({
    name: "navbar",
    initialState: {
        expandedCategories: {},
        allCategories: {},
        expandedCategoriesCount: 0,
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
        editExpandedCategoriesCount(state, action) {
            state.expandedCategoriesCount = action.payload
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

export const {
    editExpandedCategories,
    editAllCategories,
    editCurrentExpandedCategory,
    editCurrentCategoryInfo,
    editExpandedCategoriesCount
} = blogContentNavbarStore.actions

const reducer = blogContentNavbarStore.reducer

export default reducer