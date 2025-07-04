import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Loader from './Loader';
import Message from './Message';
import { useGetTopCoursesQuery } from '../slices/coursesApiSlice';

const CourseCarousel = () => {
  const { data: courses, isLoading, error } = useGetTopCoursesQuery();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!courses || courses.length === 0 || !isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % courses.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [courses, isAutoPlaying]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + courses.length) % courses.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % courses.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader size="lg" text="Loading featured courses..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <Message variant="danger">
          {error?.data?.message || "Failed to load featured courses"}
        </Message>
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 mb-8">
        <Message variant="info">
          No featured courses available at the moment.
        </Message>
      </div>
    );
  }

  return (
    <div className="relative w-full mb-12 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-light text-slate-700 mb-3 tracking-tight">
            <span className="font-medium">Featured</span> Course
          </h2>
          <p className="text-slate-500 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Discover our handpicked course of the week
          </p>
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur-sm border border-slate-200/60 shadow-lg shadow-slate-200/40">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {courses.map((course, index) => (
              <div key={course._id} className="w-full flex-shrink-0 relative">
                <Link
                  to={`/courses/${course._id}`}
                  className="block group"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      loading="lazy"
                      decoding="async"
                      width="1200"
                      height="384"
                      className="w-full h-64 sm:h-80 lg:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>

                    <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 border border-slate-200/50 shadow-lg">
                      <span className="text-amber-500 text-sm font-medium flex items-center gap-2">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {course.rating.toFixed(1)}
                      </span>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                      <div className="max-w-3xl">
                        <h3 className="text-xl sm:text-2xl lg:text-3xl font-medium text-white mb-3 leading-tight group-hover:text-blue-200 transition-colors duration-300">
                          {course.title}
                        </h3>
                        <p className="text-slate-200 text-sm sm:text-base mb-4 line-clamp-2 leading-relaxed font-light">
                          {course.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl sm:text-3xl font-medium text-white">
                            <span className="text-blue-300 font-light">$</span>{course.price.toFixed(2)}
                          </span>
                          <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                            <span className="text-white text-sm font-medium">View Course</span>
                            <svg className="w-4 h-4 text-white transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {courses.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full border border-slate-200/60 shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 group z-10"
                aria-label="Previous course"
              >
                <svg className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors duration-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full border border-slate-200/60 shadow-lg hover:bg-white hover:shadow-xl transition-all duration-300 group z-10"
                aria-label="Next course"
              >
                <svg className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors duration-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {courses.length > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            {courses.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                    ? 'bg-blue-500 shadow-lg shadow-blue-500/30'
                    : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {courses.length > 1 && (
          <div className="flex justify-center mt-4">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-light">
              <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-green-400 animate-pulse' : 'bg-slate-300'}`}></div>
              <span>{isAutoPlaying ? 'Auto-playing' : 'Paused'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseCarousel;