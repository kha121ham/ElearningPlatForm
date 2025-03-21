import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import { resetCart } from '../slices/cartSlice';

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Dropdown state
  const dropdownRef = useRef(null); // Dropdown reference

  // Close dropdown when clicking outside
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
      dispatch(resetCart());
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      {/* Navigation Bar */}
      <nav className='bg-white shadow'>
        <div className='container mx-auto px-6 py-4 flex justify-between items-center max-w-screen-xl'>
          {/* Logo */}
          <div className='text-3xl font-bold text-gray-800'>
            <Link to='/'>eLearning</Link>
          </div>

          {/* Navigation Links - Centered */}
          <div className='flex items-center space-x-6'>
            <Link to='/' className='text-gray-700 hover:text-gray-900 text-lg'>
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
          </div>

          {/* Cart and User Section */}
          <div className='flex items-center space-x-6'>
            {/* Cart Icon */}
            <Link to='/cart' className='relative'>
              <svg
                className='w-8 h-8 text-gray-700 hover:text-gray-900'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z'
                ></path>
              </svg>
              <span className='absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full'>
                {cartItems.length > 0 && cartItems.length}
              </span>
            </Link>

            {/* User Dropdown or Login Link */}
            {userInfo ? (
              <div className='relative' ref={dropdownRef}>
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
                    {userInfo && userInfo.isAdmin && (
                      <Link
                      to='/admin/orderlist'
                      className='block px-4 py-2 text-gray-700 hover:bg-gray-100'
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Order List
                    </Link>
                    )}

                    {userInfo && userInfo.isAdmin && (
                      <Link
                      to='/admin/courselist'
                      className='block px-4 py-2 text-gray-700 hover:bg-gray-100'
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Course List
                    </Link>
                    )}
                    {userInfo && userInfo.isAdmin && (
                      <Link
                      to='/admin/userslist'
                      className='block px-4 py-2 text-gray-700 hover:bg-gray-100'
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Users List
                    </Link>
                    )}

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
              <Link
                to='/login'
                className='text-gray-700 hover:text-gray-900 text-lg'
              >
                Log In
              </Link>
            )}
          </div>
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
    </>
  );
};

export default Header;