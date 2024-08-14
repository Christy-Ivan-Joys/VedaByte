import apiSlice from "./apiSlices";

const STUDENT_URL = '/api/students'

export const userApiSlices = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (data) => ({
                url: `${STUDENT_URL}/register`,
                method: 'POST',
                body: data,
            })
        }),
        
        login: builder.mutation({
            query: (data) => ({
                url: `${STUDENT_URL}/login`,
                method: 'POST',
                body: data,
            })

        }),
        sendOtp: builder.mutation({
            query: (data) => ({
                url: `${STUDENT_URL}/send-otp`,
                method: 'POST',
                body: data
            })
        }),
        fetchCourses: builder.mutation({
            query: () => ({
                url: `${STUDENT_URL}/courses`,
                method: 'GET',
            })
        }),
        addToCart: builder.mutation({
            query: (data) => ({
                url: `${STUDENT_URL}/add-to-cart`,
                method: 'POST',
                body: data
            })
        }),
        checkout: builder.mutation({
            query: (data) => ({
                url: `${STUDENT_URL}/checkout`,
                method: 'POST',
                body: data,
            })
        }),
        enroll: builder.mutation({
            query: (data) => ({
                url: `${STUDENT_URL}/enroll`,
                method: 'POST',
                body: data,
            })
        }),
        changePassword: builder.mutation({
            query: (data) => ({
                url: `${STUDENT_URL}/change-password`,
                method: 'POST',
                body: data
            })
        }),

        changeProfileimage: builder.mutation({
            query: (data) => ({
                url: `${STUDENT_URL}/change-image`,
                method: 'POST',
                body: data,
            })
        }),
        editProfile:builder.mutation({
            query:(data)=>({
                url:`${STUDENT_URL}/edit-profile`,
                method:'POST',
                body:data
            })
        }),

        verifyStudentRefreshToken:builder.mutation({
            query:()=>({
                url:`${STUDENT_URL}/verify-rtoken`,
                method:'POST',
            })
        }),

        removeCartItem:builder.mutation({
            query:(data)=>({
                url:`${STUDENT_URL}/remove`,
                method:'DELETE',
                body:data
            })
        }),
        fetchEnrolledCourses:builder.mutation({
            query:()=>({
                url:`${STUDENT_URL}/enrolled-courses`,
                method:'GET',
            })
        }),
        updateCourseProgress:builder.mutation({
            query:(data)=>({
                url:`${STUDENT_URL}/updateCourseProgress`,
                method:'PATCH',
                body:data
            })
        }),
        fetchStudentEnrollments:builder.mutation({
            query:()=>({
                url:`${STUDENT_URL}/student-enrollments`,
                method:'GET'
            })
        }),

        fetchCategories:builder.mutation({
            query:()=>({
                url:`${STUDENT_URL}/categories`,
                method:'GET',
            })
        }),
        updateProgress:builder.mutation({
            query:(data)=>({
                url:`${STUDENT_URL}/progress`,
                method:'PATCH',
                body:data
            })
        }),
        fetchAllMessages:builder.mutation({
            query:(InstructorId)=>({
                url:`${STUDENT_URL}/messages/${InstructorId}`,
                method:'GET',
            })
        }),
        Instructors:builder.mutation({
           query:()=>({
            url:`${STUDENT_URL}/instructors`,
            method:'GET',
           })
        }),
        fetchInstructorCourses:builder.mutation({
            query:(InstructorId)=>({
                url:`${STUDENT_URL}/inst-courses/${InstructorId}`,
                method:'GET',
            })
        }),
        submitcourseReview:builder.mutation({
             query:(data)=>({
                url:`${STUDENT_URL}/review-course`,
                method:'POST',
                body:data
             })
        }),
        reviews:builder.mutation({
            query:(courseId)=>({
               url:`${STUDENT_URL}/reviews/${courseId}`,
               method:'GET',
            })
       }),
       cancelEnrollment:builder.mutation({
        query:(data)=>({
            url:`${STUDENT_URL}/cancel-enrollment`,
            method:'POST',
            body:data
        })
       })
    })
})

export const {
    useRegisterMutation,
    useLoginMutation,
    useSendOtpMutation,
    useFetchCoursesMutation,
    useAddToCartMutation,
    useCheckoutMutation, 
    useEnrollMutation, 
    useChangePasswordMutation,
    useChangeProfileimageMutation,
    useEditProfileMutation,
    useRemoveCartItemMutation,
    useFetchEnrolledCoursesMutation,
    useVerifyStudentRefreshTokenMutation,
    useUpdateCourseProgressMutation,
    useFetchStudentEnrollmentsMutation,
    useFetchCategoriesMutation,
    useUpdateProgressMutation,
    useFetchAllMessagesMutation,
    useInstructorsMutation,
    useFetchInstructorCoursesMutation,
    useSubmitcourseReviewMutation,
    useReviewsMutation,
    useCancelEnrollmentMutation
} = userApiSlices 
