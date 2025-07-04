import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateCourseMutation } from '../../slices/coursesApiSlice';
import Loader from '../../components/Loader';
import Message from '../../components/Message';

const AddCourseScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('Web Development'); // Default category
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();
  const [createCourse, { isLoading, error }] = useCreateCourseMutation();

  // Handle image upload
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Image upload failed');
      }

      const data = await response.json();
      setImage(data.image);
      setUploading(false);
    } catch (err) {
      console.error(err);
      setUploading(false);
    }
  };

  // Handle form submission
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createCourse({ title, description, price, image, category }).unwrap();
      navigate('/courses');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-all duration-300 font-medium group"
        >
          <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to Courses</span>
        </button>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-slate-800 mb-2 leading-tight">
            Create New Course
          </h1>
          <p className="text-slate-600 font-light">Share your knowledge and create an engaging learning experience</p>
        </div>

        {/* Main Form Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-blue-500/90 to-indigo-600/90 p-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h2 className="text-white text-xl font-medium mb-1">Course Information</h2>
                <p className="text-blue-100 text-sm font-light">Fill in the details to create your course</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {/* Display Loader or Error Message */}
            {isLoading && (
              <div className="mb-6 flex justify-center">
                <Loader />
              </div>
            )}
            {error && (
              <div className="mb-6">
                <div className="bg-red-50/80 backdrop-blur-sm rounded-2xl border border-red-200/60 p-4">
                  <Message variant="danger">
                    {error?.data?.message || 'Failed to create course'}
                  </Message>
                </div>
              </div>
            )}

            {/* Add Course Form */}
            <form onSubmit={submitHandler} encType="multipart/form-data" className="space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-slate-800">Basic Information</h3>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-slate-700 font-medium mb-3 text-sm">
                    Course Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-4 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300/60 transition-all duration-300 font-light placeholder-slate-400"
                    placeholder="Enter a compelling course title"
                    required
                  />
                  <p className="text-slate-500 text-xs font-light mt-2">
                    Choose a clear, descriptive title that highlights what students will learn
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-slate-700 font-medium mb-3 text-sm">
                    Course Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-4 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300/60 transition-all duration-300 font-light placeholder-slate-400 resize-none"
                    placeholder="Describe what students will learn and achieve in this course..."
                    rows="5"
                    required
                  />
                  <p className="text-slate-500 text-xs font-light mt-2">
                    Provide a detailed overview of the course content and learning outcomes
                  </p>
                </div>

                {/* Price and Category Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Price */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-3 text-sm">
                      Course Price
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-slate-500 text-lg font-light">$</span>
                      </div>
                      <input
                        type="text"
                        value={price}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d*\.?\d{0,2}$/.test(value)) {
                            setPrice(value); // Allow only numbers with up to 2 decimal places
                          }
                        }}
                        className="w-full pl-8 pr-4 py-4 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300/60 transition-all duration-300 font-light placeholder-slate-400"
                        placeholder="0.00"
                        required
                      />
                    </div>
                    <p className="text-slate-500 text-xs font-light mt-2">
                      Set a competitive price for your course
                    </p>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-slate-700 font-medium mb-3 text-sm">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-4 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300/60 transition-all duration-300 font-light appearance-none cursor-pointer"
                      required
                    >
                      <option value="Web Development">Web Development</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Mobile Development">Mobile Development</option>
                      <option value="Design">Design</option>
                      <option value="Business">Business</option>
                    </select>
                    <p className="text-slate-500 text-xs font-light mt-2">
                      Choose the most relevant category for your course
                    </p>
                  </div>
                </div>
              </div>

              {/* Course Image Section */}
              <div className="border-t border-slate-200/40 pt-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-slate-800">Course Image</h3>
                </div>

                {/* Image URL */}
                <div className="mb-6">
                  <label className="block text-slate-700 font-medium mb-3 text-sm">
                    Image URL
                  </label>
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full p-4 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300/60 transition-all duration-300 font-light placeholder-slate-400"
                    placeholder="https://example.com/course-image.jpg"
                    required
                  />
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-slate-700 font-medium mb-3 text-sm">
                    Or Upload Image File
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      onChange={uploadFileHandler}
                      className="w-full p-4 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300/60 transition-all duration-300 font-light file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:transition-colors file:duration-300"
                    />
                    {uploading && (
                      <div className="mt-3 flex items-center gap-3">
                        <Loader />
                        <span className="text-slate-600 text-sm font-light">Uploading image...</span>
                      </div>
                    )}
                  </div>
                  <p className="text-slate-500 text-xs font-light mt-2">
                    Upload a high-quality image that represents your course (recommended: 1200x675px)
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="border-t border-slate-200/40 pt-8">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || uploading}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span>Create Course</span>
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50/50 backdrop-blur-sm rounded-3xl border border-blue-200/40 p-8">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-blue-800 font-medium mb-2">Course Creation Tips</h3>
              <ul className="text-blue-700 text-sm font-light space-y-1">
                <li>• Use a clear, benefit-focused title that tells students what they'll achieve</li>
                <li>• Write a compelling description that outlines the course structure and outcomes</li>
                <li>• Choose an eye-catching thumbnail image that represents your course topic</li>
                <li>• Research competitive pricing in your category for optimal positioning</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCourseScreen;