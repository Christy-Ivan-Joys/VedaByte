import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    adminInfo: localStorage.getItem('adminInfo') ? JSON.parse(localStorage.getItem('adminInfo') as string) : null
}

const adminAuthSlice = createSlice({
    name: 'adminAuth',
    initialState,
    reducers:{ 
        setAdmin:(state, action)=>{
            state.adminInfo = action.payload
            localStorage.setItem('adminInfo',JSON.stringify(action.payload))
        },
    }
})

export const { setAdmin } = adminAuthSlice.actions
export const adminAuthReducer = adminAuthSlice.reducer 
