import { configureStore } from "@reduxjs/toolkit";
import mainHeaderReducer from "./modules/mainHeaderStore"
import blogContentNavbarReducer from "./modules/blogContentNavBarStore"

const store = configureStore({
    reducer: {
        mainHeader: mainHeaderReducer,
        blogContentNavbar: blogContentNavbarReducer
    }
})

export default store