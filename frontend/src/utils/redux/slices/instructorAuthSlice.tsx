import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    instructorInfo: localStorage.getItem('instructorInfo') ? JSON.parse(localStorage.getItem('instructorInfo') as string) : null
}

const instructorAuthSlice = createSlice({
    name: 'instructorAuth',
    initialState,
    reducers:{ 
        setInstructor:(state, action)=>{
            state.instructorInfo = action.payload
            localStorage.setItem('instructorInfo',JSON.stringify(action.payload))
        },
    }
})

export const { setInstructor } = instructorAuthSlice.actions
export const instructorAuthReducer = instructorAuthSlice.reducer 
