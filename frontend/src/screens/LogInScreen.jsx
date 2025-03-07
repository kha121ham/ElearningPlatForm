import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import { useLoginMutation } from '../slices/usersApiSlice';
import { setCredential } from '../slices/authSlice';
import { toast } from "react-toastify";
import Loader from "../components/Loader";

const LogInScreen = () => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
    window.scrollTo({
      top: 500, // Scroll to the bottom of the page
      behavior: 'smooth', // Smooth scrolling animation
    });
  }, [userInfo, redirect, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredential({ ...res }));
      navigate(redirect);
    } catch (err) {
      if (err.data?.message === 'Invalid email or password') {
        toast.error('Invalid email or password');
      } else {
        toast.error('An error occurred. Please try again.');
      }
    }
  };

  return (
    <FormContainer>
      <form className="bg-white p-8 rounded-lg shadow-lg" onSubmit={submitHandler}>
        <div className="bg-gray-100 font-sans min-h-screen flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Log In</h2>

            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 text-lg mb-2">Email</label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 text-lg mb-2">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-lg"
            >
              {isLoading ? 'Logging In...' : 'Log In'}
            </button>

            {isLoading && (
              <div className="mt-4 flex justify-center">
                <Loader />
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link to="/register" className="text-blue-500 hover:text-blue-600">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </form>
    </FormContainer>
  );
};

export default LogInScreen;