import React from 'react';
import { Link } from 'react-router-dom';

const NotUserOrderPage = () => {
  return (
    <div className='p-6 bg-white shadow-md rounded-lg max-w-2xl mx-auto'>
      <h1 className='text-2xl font-bold mb-4'>No Orders Found</h1>
      <div className='space-y-4'>
        {/* Message Section */}
        <div className='border-b pb-4'>
          <h2 className='text-lg font-semibold'>Oops! It seems you don't have any orders yet.</h2>
          <p className='text-gray-600'>
            If you believe this is a mistake, please check your account or contact support.
          </p>
        </div>

        {/* Call-to-Action Section */}
        <div className='pt-4'>
          <h2 className='text-lg font-semibold'>What would you like to do next?</h2>
          <div className='mt-4 space-y-4'>
            {/* Browse Courses Button */}
            <Link
              to='/'
              className='w-full flex items-center justify-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='currentColor'
                className='w-6 h-6 mr-2'
              >
                <path d='M12 2.25a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM12 21.75a.75.75 0 01-.75-.75v-1.5a.75.75 0 011.5 0V21a.75.75 0 01-.75.75zM3.75 12a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5H4.5a.75.75 0 01-.75-.75zM18.75 12a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 01.75.75zM6.697 5.636a.75.75 0 011.06 0l1.06 1.06a.75.75 0 01-1.06 1.06l-1.06-1.06a.75.75 0 010-1.06zM16.243 16.243a.75.75 0 011.06 0l1.06 1.06a.75.75 0 01-1.06 1.06l-1.06-1.06a.75.75 0 010-1.06zM5.636 17.303a.75.75 0 010-1.06l1.06-1.06a.75.75 0 011.06 1.06l-1.06 1.06a.75.75 0 01-1.06 0zM16.243 7.757a.75.75 0 010 1.06l-1.06 1.06a.75.75 0 11-1.06-1.06l1.06-1.06a.75.75 0 011.06 0z' />
              </svg>
              <span>Go Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotUserOrderPage;