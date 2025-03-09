import { Link } from 'react-router-dom';
import Loader from './Loader';
import Message from './Message';
import { useGetTopCoursesQuery } from '../slices/coursesApiSlice';

const CourseCarousel = () => {
  const { data: courses, isLoading, error } = useGetTopCoursesQuery();

  if (isLoading) return <Loader />;
  if (error) return <Message variant='danger'>{error}</Message>;

  return (
    <div className="relative w-full overflow-hidden bg-blue-500 mb-8">
      <div className="flex transition-transform duration-500 ease-in-out">
        {courses.map((course) => (
          <div key={course._id} className="w-full flex-shrink-0 relative">
            <Link to={`/course/${course._id}`}>
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-64 object-cover"
              />
            </Link>
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
              <h2 className="text-xl font-bold">
                {course.title} (${course.price.toFixed(2)})
              </h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseCarousel;