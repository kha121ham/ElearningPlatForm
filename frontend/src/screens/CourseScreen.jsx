import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useGetCourseDetailsQuery } from '../slices/coursesApiSlice';
import Loader from '../components/Loader';
import { addToCart } from '../slices/cartSlice';

const CourseScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: courseId } = useParams();

  const { data: course, refetch, isLoading, error } = useGetCourseDetailsQuery(courseId);

  const handleBuyNow = () => {
    dispatch(addToCart({ ...course }));
    navigate('/login?redirect=/cart'); 
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    console.log(course);
  }, [course]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
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
          <div className="flex items-center justify-between mb-8">
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

          {/* Reviews Section */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Reviews</h3>
            {course.reviews && course.reviews.length > 0 ? (
              <div className="space-y-4">
                {course.reviews.map((review, index) => (
                  <div key={index} className="border p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="font-semibold text-gray-700">{review.name}</span>
                      <span className="ml-2 text-yellow-500">
                        {'★'.repeat(review.rating)}
                        {'☆'.repeat(5 - review.rating)}
                      </span>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No reviews</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CourseScreen;