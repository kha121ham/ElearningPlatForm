import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import { useGetCoursesQuery } from '../slices/coursesApiSlice';
import Loader from '../components/Loader';
import Message from '../components/Message';
import Pagination from '../components/Pagination'; 
import { useSelector } from 'react-redux';

const CoursesScreen = () => {
  
const { userInfo } = useSelector((state)=>state.auth);

  const [page, setPage] = useState(1); 
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  const { data, isLoading, error } = useGetCoursesQuery({
    page,
    category,
    search,
  });

  // Check if data is available and has the expected structure
  const courses = data?.courses || [];
  const totalPages = data?.pages || 1; // Total pages for pagination

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Explore Our Courses</h1>
        <p className="text-gray-600 mt-2">Learn something new today!</p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1); // Reset to the first page when filters change
          }}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          <option value="Web Development">Web Development</option>
          <option value="Data Science">Data Science</option>
          <option value="Mobile Development">Mobile Development</option>
          <option value="Design">Design</option>
          <option value="Business">Business</option>
        </select>

        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset to the first page when search changes
          }}
          className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow"
        />
      </div>

      {/* Course List */}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || 'Failed to load courses'}</Message>
      ) : courses.length === 0 ? (
        <Message variant="info">No courses found.</Message>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800">{course.title}</h2>
                  <p className="text-gray-600 mt-2">{course.description}</p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-gray-700 font-bold">${course.price}</span>
                    <Link
                      to={`/courses/${course._id}`}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      View Course
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            page={page}
            pages={totalPages}
            onPageChange={(newPage) => setPage(newPage)} // Update page state
            className="mt-8"
          />
        </>
      )}

      { userInfo && userInfo.role === 'instractor' && (
        <Link
        to="/add-course" // Link to the "Add Course" page
        className="fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </Link>
      ) }
    </div>
  );
};

export default CoursesScreen;