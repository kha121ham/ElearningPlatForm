import { useGetCoursesToAdminQuery, useDeleteCourseMutation } from "../../slices/coursesApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const CourseListScreen = () => {
  const { data: courses, isLoading, error, refetch } = useGetCoursesToAdminQuery();
  const [deleteCourse] = useDeleteCourseMutation();

  const handleDeleteCourse = async (courseId) => {
    toast.info(
      <div className="p-2">
        <p className="text-slate-700 font-medium mb-4">Are you sure you want to delete this course?</p>
        <div className="flex gap-3">
          <button
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl font-medium hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-300 shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/25"
            onClick={() => {
              confirmDelete(courseId);
              toast.dismiss();
            }}
          >
            Yes, Delete
          </button>
          <button
            className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl font-medium hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500/20 transition-all duration-300"
            onClick={() => toast.dismiss()}
          >
            Cancel
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

  return isLoading ? (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center">
      <Loader />
    </div>
  ) : error ? (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Message variant="danger">{error?.data?.message || "Failed to load courses"}</Message>
      </div>
    </div>
  ) : courses.length === 0 ? (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Message variant="info">No courses found.</Message>
      </div>
    </div>
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 py-6 px-2 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-light text-slate-800 mb-4 sm:mb-6 tracking-tight">
            <span className="font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Course Management
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-500 font-light max-w-2xl mx-auto leading-relaxed">
            Manage and oversee all courses in your e-learning platform
          </p>
          <div className="mt-4 sm:mt-6 flex justify-center">
            <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-60"></div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-slate-50/80 to-blue-50/40 backdrop-blur-sm border-b border-slate-200/60">
                <tr>
                  <th className="py-4 px-6 text-left text-sm font-medium text-slate-600 tracking-wide">Course ID</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-slate-600 tracking-wide">Course Name</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-slate-600 tracking-wide">Instructor</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-slate-600 tracking-wide">Category</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-slate-600 tracking-wide">Rating</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-slate-600 tracking-wide">Students</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-slate-600 tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60">
                {courses?.map((course, index) => (
                  <tr
                    key={course._id}
                    className="group hover:bg-blue-50/30 transition-all duration-300"
                  >
                    <td className="py-4 px-6">
                      <span className="text-sm text-slate-500 font-mono bg-slate-100/60 px-2 py-1 rounded-lg">
                        {course._id}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <Link
                        to={`/courses/${course._id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300 hover:underline decoration-blue-300 underline-offset-4"
                      >
                        {course.title}
                      </Link>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-slate-700 font-light">{course.instructor.name}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                        {course.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-1">
                        <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-slate-700 font-medium">{course.rating}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <span className="text-slate-700 font-medium">{course.enrolledStudents.length}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl font-medium hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:ring-offset-2 focus:ring-offset-white transition-all duration-300 shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/25 hover:-translate-y-0.5 text-sm"
                        onClick={() => handleDeleteCourse(course._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden space-y-4 p-4 sm:p-6">
            {courses?.map((course, index) => (
              <div
                key={course._id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm p-4 sm:p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
              >
                <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center mb-4 gap-2 xs:gap-4">
                  <div className="flex-1">
                    <Link
                      to={`/courses/${course._id}`}
                      className="text-base sm:text-lg font-medium text-blue-600 hover:text-blue-700 transition-colors duration-300 hover:underline decoration-blue-300 underline-offset-4 block mb-1"
                    >
                      {course.title}
                    </Link>
                    <p className="text-xs sm:text-sm text-slate-500 font-light">by {course.instructor.name}</p>
                  </div>
                  <button
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-xl font-medium hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-300 shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/25 text-xs sm:text-sm"
                    onClick={() => handleDeleteCourse(course._id)}
                  >
                    Delete
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div>
                    <span className="text-slate-500 font-light">Category:</span>
                    <div className="mt-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                        {course.category}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 font-light">Students:</span>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                      <span className="text-slate-700 font-medium">{course.enrolledStudents.length}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 font-light">Rating:</span>
                    <div className="flex items-center space-x-1 mt-1">
                      <svg className="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-slate-700 font-medium">{course.rating}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500 font-light">ID:</span>
                    <div className="mt-1">
                      <span className="text-xs text-slate-500 font-mono bg-slate-100/60 px-2 py-1 rounded-lg">
                        {course._id.slice(-8)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseListScreen;