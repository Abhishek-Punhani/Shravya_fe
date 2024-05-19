import {combineReducers, configureStore} from "@reduxjs/toolkit"
import storage from "redux-persist/lib/storage"
import {persistStore,persistReducer} from "react-persist"
import createFilter from "redux-persist-transform-filter"
const rootReducer=combineReducers({

})
 
const saveOnlyUserFilter=createFilter("user",['user']);


const persistConfig={
    key:'user',
    storage,
    whitelist:['user'],
    transforms:saveOnlyUserFilter,
}

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