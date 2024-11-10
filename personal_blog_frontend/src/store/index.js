import { configureStore } from "@reduxjs/toolkit";
import mainHeaderReducer from "./modules/mainHeaderStore"
import blogContentNavbarReducer from "./modules/blogContentNavBarStore"
import blogContentErrorPopUpReducer from "./modules/blogContentErrorPopUpStore"
import blogContentFolderFileCreationWindowReducer from "./modules/blogContentFolderFileCreationWindow";
import blogContentMainContentReducer from "./modules/blogContentMainContentStore"
import blogContentLoginReducer from "./modules/blogContentLoginStore"
import blogContentDialogRecucer from "./modules/blogContentDialogStore"

const store = configureStore({
    reducer: {
        mainHeader: mainHeaderReducer,
        blogContentNavbar: blogContentNavbarReducer,
        blogContentErrorPopUp: blogContentErrorPopUpReducer,
        blogContentFFCreationWindow: blogContentFolderFileCreationWindowReducer,
        blogContentMainContent: blogContentMainContentReducer,
        blogContentLogin: blogContentLoginReducer,
        blogContentDialog: blogContentDialogRecucer
    }
})

export default store