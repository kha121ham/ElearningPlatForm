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
        <p>Are you sure to delete this course...?</p>
        <div className='flex gap-2 mt-2'>
          <button
            className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
            onClick={() => {
              confirmDelete(courseId);
              toast.dismiss();
            }}
          >
            Yes
          </button>
          <button
            className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600'
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
      toast.error("Faild to delete course");
    }
  };
  console.log(isLoading);

  return isLoading ? <Loader /> : error ? (
    <Message variant="danger">{error?.data?.message || 'Failed to load courses'}</Message>
  ) : courses.length === 0 ? (
    <Message variant="info">No courses found.</Message>
  ) : (
<div className="container mx-auto p-4">
<h1 className="text-3xl font-bold text-center mb-8">Admin Course Management</h1>

{/* Course Table */}
<div className="bg-white shadow-md rounded-lg overflow-hidden">
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
        <tr key={course._id} className="border-b">
          <td className="py-3 px-4">{course._id}</td>
          <Link to={`/courses/${course._id}`}>
          <td className="py-3 px-4">{course.title}</td>
          </Link>
          <td className="py-3 px-4">{course.instructor.name}</td>
          <td className="py-3 px-4">{course.category}</td>
          <td className="py-3 px-4">{course.rating}</td>
          <td className="py-3 px-4">{course.enrolledStudents.length}</td>
          <td className="py-3 px-4">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
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
