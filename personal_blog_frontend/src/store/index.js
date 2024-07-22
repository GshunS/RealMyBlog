import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./modules/counterStore"
import authorReducer from "./modules/authorStore"
import mainHeaderReducer from "./modules/mainHeaderStore"

const store = configureStore({
    reducer: {
        counter: counterReducer,
        author: authorReducer,
        mainHeader: mainHeaderReducer
    }
})

export default store