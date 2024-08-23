import { configureStore } from "@reduxjs/toolkit";
import mainHeaderReducer from "./modules/mainHeaderStore"
import blogContentNavbarReducer from "./modules/blogContentNavBarStore"
import blogContentErrorPopUpReducer from "./modules/blogContentErrorPopUpStore"
import blogContentFolderFileCreationWindowReducer from "./modules/blogContentFolderFileCreationWindow";

const store = configureStore({
    reducer: {
        mainHeader: mainHeaderReducer,
        blogContentNavbar: blogContentNavbarReducer,
        blogContentErrorPopUp: blogContentErrorPopUpReducer,
        blogContentFFCreationWindow: blogContentFolderFileCreationWindowReducer
    }
})

export default store