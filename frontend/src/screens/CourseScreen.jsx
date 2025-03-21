import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  useGetCourseDetailsQuery,
  useGetCourseContentsQuery,
  useCreateReviewMutation,
} from "../slices/coursesApiSlice";
import Loader from "../components/Loader";
import { addToCart } from "../slices/cartSlice";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaPlus, FaChevronDown, FaChevronUp } from "react-icons/fa";

const CourseScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: courseId } = useParams();
  const { userInfo } = useSelector((state) => state.auth);

  const {
    data: course,
    refetch,
    isLoading,
    error,
  } = useGetCourseDetailsQuery(courseId);

  const isEnrolled = course
    ? course.enrolledStudents.includes(userInfo?._id)
    : false;

  const isInstructor =
    course &&
    (course.instructor?._id === userInfo?._id || course.instructor === userInfo?._id);
    console.log(course)

  const canAccessContent = isEnrolled || isInstructor || (userInfo && userInfo.isAdmin);

  const { data: content, isLoading: loadingContent } =
    useGetCourseContentsQuery(courseId);


  // State for review form
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // Create review mutation
  const [createReview, { isLoading: loadingReview }] = useCreateReviewMutation();

  // Check if the user has already reviewed the course
  const hasReviewed = course?.reviews?.some(
    (review) => review.user.toString() === userInfo?._id.toString()
  );

  // State to manage visibility of videos for each section
  const [expandedSections, setExpandedSections] = useState({});

  const handleBuyNow = () => {
    dispatch(addToCart({ ...course }));
    navigate("/login?redirect=/cart");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  // Handle review submission
  const submitReview = async (e) => {
    e.preventDefault();

    try {
      const reviewData = {
        courseId,
        rating,
        comment,
      };

      await createReview(reviewData).unwrap();
      toast.success("Review added successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add review");
    }
  };

  // Toggle visibility of videos for a section
  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <div className="text-center text-red-600">
          Error loading course details.
        </div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {course.title}
          </h1>

          {/* Course Description */}
          <p className="text-gray-600 text-lg mb-6">{course.description}</p>

          {/* Course Details */}
          <div className="space-y-2 mb-6">
            <p className="text-gray-700">
              <span className="font-semibold">Instructor:</span>{" "}
              {course.instructor.name}
            </p>
          </div>

          {/* Conditional Rendering Based on Enrollment Status */}
          {canAccessContent ? (
            <div className="bg-green-50 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-semibold text-green-800 mb-4">
                Course Content...
              </h2>
              <div className="space-y-4">
                {loadingContent ? (
                  <Loader />
                ) : (
                  <>
                    {/* Course Content */}
                    {content &&
                      content.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="mb-6">
                          {/* Section Title with Toggle Button */}
                          <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => toggleSection(section._id)}
                          >
                            <h3 className="text-lg font-semibold text-gray-900">
                              {section.sectionName}
                            </h3>
                            <span className="text-blue-600">
                              {expandedSections[section._id] ? (
                                <FaChevronUp />
                              ) : (
                                <FaChevronDown />
                              )}
                            </span>
                          </div>

                          {/* Videos in the Section (Conditionally Rendered) */}
                          {expandedSections[section._id] && (
                            <ul className="mt-2 space-y-2">
                              {section.videos.map((video, videoIndex) => (
                                <Link
                                  to={`/courses/${courseId}/video/${video._id}`}
                                  key={videoIndex}
                                  className="block p-3 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                                >
                                  {/* Video Title */}
                                  <h4 className="text-lg font-semibold text-gray-900">
                                    {video.title}
                                  </h4>

                                  {/* Video Description */}
                                  <p className="text-sm text-gray-600">
                                    {video.description}
                                  </p>
                                </Link>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}

                                          {/* Add Content Button for Instructors */}
                    {isInstructor && (
                      <Link
                        to={`/courses/${courseId}/add-content`}
                        className="flex items-center justify-center w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
                      >
                        <FaPlus className="mr-2" size={20} />
                        Add Content
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
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
          )}

          {/* Reviews Section */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Reviews
            </h3>
            {course.reviews && course.reviews.length > 0 ? (
              <div className="space-y-4">
                {course.reviews.map((review, index) => (
                  <div key={index} className="border p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <span className="font-semibold text-gray-700">
                        {review.name}
                      </span>
                      <span className="ml-2 text-yellow-500">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </span>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No reviews</p>
            )}

            {/* Add Review Form (Only for enrolled users who haven't reviewed yet) */}
            {isEnrolled && !hasReviewed &&  (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Add a Review
                </h3>
                <form onSubmit={submitReview}>
                  {/* Rating Input */}
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">
                      Rating
                    </label>
                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full p-2 border rounded-lg"
                      required
                    >
                      <option value={0}>Select Rating</option>
                      <option value={1}>1 - Poor</option>
                      <option value={2}>2 - Fair</option>
                      <option value={3}>3 - Good</option>
                      <option value={4}>4 - Very Good</option>
                      <option value={5}>5 - Excellent</option>
                    </select>
                  </div>

                  {/* Comment Input */}
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">
                      Comment
                    </label>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                      rows="4"
                      required
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loadingReview}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
                  >
                    {loadingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CourseScreen;