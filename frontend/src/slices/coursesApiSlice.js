import { COURSES_URL, UPLAOD_URL, CONTENTS_URL } from '../constants';
import { apiSlice } from './apiSlice';

export const coursesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query({
      query: ({ page, category, search }) => ({
        url: COURSES_URL,
        method: 'GET',
        params: { page, category, search }, 
      }),
      providesTags: ['Courses'],
      keepUnusedDataFor: 5,
    }),
    getCoursesToAdmin: builder.query({
      query: () => ({
        url: `${COURSES_URL}/admin`,
        method: 'GET',
      }),
      keepUnusedDataFor: 5,
    }),
    deleteCourse: builder.mutation({
      query: (courseId) => ({
        url: `${COURSES_URL}/${courseId}/admin`,
        method: 'DELETE'
      }),
    }),
    getCourseDetails: builder.query({
      query: (courseId) => ({
        url: `${COURSES_URL}/${courseId}`,
        method: 'GET'
      }),
      keepUnusedDataFor: 5,
    }),
    createCourse: builder.mutation({
      query: (data) => ({
        url: COURSES_URL,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Courses'],
    }),
    uploadCourseImage : builder.mutation({
      query: (data) => ({
        url: UPLAOD_URL,
        method: 'POST',
        body: data
      }),
    }),
    getTopCourses: builder.query({
      query: ()=> ({
        url: `${COURSES_URL}/top`
      }),
      keepUnusedDataFor: 5,
    }),
    enrollStudentToCourse: builder.mutation({
      query: (courseId) => ({
        url: `${COURSES_URL}/${courseId}/enroll`,
        method: 'PUT',
        body: {}
      }),
    }),
    getCourseContents: builder.query({
      query: (courseId) => ({
        url: `${CONTENTS_URL}/${courseId}`,
        method: 'GET'
      }),
      keepUnusedDataFor: 5,
    }),
    createReview: builder.mutation({
      query: (data) => ({
        url: `${COURSES_URL}/${data.courseId}/reviews`,
        method: 'POST',
        body: data
      }),
    }),
    addContent: builder.mutation({
      query: ({ courseId, data }) => ({
        url: `${CONTENTS_URL}/${courseId}`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ["Course"],
    }),
    getInstructorCourses: builder.query({
      query: () => ({
        url: `${COURSES_URL}/instructor`,
        method: 'GET'
      }),
    }),
    deleteInstructorCourse: builder.mutation({
      query: (courseId) => ({
        url: `${COURSES_URL}/${courseId}/instructor`,
        method: 'DELETE'
      }),
    }),
    getStudentCourses: builder.query({
      query: () => ({
        url: `${COURSES_URL}/me`,
      }),
      keepUnusedDataFor: 5,
    }),
    courseIsPending: builder.query({
      query: (courseId)=> ({
        url:`${COURSES_URL}/${courseId}/pending`
      }),
      keepUnusedDataFor: 5,
    })
  }),
});

export const { 
  useGetCoursesQuery,
  useCreateCourseMutation,
  useGetCourseDetailsQuery, 
  useUploadCourseImageMutation, 
  useGetTopCoursesQuery,
  useEnrollStudentToCourseMutation,
  useGetCourseContentsQuery,
  useCreateReviewMutation,
  useAddContentMutation,
  useGetCoursesToAdminQuery,
  useDeleteCourseMutation,
  useGetInstructorCoursesQuery,
  useDeleteInstructorCourseMutation,
  useGetStudentCoursesQuery,
  useCourseIsPendingQuery
} = coursesApiSlice;