
import apiSlice from "./apiSlices";

const ADMIN_URL = '/api/admin'

export const adminApiSlices = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    adminlogin: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/login`,
        method: 'POST',
        body: data,
      })
    }),
    students: builder.mutation({
      query: () => ({
        url: `${ADMIN_URL}/all-students`,
        method: 'GET',
      })
    }),
    tutors: builder.mutation({
      query: () => ({
        url: `${ADMIN_URL}/all-tutors`,
        method: 'GET',
      })
    }),
    changestatus: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/change-status`,
        method: 'POST',
        body: data
      })
    }),
    applications: builder.mutation({
      query: () => ({
        url: `${ADMIN_URL}/applications`,
        method: 'GET'
      })
    }),

    approveOrreject: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/course-approval`,
        method: 'POST',
        body: data,
      })
    }),

    addCategory: builder.mutation({
      query: (data) => ({
        url: `${ADMIN_URL}/add-category`,
        method: 'POST',
        body: data,
      })
    }),

    fetchAllCategories: builder.mutation({
      query: () => ({
        url: `${ADMIN_URL}/fetch-categories`,
        method: 'GET',
      })
    }),

    verifyARefreshToken: builder.mutation({
      query: () => ({
        url: `${ADMIN_URL}/verify-arefresh-token`,
        method: 'POST',
      })
    }),
  })
})

export const {

  useAdminloginMutation,
  useStudentsMutation,
  useTutorsMutation,
  useChangestatusMutation,
  useApplicationsMutation,
  useApproveOrrejectMutation,
  useAddCategoryMutation,
  useFetchAllCategoriesMutation,
  useVerifyARefreshTokenMutation

} = adminApiSlices 
