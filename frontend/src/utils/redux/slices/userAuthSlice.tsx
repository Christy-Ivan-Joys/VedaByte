import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    studentInfo: localStorage.getItem('studentInfo') ? JSON.parse(localStorage.getItem('studentInfo') as string) : null
}

const userAuthSlice = createSlice({
    name: 'userAuth',
    initialState,
    reducers:{ 
        setUser:(state, action)=>{
            state.studentInfo = action.payload
            localStorage.setItem('studentInfo',JSON.stringify(action.payload))
        }
    }
})

export const { setUser } = userAuthSlice.actions
export const userAuthReducer = userAuthSlice.reducer 
