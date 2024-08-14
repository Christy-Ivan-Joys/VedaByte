import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
    baseUrl:'/',
    // credentials:'include'
})

const apiSlice = createApi({
    baseQuery,
    tagTypes:['Users'],
    endpoints:(_builder)=>({})
})
export default apiSlice

