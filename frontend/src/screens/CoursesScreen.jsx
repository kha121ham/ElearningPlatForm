import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetCoursesQuery } from '../slices/coursesApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Pagination from '../components/Pagination';
import { useSelector } from 'react-redux';

const CoursesScreen = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [isFiltering, setIsFiltering] = useState(false);

  const { data, isLoading, error } = useGetCoursesQuery({
    page,
    category,
    search,
  });

  const courses = data?.courses || [];
  const totalPages = data?.pages || 1;

  const handleCategoryChange = (e) => {
    setIsFiltering(true);
    setCategory(e.target.value);
    setPage(1);
    setTimeout(() => setIsFiltering(false), 500);
  };

  const handleSearchChange = (e) => {
    setIsFiltering(true);
    setSearch(e.target.value);
    setPage(1);
    setTimeout(() => setIsFiltering(false), 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-slate-800 mb-4 tracking-tight">
            <span className="font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Explore
            </span>
            <span className="text-slate-600 font-extralight"> Our Courses</span>
          </h1>
          <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Discover knowledge that transforms. Find the perfect course for your learning journey.
          </p>
          <div className="mt-6 flex justify-center">
            <div className="w-20 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-60"></div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mb-10 max-w-4xl mx-auto">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search courses..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-12 pr-4 py-3.5 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300/60 transition-all duration-300 shadow-sm hover:shadow-md text-slate-700 font-light placeholder-slate-400"
            />
          </div>

          <div className="relative lg:w-64">
            <select
              value={category}
              onChange={handleCategoryChange}
              className="w-full appearance-none px-4 py-3.5 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300/60 transition-all duration-300 shadow-sm hover:shadow-md text-slate-700 font-light cursor-pointer"
            >
              <option value="">All Categories</option>
              <option value="Web Development">Web Development</option>
              <option value="Data Science">Data Science</option>
              <option value="Mobile Development">Mobile Development</option>
              <option value="Design">Design</option>
              <option value="Business">Business</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {isFiltering && (
          <div className="flex justify-center mb-8">
            <Loader size="md" text="Filtering courses..." />
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader size="lg" text="Loading courses..." />
          </div>
        ) : error ? (
          <div className="max-w-2xl mx-auto">
            <Message variant="danger">
              {error?.data?.message || 'Failed to load courses'}
            </Message>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-slate-200/60 p-12 max-w-md mx-auto">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <p className="text-slate-500 text-lg font-light mb-2">No courses found</p>
              <p className="text-slate-400 text-sm font-light">Try adjusting your search or filters</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mb-12">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="group bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-1 hover:border-blue-200/60 w-full max-w-sm mx-auto flex flex-col overflow-hidden"
                >
                  <Link to={`/courses/${course._id}`} className="flex flex-col h-full">
                    <div className="relative overflow-hidden rounded-t-3xl">
                      <img
                        src={course.image}
                        alt={course.title}
                        loading="lazy"
                        decoding="async"
                        width="400"
                        height="208"
                        className="w-full h-48 sm:h-52 object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 border border-slate-200/50 shadow-sm">
                        <span className="text-amber-500 text-sm font-medium flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {course.rating?.toFixed(1) || '4.5'}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-lg sm:text-xl font-medium text-slate-800 mb-3 line-clamp-2 min-h-[3rem] group-hover:text-blue-700 transition-colors duration-300 leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-slate-500 text-sm sm:text-base mb-6 line-clamp-2 min-h-[2.5rem] leading-relaxed font-light">
                        {course.description}
                      </p>

                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                        <span className="text-xl sm:text-2xl font-medium text-slate-800">
                          <span className="text-blue-600 font-light">$</span>{course.price.toFixed(2)}
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            <Pagination
              page={page}
              pages={totalPages}
              onPageChange={(newPage) => setPage(newPage)}
              className="flex justify-center"
            />
          </>
        )}

        {userInfo && userInfo.role === 'instructor' && (
          <Link
            to="/add-course"
            className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 hover:scale-110 z-50 flex items-center justify-center group"
            aria-label="Add new course"
          >
            <svg
              className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
};

export default CoursesScreen;