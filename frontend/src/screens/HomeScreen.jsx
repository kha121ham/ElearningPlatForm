import { useEffect } from "react";
import { useGetTopCoursesQuery } from "../slices/coursesApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Link } from "react-router-dom";

const HomeScreen = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { data: courses, isLoading, error } = useGetTopCoursesQuery();

  return (
    <>
      {/* Header Section */}
      <header className='bg-white py-16 mt-4'>
        <div className='container mx-auto px-6 text-center max-w-screen-xl'>
          <h1 className='text-5xl font-bold text-gray-800 mb-4'>
            E-Learning Platform
          </h1>
          <p className='text-xl text-gray-600'>
            Learn anything, anytime, anywhere.
          </p>
        </div>
      </header>
      <section className="pt-16 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-12 text-center">
          Top Sellers
        </h2>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6">
            {Array.isArray(courses) && courses.length > 0 ? (
              courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-2 w-72"
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
                          ${course.price.toFixed(2)}
                        </span>
                        <span className="text-sm text-yellow-500 flex items-center">
                          {course.rating} ⭐
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">No courses available.</p>
            )}
          </div>
        )}
      </section>
    </>
  );
};

export default HomeScreen;