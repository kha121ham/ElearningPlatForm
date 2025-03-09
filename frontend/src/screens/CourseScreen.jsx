import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetCourseDetailsQuery } from '../slices/coursesApiSlice';
import Loader from '../components/Loader';

const CourseScreen = () => {
  const navigate = useNavigate(); 
  const { id: courseId } = useParams();

  const { data: course, refetch, isLoading, error } = useGetCourseDetailsQuery(courseId);
  const handleBuyNow = () => {
    alert(`You have purchased the course: ${course.title}`);
    // You can add more logic here, like redirecting to a payment page
  };
  useEffect(()=>{
    console.log(course)
  },[course])

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <>
    {isLoading ? <Loader /> : (
    
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Back Button */}
      <button
        onClick={handleGoBack}
        className="mb-4 text-blue-600 hover:text-blue-800 transition duration-300"
      >
        &larr; Back
      </button>

      {/* Course Image */}
      <div className="mb-6">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-64 object-cover rounded-lg"
        />
      </div>

      {/* Course Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>

      {/* Course Description */}
      <p className="text-gray-600 text-lg mb-6">{course.description}</p>

      {/* Course Details */}
      <div className="space-y-2 mb-6">
        <p className="text-gray-700">
          <span className="font-semibold">Instructor:</span> {course.instructor.name}
        </p>

      </div>

      {/* Price and Buy Button */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          ${course.price.toFixed(2)}
        </h2>
        <button
          onClick={handleBuyNow}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Buy Now
        </button>
      </div>
    </div>
  )}
    </>
  );
};

export default CourseScreen;