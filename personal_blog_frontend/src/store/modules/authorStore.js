import { createSlice } from "@reduxjs/toolkit";
import axios from 'axios'
import reducer from "./counterStore";

const authorStore = createSlice({
    name: "author list",
    initialState: {
        author_list: []
    },
    reducers: {
        setAuthorList(state, action){
            state.author_list = action.payload
        }
    }
})

const {setAuthorList} = authorStore.actions

const fetchAuthorList = () =>{
    return async (dispatch) => {
       const res =  await axios.get("https://localhost:7219/api/articles")
       dispatch(setAuthorList(res.data))
    }
}

export {fetchAuthorList}

export default authorStore.reducer