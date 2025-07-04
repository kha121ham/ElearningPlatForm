import { useEffect } from "react";
import { useGetTopCoursesQuery } from "../slices/coursesApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Link } from "react-router-dom";

const HomeScreen = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: courses, isLoading, error } = useGetTopCoursesQuery();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <header className="relative overflow-hidden bg-white/70 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/40 via-indigo-50/30 to-purple-50/40"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center max-w-4xl">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-6 shadow-lg shadow-blue-500/25">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light text-slate-800 mb-6 tracking-tight leading-tight">
            <span className="font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              E-Learning
            </span>
            <br />
            <span className="text-slate-600 font-extralight">Platform</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-500 font-light max-w-2xl mx-auto leading-relaxed">
            Discover knowledge that transforms. Learn at your own pace with our curated collection of courses.
          </p>
          <div className="mt-8 flex justify-center">
            <div className="w-20 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-60"></div>
          </div>
        </div>
      </header>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-slate-700 mb-4 tracking-tight">
              <span className="font-medium">Featured</span> Courses
            </h2>
            <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
              Handpicked courses from industry experts to accelerate your learning journey
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader />
            </div>
          ) : error ? (
            <div className="max-w-2xl mx-auto">
              <Message variant="danger">
                {error?.data?.message || "Something went wrong"}
              </Message>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
              {Array.isArray(courses) && courses.length > 0 ? (
                courses.map((course) => (
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
                            {course.rating.toFixed(1)}
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
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-slate-200/60 p-12 max-w-md mx-auto">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <p className="text-slate-500 text-lg font-light mb-2">No courses available</p>
                    <p className="text-slate-400 text-sm font-light">New content coming soon</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;