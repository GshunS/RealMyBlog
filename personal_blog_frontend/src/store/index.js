import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./modules/counterStore"
import authorReducer from "./modules/authorStore"


const store = configureStore({
    reducer: {
        counter: counterReducer,
        author: authorReducer
    }
})

export default store