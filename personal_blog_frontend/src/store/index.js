import { configureStore } from "@reduxjs/toolkit";
import mainHeaderReducer from "./modules/mainHeaderStore"
import blogContentNavbarReducer from "./modules/blogContentNavBarStore"
import blogContentErrorPopUpReducer from "./modules/blogContentErrorPopUpStore"

const store = configureStore({
    reducer: {
        mainHeader: mainHeaderReducer,
        blogContentNavbar: blogContentNavbarReducer,
        blogContentErrorPopUp: blogContentErrorPopUpReducer
    }
})

export default store