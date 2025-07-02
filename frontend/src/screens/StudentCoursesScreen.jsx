import { useSelector } from "react-redux";
import { useGetStudentCoursesQuery } from "../slices/coursesApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const StudentCoursesScreen = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        if (!userInfo || userInfo.role !== "student") {
            navigate("/login?redirect=/student-courses");
        }
        // eslint-disable-next-line
    }, [userInfo, navigate]);

    const {
        data: courses,
        isLoading,
        error,
    } = useGetStudentCoursesQuery();

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Courses Section */}
                <div className="bg-white shadow-lg rounded-lg p-6 transform transition-transform duration-300">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        My Courses
                    </h3>
                    <div className="space-y-4">
                        {isLoading ? (
                            <Loader />
                        ) : error ? (
                            <Message variant="danger">
                                {error?.data?.message || error.error || "Failed to load courses"}
                            </Message>
                        ) : Array.isArray(courses) && courses.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {courses.map((course) => (
                                    <div
                                        key={course._id}
                                        className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2"
                                    >
                                        <Link to={`/courses/${course._id}`}>
                                            <img
                                                src={course.image}
                                                alt={course.title}
                                                className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
                                            />
                                            <div className="p-5">
                                                <h3 className="text-xl font-bold text-gray-800 mb-3">
                                                    {course.title}
                                                </h3>
                                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                                    {course.description}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-lg font-bold text-gray-900">
                                                        ${course.price?.toFixed(2)}
                                                    </span>
                                                    <span className="text-sm text-yellow-500 flex items-center">
                                                        {course.rating?.toFixed(2)} ⭐
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <Message variant="info">No courses found.</Message>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentCoursesScreen;
