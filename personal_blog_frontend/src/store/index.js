import { configureStore } from "@reduxjs/toolkit";
import mainHeaderReducer from "./modules/mainHeaderStore"

const store = configureStore({
    reducer: {
        mainHeader: mainHeaderReducer
    }
})

export default store