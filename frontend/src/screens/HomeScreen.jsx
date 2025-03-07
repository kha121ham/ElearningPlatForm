import React from "react";

const HomeScreen = () => {
  return (
    <>
      {/* Top Sellers Section */}
      <section className='container mx-auto px-6 py-12 max-w-screen-xl'>
        <h2 className='text-3xl font-bold text-gray-800 mb-8 text-center'>
          Top Sellers
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          <div className='bg-white p-8 rounded-lg shadow-lg text-center'>
            <h3 className='text-2xl font-semibold text-gray-800 mb-4'>
              Course 1
            </h3>
            <p className='text-gray-600'>Learn the basics of programming.</p>
          </div>
          <div className='bg-white p-8 rounded-lg shadow-lg text-center'>
            <h3 className='text-2xl font-semibold text-gray-800 mb-4'>
              Course 2
            </h3>
            <p className='text-gray-600'>Master web development.</p>
          </div>
          <div className='bg-white p-8 rounded-lg shadow-lg text-center'>
            <h3 className='text-2xl font-semibold text-gray-800 mb-4'>
              Course 3
            </h3>
            <p className='text-gray-600'>Get started with data science.</p>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeScreen;
