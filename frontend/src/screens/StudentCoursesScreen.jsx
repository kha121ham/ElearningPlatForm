import { useSelector } from "react-redux";
import { useGetStudentCoursesQuery } from "../slices/coursesApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const StudentCoursesScreen = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

    useEffect(() => {
        // Only check authentication once when component mounts
        if (!hasCheckedAuth) {
            if (!userInfo) {
                navigate("/login?redirect=/student-courses");
                return;
            }

            setHasCheckedAuth(true);
        }
    }, [userInfo, navigate, hasCheckedAuth]);

    const {
        data: courses,
        isLoading,
        error,
    } = useGetStudentCoursesQuery(undefined, {
        skip: !userInfo || !hasCheckedAuth
    });

    // Show loading while checking authentication or if user is not authenticated
    if (!hasCheckedAuth || !userInfo) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center">
                <Loader size="lg" text="Loading..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-slate-800 mb-2 leading-tight">
                        My Learning Journey
                    </h1>
                    <p className="text-slate-600 font-light">Continue your progress and explore your enrolled courses</p>
                </div>

                {/* Courses Section */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-sm p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-medium text-slate-800">Enrolled Courses</h2>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <Loader size="lg" text="Loading your courses..." />
                        </div>
                    ) : error ? (
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-red-50/80 backdrop-blur-sm rounded-3xl border border-red-200/60 p-8 text-center">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <Message variant="danger">
                                    {error?.data?.message || error.error || "Failed to load courses"}
                                </Message>
                            </div>
                        </div>
                    ) : Array.isArray(courses) && courses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {courses.map((course) => (
                                <Link
                                    key={course._id}
                                    to={`/courses/${course._id}`}
                                    className="group"
                                >
                                    <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                                        {/* Course Image */}
                                        <div className="relative overflow-hidden">
                                            <img
                                                src={course.image}
                                                alt={course.title}
                                                loading="lazy"
                                                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                            {/* Rating Badge */}
                                            {course.rating && (
                                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 border border-slate-200/50 shadow-sm">
                                                    <div className="flex items-center gap-1">
                                                        <svg className="w-3 h-3 text-amber-400 fill-current" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                        <span className="text-slate-700 text-xs font-medium">
                                                            {course.rating.toFixed(1)}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Course Content */}
                                        <div className="p-6">
                                            <h3 className="text-lg font-medium text-slate-800 mb-3 leading-tight group-hover:text-blue-700 transition-colors duration-300">
                                                {course.title}
                                            </h3>

                                            <p className="text-slate-600 text-sm font-light leading-relaxed mb-4 line-clamp-2">
                                                {course.description}
                                            </p>

                                            {/* Course Footer */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-slate-500 text-xs font-medium">Enrolled</span>
                                                </div>

                                                {course.price && (
                                                    <div className="text-right">
                                                        <span className="text-lg font-medium text-slate-800">
                                                            <span className="text-blue-600 font-light">$</span>
                                                            {course.price.toFixed(2)}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Continue Learning Button */}
                                            <div className="mt-4 pt-4 border-t border-slate-200/40">
                                                <div className="flex items-center justify-center gap-2 text-blue-600 group-hover:text-blue-700 transition-colors duration-300">
                                                    <span className="text-sm font-medium">Continue Learning</span>
                                                    <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium text-slate-800 mb-2">No courses enrolled yet</h3>
                            <p className="text-slate-500 font-light mb-6">Start your learning journey by exploring our course catalog</p>

                            <Link
                                to="/courses"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 hover:shadow-lg"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <span>Browse Courses</span>
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            <style jsx>{`
                .line-clamp-2 {
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};

export default StudentCoursesScreen;