import apiSlice from "./apiSlices";

const INSTRUCTOR_URL = '/api/instructor'

export const instructorApiSlices = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        signup: builder.mutation({
            query: (data) => ({
                url: `${INSTRUCTOR_URL}/register`,
                method: 'POST',
                body: data,
            })
        }),
        signin: builder.mutation({
            query: (data) => ({
                url: `${INSTRUCTOR_URL}/login`,
                method: 'POST',
                body: data
            })
        }),
        sendOTP: builder.mutation({
            query: (data) => ({
                url: `${INSTRUCTOR_URL}/send-otp`,
                method: 'POST',
                body: data
            })
        }),

        addCourse: builder.mutation({
            query: (data) => ({
                url: `${INSTRUCTOR_URL}/add`,
                method: 'POST',
                body: data
            })
        }),
        courses: builder.mutation({
            query: () => ({
                url: `${INSTRUCTOR_URL}/courses`,
                method: 'GET',
            })
        }),
        updateProfileImage: builder.mutation({
            query: (data) => ({
                url: `${INSTRUCTOR_URL}/update-image`,
                method: 'PATCH',
                body: data
            })
        }),
        verifyIRefreshToken: builder.mutation({
            query: () => ({
                url: `${INSTRUCTOR_URL}/verify-irefresh-token`,
                method: 'POST',
            })
        }),

        updateProfileDetails: builder.mutation({
            query: (data) => ({
                url: `${INSTRUCTOR_URL}/update-profile`,
                method: 'PATCH',
                body: data
            })
        }),
        fetchEnrolledStudents: builder.mutation({
            query: () => ({
                url: `${INSTRUCTOR_URL}/enrolled-students`,
                method: 'GET'
            })
        }),
        fetchCategoriesforInstructor:builder.mutation({
            query:()=>({
                url:`${INSTRUCTOR_URL}/categories`,
                method:'GET',
            })
        }),
        editCourse:builder.mutation({
            query:(data)=>({
                url:`${INSTRUCTOR_URL}/edit-course`,
                method:'PATCH',
                body:data
            })
        }),
        fetchInstructorMessages:builder.mutation({
            query:(studentId)=>({
                url:`${INSTRUCTOR_URL}/imessages/${studentId}`,
                method:'GET'
            })
        }),
        addQualification:builder.mutation({
            query:(data)=>({
                url:`${INSTRUCTOR_URL}/add-qualification`,
                method:'PATCH',
                body:data
            })
        }),
        addCertification:builder.mutation({
            query:(data)=>({
                url:`${INSTRUCTOR_URL}/add-certification`,
                method:'PATCH',
                body:data
            })
        }),
        addSection:builder.mutation({
            query:(data)=>({
                url:`${INSTRUCTOR_URL}/add-section`,
                method:'PATCH',
                body:data,
            })
        }),
        deleteSection:builder.mutation({
            query:(data)=>({
                url:`${INSTRUCTOR_URL}/delete-section`,
                method:'PATCH',
                body:data,
            })
        }),
        dashboardData:builder.mutation({
            query:(data)=>({
                url:`${INSTRUCTOR_URL}/dashboard-data`,
                method:'GET',
                body:data
            })
        }),
        fetchDataForDashboard:builder.mutation({
            query:()=>({
                url:`${INSTRUCTOR_URL}/graph-data`,
                method:'GET',
            })
        }),
        instructorMessages:builder.mutation({
            query:()=>({
                url:`${INSTRUCTOR_URL}/instructor-messages`,
                method:'GET'
            })
        })
    })
})


export const {
    useSignupMutation,
    useSigninMutation,
    useSendOTPMutation,
    useAddCourseMutation,
    useCoursesMutation,
    useUpdateProfileImageMutation,
    useVerifyIRefreshTokenMutation,
    useUpdateProfileDetailsMutation,
    useFetchEnrolledStudentsMutation,
    useFetchCategoriesforInstructorMutation,
    useEditCourseMutation,
    useFetchInstructorMessagesMutation,
    useAddQualificationMutation,
    useAddCertificationMutation,
    useAddSectionMutation,
    useDeleteSectionMutation,
    useDashboardDataMutation,
    useFetchDataForDashboardMutation,
    useInstructorMessagesMutation   

} = instructorApiSlices