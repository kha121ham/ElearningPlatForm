import {
  useGetInstructorCoursesQuery,
  useDeleteInstructorCourseMutation,
} from "../../slices/coursesApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const MyCoursesScreen = () => {
  const {
    data: courses,
    isLoading,
    error,
    refetch,
  } = useGetInstructorCoursesQuery();
  const [deleteCourse] = useDeleteInstructorCourseMutation();

  const handleDeleteCourse = async (courseId) => {
    toast.info(
      <div>
        <p>Are you sure you want to delete this course?</p>
        <div className="flex gap-2 mt-2">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
            onClick={() => {
              confirmDelete(courseId);
              toast.dismiss();
            }}
          >
            Yes
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
            onClick={() => toast.dismiss()}
          >
            No
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeButton: false,
      }
    );
  };

  const confirmDelete = async (courseId) => {
    try {
      await deleteCourse(courseId).unwrap();
      refetch();
      toast.success("Course deleted successfully");
    } catch (err) {
      toast.error("Failed to delete course");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <div className="container mx-auto px-2 sm:px-4 lg:px-8 py-6 sm:py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-slate-800 mb-2 leading-tight">
            My Courses
          </h1>
          <p className="text-slate-600 font-light">Manage and track your published courses</p>
        </div>

        {/* Main Content */}
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
                {error?.data?.message || "Failed to load courses"}
              </Message>
            </div>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-slate-800 mb-2">No courses created yet</h3>
            <p className="text-slate-500 font-light mb-6">Start sharing your knowledge by creating your first course</p>

            <Link
              to="/add-course"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 hover:shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create Course</span>
            </Link>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="bg-gradient-to-r from-slate-50/80 to-blue-50/40 p-6 border-b border-slate-200/40">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h2 className="text-lg font-medium text-slate-800">Course Management</h2>
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50/50">
                  <tr>
                    <th className="py-4 px-6 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Course ID</th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Course Name</th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Instructor</th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Category</th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Rating</th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Students</th>
                    <th className="py-4 px-6 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/40">
                  {courses?.map((course, index) => (
                    <tr
                      key={course._id}
                      className={`hover:bg-slate-50/50 transition-all duration-300 ${index % 2 === 0 ? 'bg-white/50' : 'bg-slate-50/20'
                        }`}
                    >
                      <td className="py-4 px-6">
                        <span className="text-slate-500 text-sm font-mono">
                          #{course._id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <Link
                          to={`/courses/${course._id}`}
                          className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300 hover:underline"
                        >
                          {course.title}
                        </Link>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-slate-700 font-light">{course.instructor.name}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/40">
                          {course.category}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="text-slate-700 text-sm font-medium">
                            {course.rating ? course.rating.toFixed(1) : 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <span className="text-slate-700 text-sm font-medium">
                            {course.enrolledStudents.length}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <button
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-200/60 rounded-xl hover:bg-red-100 hover:border-red-300/60 transition-all duration-300 text-sm font-medium"
                          onClick={() => handleDeleteCourse(course._id)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden p-6 space-y-4">
              {courses?.map((course) => (
                <div
                  key={course._id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <Link
                        to={`/courses/${course._id}`}
                        className="text-lg font-medium text-blue-600 hover:text-blue-700 transition-colors duration-300 hover:underline"
                      >
                        {course.title}
                      </Link>
                      <p className="text-slate-500 text-sm font-light mt-1">
                        ID: #{course._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <button
                      className="inline-flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 border border-red-200/60 rounded-xl hover:bg-red-100 hover:border-red-300/60 transition-all duration-300 text-sm font-medium"
                      onClick={() => handleDeleteCourse(course._id)}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-slate-500 font-medium mb-1">Instructor</p>
                      <p className="text-slate-700 font-light">{course.instructor.name}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 font-medium mb-1">Category</p>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/40">
                        {course.category}
                      </span>
                    </div>
                    <div>
                      <p className="text-slate-500 font-medium mb-1">Rating</p>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-slate-700 font-medium">
                          {course.rating ? course.rating.toFixed(1) : 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-slate-500 font-medium mb-1">Students</p>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <span className="text-slate-700 font-medium">
                          {course.enrolledStudents.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Course Button */}
        {courses && courses.length > 0 && (
          <div className="mt-8 text-center">
            <Link
              to="/add-course"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 hover:shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Create New Course</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCoursesScreen;