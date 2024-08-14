import {createApi,fetchBaseQuery} from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
    baseUrl:'/',
    // credentials:'include'
})

const apiSlice = createApi({
    baseQuery,
    tagTypes:['Users'],
    endpoints:(builder)=>({})
})
export default apiSlice

// prepareHeaders:(headers)=>{
//     const token = localStorage.getItem('token');
//     if(token){
       
//        headers.set('Authorization',`Bearer ${token}`)

//     }else{
//        console.log('no headersssss token')
//     }
//     headers.set('Content-Type','application/json')
//     return headers
// }