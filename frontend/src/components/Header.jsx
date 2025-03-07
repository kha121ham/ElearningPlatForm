import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // حالة القائمة المنسدلة
  const dropdownRef = useRef(null); // مرجع للقائمة المنسدلة

  // إغلاق القائمة المنسدلة عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav className='bg-white shadow'>
        <div className='container mx-auto px-6 py-4 flex justify-between items-center max-w-screen-xl'>
          <div className='text-3xl font-bold text-gray-800'>
            <Link to='/'>eLearning</Link>
          </div>
          {userInfo ? (
            <div className='relative' ref={dropdownRef}>
              {/* Dropdown Button */}
              <button
                className='flex items-center focus:outline-none'
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <span className='text-gray-700 hover:text-gray-900 text-lg'>
                  Hi, {userInfo.name}
                </span>
                <svg
                  className='w-4 h-4 ml-2'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M19 9l-7 7-7-7'
                  ></path>
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div
                  className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 transition-opacity duration-300 ${
                    isDropdownOpen
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                >
                  <Link
                    to='/profile'
                    className='block px-4 py-2 text-gray-700 hover:bg-gray-100'
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={logoutHandler}
                    className='block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100'
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <Link
                to='/login'
                className='text-gray-700 hover:text-gray-900 text-lg'
              >
                Log In
              </Link>
            </div>
          )}
        </div>
      </nav>

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

      {/* Main Content */}
      <main className='container mx-auto px-6 py-12 max-w-screen-xl'>
        <div className='flex space-x-6 justify-center'>
          <Link
            to='/home'
            className='text-gray-700 hover:text-gray-900 text-lg'
          >
            Home
          </Link>
          <Link
            to='/courses'
            className='text-gray-700 hover:text-gray-900 text-lg'
          >
            Courses
          </Link>
          <Link
            to='/about'
            className='text-gray-700 hover:text-gray-900 text-lg'
          >
            About
          </Link>
          <Link to='/g' className='text-gray-700 hover:text-gray-900 text-lg'>
            Gift Card
          </Link>
          <Link to='/c' className='text-gray-700 hover:text-gray-900 text-lg'>
            Contact
          </Link>
        </div>
      </main>
    </>
  );
};

export default Header;
