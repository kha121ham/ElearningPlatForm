import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { logout } from "../slices/authSlice";
import { resetCart } from "../slices/cartSlice";
import SupportButton from "./SupportButton";

const Header = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

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
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-300 sticky top-0 z-40 shadow-md shadow-gray-200/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap justify-between items-center max-w-screen-xl">
          <div className="text-2xl sm:text-3xl font-semibold text-gray-900 hover:text-blue-600 transition-all duration-300 tracking-wide">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="font-semibold">eLearning</span>
            </Link>
          </div>

          <div className="flex items-center space-x-6 sm:space-x-8 text-base">
            <Link
              to="/"
              className="text-gray-800 hover:text-blue-600 font-medium transition-all duration-300 hover:scale-105 relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link>
            <Link
              to="/courses"
              className="text-gray-800 hover:text-blue-600 font-medium transition-all duration-300 hover:scale-105 relative group"
            >
              Courses
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link>
            <Link
              to="/about"
              className="text-gray-800 hover:text-blue-600 font-medium transition-all duration-300 hover:scale-105 relative group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:w-full transition-all duration-300 rounded-full"></span>
            </Link>
          </div>

          <div className="flex items-center space-x-4 sm:space-x-6">
            <Link to="/cart" className="relative group">
              <div className="p-2 rounded-xl bg-gray-100 hover:bg-blue-100 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md">
                <svg
                  className="w-5 h-5 text-gray-800 group-hover:text-blue-600 transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
              </div>
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-semibold text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-md animate-pulse">
                  {cartItems.length}
                </span>
              )}
            </Link>

            {userInfo ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  className="flex items-center gap-2 p-2 rounded-xl bg-gray-100 hover:bg-blue-100 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md group focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-md">
                    {userInfo.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-800 group-hover:text-blue-600 font-medium text-sm transition-colors duration-300 hidden sm:block">
                    {userInfo.name}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-700 group-hover:text-blue-600 transition-all duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white/98 backdrop-blur-md rounded-2xl shadow-xl shadow-gray-200/60 py-2 z-50 transition-all duration-200 border border-gray-300">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">{userInfo.name}</p>
                      <p className="text-xs text-gray-600 font-medium">{userInfo.email}</p>
                    </div>

                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-800 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </Link>
                      <Link
                        to="/student-courses"
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-800 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        My Courses
                      </Link>

                      {userInfo && userInfo.isAdmin && (
                        <div className="border-t border-gray-200 mt-2 pt-2">
                          <p className="px-4 py-1 text-xs font-semibold text-gray-600 uppercase tracking-wider">Admin</p>
                          <Link
                            to="/admin/orderlist"
                            className="flex items-center gap-3 px-4 py-2.5 text-gray-800 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            Orders
                          </Link>
                          <Link
                            to="/admin/courselist"
                            className="flex items-center gap-3 px-4 py-2.5 text-gray-800 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Courses
                          </Link>
                          <Link
                            to="/admin/userslist"
                            className="flex items-center gap-3 px-4 py-2.5 text-gray-800 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                            </svg>
                            Users
                          </Link>
                        </div>
                      )}

                      {userInfo && userInfo.role === "instructor" && (
                        <div className="border-t border-gray-200 mt-2 pt-2">
                          <p className="px-4 py-1 text-xs font-semibold text-gray-600 uppercase tracking-wider">Instructor</p>
                          <Link
                            to="/mycourses"
                            className="flex items-center gap-3 px-4 py-2.5 text-gray-800 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            My Courses
                          </Link>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-gray-200 pt-2">
                      <button
                        onClick={logoutHandler}
                        className="flex items-center gap-3 w-full px-4 py-2.5 text-gray-800 hover:text-red-600 hover:bg-red-50 transition-all duration-200 font-medium"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;