import { configureStore } from "@reduxjs/toolkit";
import { userApiSlices } from "../slices/userApiSlices";
import { userAuthReducer } from "../slices/userAuthSlice";
import apiSlice from "../slices/apiSlices";
import { instructorAuthReducer } from "../slices/instructorAuthSlice";
import { adminAuthReducer } from "../slices/adminAuthSlice";

const store  = configureStore({
    reducer:{
        [userApiSlices.reducerPath]:userApiSlices.reducer,

        userAuth:userAuthReducer,
        instructorAuth:instructorAuthReducer,
        adminAuth:adminAuthReducer,
    },
  middleware:(getDefaultMiddleware)=>getDefaultMiddleware().concat(apiSlice.middleware)
})
export default store