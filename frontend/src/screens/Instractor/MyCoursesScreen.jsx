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

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">
      {error?.data?.message || "Failed to load courses"}
    </Message>
  ) : courses.length === 0 ? (
    <Message variant="info">No courses found.</Message>
  ) : (
    <div className="container mx-auto p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 animate-fade-in">
        My Courses
      </h1>

      {/* Course Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden animate-fade-in">
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Instructor</th>
              <th className="py-3 px-4 text-left">Category</th>
              <th className="py-3 px-4 text-left">Rating</th>
              <th className="py-3 px-4 text-left">Enrolled Students</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses?.map((course) => (
              <tr
                key={course._id}
                className="border-b hover:bg-gray-50 transition duration-300"
              >
                <td className="py-3 px-4">{course._id}</td>
                <td className="py-3 px-4">
                  <Link
                    to={`/courses/${course._id}`}
                    className="text-blue-500 hover:text-blue-700 transition duration-300"
                  >
                    {course.title}
                  </Link>
                </td>
                <td className="py-3 px-4">{course.instructor.name}</td>
                <td className="py-3 px-4">{course.category}</td>
                <td className="py-3 px-4">{course.rating}</td>
                <td className="py-3 px-4">{course.enrolledStudents.length}</td>
                <td className="py-3 px-4">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
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
    </div>
  );
};

export default MyCoursesScreen;