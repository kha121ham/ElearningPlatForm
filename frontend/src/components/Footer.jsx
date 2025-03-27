import React from 'react';

const Footer = () => {
  return (
    <>
      {/* Footer */}
      <footer className="bg-white shadow mt-12">
        <div className="container mx-auto px-6 py-8 max-w-screen-xl">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Logo or Branding */}
            <div className="text-2xl font-bold text-gray-800 mb-4 md:mb-0 hover:scale-105 transition-transform duration-300">
              eLearning
            </div>

            {/* Navigation Links */}
            <div className="flex space-x-6 text-gray-700 text-lg">
              <a
                href="/contact"
                className="hover:text-gray-500 transition duration-300"
              >
                Contact
              </a>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="text-center text-gray-700 text-sm mt-6">
            &copy; 2025 eLearning. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;