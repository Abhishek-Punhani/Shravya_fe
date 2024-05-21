import { createSlice } from "@reduxjs/toolkit";

const initalState={
    status:"",
    error:"",
    user:{
        id:"",
        name:"",
        email:"",
        picture:"",
        status:"",
        token:"",
    },
}

export const userSlice=createSlice({
    name:"user",
    initialState:initalState,
    reducers:{
        logout:(state)=>{
            state.status="";
            state.error="";
            state.user={
                id:"",
                name:"",
                email:"",
                picture:"",
                status:"",
                token:"",
            }
        }
    },
})

export const {logout}=userSlice.actions;
export default userSlice.reducer;