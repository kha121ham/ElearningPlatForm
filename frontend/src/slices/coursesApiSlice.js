import { COURSES_URL, UPLAOD_URL } from '../constants';
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
  }),
});

export const { useGetCoursesQuery, useCreateCourseMutation, useGetCourseDetailsQuery, useUploadCourseImageMutation } = coursesApiSlice;