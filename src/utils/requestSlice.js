import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
    name:"requests",
    initialState:null,
    reducers:{
        addRequests:(state,action)=>action.payload,
        removeAllRequests:(state,action)=>null,
        removeOneRequest:(state,action)=>{
            const newArray=state.filter((req)=>req._id !== action.payload);
            return newArray;
        }
    }
})

export const {addRequests,removeAllRequests,removeOneRequest}= requestSlice.actions;

export default requestSlice.reducer;