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
      
      <section className="pt-16 bg-gray-50"> 
        
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Top Sellers
        </h2>

        
        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 w-72"
              >
                <Link to={`/courses/${course._id}`}>
                  
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />

                  {/* Course Details */}
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {course.title}
                    </h3>
                    <p className="text-base text-gray-600 mb-4">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">
                        ${course.price.toFixed(2)}
                      </span>
                      <span className="text-base text-gray-600">
                        {course.rating} ⭐
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default HomeScreen;