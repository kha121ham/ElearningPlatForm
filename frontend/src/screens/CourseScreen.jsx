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
import { useCourseIsPendingQuery } from "../slices/coursesApiSlice";

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

  const { data: isPending, isLoading: pendingLoading } = useCourseIsPendingQuery(courseId);

  const isEnrolled = course
    ? course.enrolledStudents.includes(userInfo?._id)
    : false;

  const isInstructor =
    course &&
    (course.instructor?._id === userInfo?._id || course.instructor === userInfo?._id);

  const canAccessContent = isEnrolled || isInstructor || (userInfo && userInfo.isAdmin);

  const { data: content, isLoading: loadingContent } =
    useGetCourseContentsQuery(courseId);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [expandedSections, setExpandedSections] = useState({});
  const [createReview, { isLoading: loadingReview }] = useCreateReviewMutation();

  const hasReviewed = course?.reviews?.some(
    (review) => review.user.toString() === userInfo?._id.toString()
  );

  const averageRating =
    course?.reviews?.length > 0
      ? course.reviews.reduce((acc, review) => acc + review.rating, 0) /
      course.reviews.length
      : 0;

  const handleBuyNow = () => {
    dispatch(addToCart({ ...course }));
    navigate("/login?redirect=/cart");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

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

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader size="lg" text="Loading course details..." />
        </div>
      ) : error ? (
        <div className="max-w-2xl mx-auto px-4 py-20">
          <div className="bg-red-50/80 backdrop-blur-sm rounded-3xl border border-red-200/60 p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-red-700 text-lg font-medium">Error loading course details</p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
          <div className="container mx-auto px-2 sm:px-4 lg:px-8 py-6 sm:py-8 max-w-6xl">
            <button
              onClick={handleGoBack}
              className="mb-8 flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-all duration-300 font-medium group"
            >
              <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back to Courses</span>
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
                  <div className="relative">
                    <img
                      src={course.image}
                      alt={course.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full max-w-full h-64 sm:h-80 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>

                    <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 border border-slate-200/50 shadow-sm">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < Math.round(averageRating) ? 'text-amber-400 fill-current' : 'text-slate-300'}`}
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-slate-600 text-sm font-medium">
                          {averageRating.toFixed(1)} ({course.reviews?.length || 0})
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-slate-800 mb-4 leading-tight">
                      {course.title}
                    </h1>

                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {course.instructor.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-slate-600 text-sm font-light">Instructor</p>
                        <p className="text-slate-800 font-medium">{course.instructor.name}</p>
                      </div>
                    </div>

                    <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-light">
                      {course.description}
                    </p>
                  </div>
                </div>

                {canAccessContent && (
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-sm p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <h2 className="text-xl sm:text-2xl font-medium text-slate-800">Course Content</h2>
                    </div>

                    {loadingContent ? (
                      <div className="flex justify-center py-8">
                        <Loader text="Loading course content..." />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {content?.map((section, sectionIndex) => (
                          <div key={sectionIndex} className="border border-slate-200/60 rounded-2xl overflow-hidden">
                            <button
                              className="w-full flex items-center justify-between p-6 bg-slate-50/50 hover:bg-slate-50 transition-colors duration-300 text-left"
                              onClick={() => toggleSection(section._id)}
                            >
                              <h3 className="text-lg font-medium text-slate-800">
                                {section.sectionName}
                              </h3>
                              <svg
                                className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${expandedSections[section._id] ? 'rotate-180' : ''
                                  }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>

                            {expandedSections[section._id] && (
                              <div className="border-t border-slate-200/60">
                                {section.videos.map((video, videoIndex) => (
                                  <Link
                                    to={`/courses/${courseId}/video/${video._id}`}
                                    key={videoIndex}
                                    className="block p-6 border-b border-slate-100 last:border-b-0 hover:bg-blue-50/30 transition-colors duration-300 group"
                                  >
                                    <div className="flex items-start gap-4">
                                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors duration-300">
                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-6-8h1m4 0h1M9 6h6" />
                                        </svg>
                                      </div>
                                      <div className="flex-1">
                                        <h4 className="text-base font-medium text-slate-800 mb-1 group-hover:text-blue-700 transition-colors duration-300">
                                          {video.title}
                                        </h4>
                                        <p className="text-sm text-slate-500 font-light leading-relaxed">
                                          {video.description}
                                        </p>
                                      </div>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}

                        {isInstructor && (
                          <Link
                            to={`/courses/${courseId}/add-content`}
                            className="flex items-center justify-center gap-3 w-full p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 hover:shadow-lg group"
                          >
                            <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            <span className="font-medium">Add Content</span>
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-sm p-8">
                  <h3 className="text-xl sm:text-2xl font-medium text-slate-800 mb-6">
                    Student Reviews
                  </h3>

                  {course.reviews && course.reviews.length > 0 ? (
                    <div className="space-y-6">
                      {course.reviews.map((review, index) => (
                        <div key={index} className="bg-slate-50/50 rounded-2xl p-6 border border-slate-200/40">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center">
                                <span className="text-white text-sm font-medium">
                                  {review.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span className="font-medium text-slate-800">{review.name}</span>
                            </div>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${i < review.rating ? 'text-amber-400 fill-current' : 'text-slate-300'}`}
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <p className="text-slate-600 font-light leading-relaxed">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <p className="text-slate-500 font-light">No reviews yet</p>
                      <p className="text-slate-400 text-sm font-light mt-1">Be the first to share your experience</p>
                    </div>
                  )}

                  {isEnrolled && !hasReviewed && (
                    <div className="mt-8 pt-8 border-t border-slate-200/60">
                      <h4 className="text-lg font-medium text-slate-800 mb-6">Share Your Experience</h4>
                      <form onSubmit={submitReview} className="space-y-6">
                        <div>
                          <label className="block text-slate-700 font-medium mb-3">Rating</label>
                          <select
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            className="w-full p-4 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300/60 transition-all duration-300 font-light"
                            required
                          >
                            <option value={0}>Select a rating</option>
                            <option value={1}>1 - Poor</option>
                            <option value={2}>2 - Fair</option>
                            <option value={3}>3 - Good</option>
                            <option value={4}>4 - Very Good</option>
                            <option value={5}>5 - Excellent</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-slate-700 font-medium mb-3">Your Review</label>
                          <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full p-4 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300/60 transition-all duration-300 font-light resize-none"
                            rows="4"
                            placeholder="Share your thoughts about this course..."
                            required
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={loadingReview}
                          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loadingReview ? "Submitting..." : "Submit Review"}
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-sm p-8">
                    {!canAccessContent ? (
                      <>
                        <div className="text-center mb-8">
                          <div className="text-3xl sm:text-4xl font-medium text-slate-800 mb-2">
                            <span className="text-blue-600 font-light">$</span>{course.price.toFixed(2)}
                          </div>
                          <p className="text-slate-500 font-light">One-time purchase</p>
                        </div>

                        {pendingLoading ? (
                          <div className="flex justify-center py-4">
                            <Loader text="Checking status..." />
                          </div>
                        ) : isPending?.isPending ? (
                          <button
                            disabled
                            className="w-full py-4 bg-amber-100 text-amber-700 rounded-2xl font-medium cursor-not-allowed border border-amber-200"
                          >
                            Purchase Pending
                          </button>
                        ) : (
                          <button
                            onClick={() => handleBuyNow(course)}
                            className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 hover:shadow-lg hover:scale-105"
                          >
                            Enroll Now
                          </button>
                        )}
                      </>
                    ) : (
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-slate-800 mb-2">You're enrolled!</h3>
                        <p className="text-slate-500 font-light">Access all course content below</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseScreen;