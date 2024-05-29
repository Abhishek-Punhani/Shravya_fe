import {combineReducers, configureStore} from "@reduxjs/toolkit"
import storage from "redux-persist/lib/storage"
import { persistStore, persistReducer } from 'redux-persist' 
import createFilter from "redux-persist-transform-filter"
import userSlice from "../features/userSlice";
import chatSlice from "../features/chatSlice";

 
const saveOnlyUserFilter=createFilter("user",['user']);


const persistConfig={
    key:'user',
    storage,
    whitelist:['user'],
    transforms:[saveOnlyUserFilter],
}

const rootReducer=combineReducers({
    user: userSlice,
    chat:chatSlice,
})
const persistedReducer=persistReducer(persistConfig,rootReducer);

export const store=configureStore({
    reducer:persistedReducer,
    middleware:(getDefaultMiddleware=>
        getDefaultMiddleware({
            serializableCheck:false,
        })
    ),
    devTools:true,
})

export const persistor=persistStore(store);