import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const CONVERSATION_ENDPOINT=`${process.env.REACT_APP_AUTH_ENDPOINT}/conversation`;
const initialState={
    status:"",
    error:"",
    conversations:[],
    activeConversation:{},
    notifications:[],
}

// Functions

export const getConversations=createAsyncThunk("conversation/all",async (token,{rejectWithValue})=>{
    try {
        const {data}=await axios.get(CONVERSATION_ENDPOINT,{
            headers:{
                Authorization: `Bearer ${token}`,
            }
        })
        console.log(data);
    } catch (error) {
        console.log(error);
        return rejectWithValue(error.response.data.error.message)
    }
})

export const chatSlice=createSlice({
    name:"chat",
    initialState,
    reducers:{
        setActiveConversation:(state,action)=>{
            state.activeConversation=action.payload;
        }
    },
    extraReducers(builder){
        builder.addCase(getConversations.pending,(state,action)=>{
            state.status="pending";
        })
        .addCase(getConversations.fulfilled,(state,action)=>{
            state.status="suceeded";
            state.conversations=action.payload;
            state.error="";
        })
        .addCase(getConversations.rejected,(state,action)=>{
            state.status="failed";
            state.error=action.payload;
        })
    }
})


export const {setActiveConversation}=chatSlice.actions;
export default chatSlice.reducer;