/* eslint-disable array-callback-return */
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useProfileMutation } from "../slices/usersApiSlice";
import { useGetMyOrdersQuery } from "../slices/ordersApiSlices";
import { useGetCoursesToAdminQuery } from "../slices/coursesApiSlice";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { setCredential } from "../slices/authSlice";
import { Link } from "react-router-dom";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password,setPassword] = useState('');
  const [confirmPassword,setConfirmPassword] = useState('');

  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Update local state when user data is fetched
  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
      setRole(userInfo.role);
    }
  }, [userInfo]);
  
  const [updateProfile, { isLoading: updatingProfile }] = useProfileMutation();
  const {
    data: orders,
    isLoading: loadingOrders,
    error: ordersError,
  } = useGetMyOrdersQuery();

  const submitHandler = async (e) => {
    e.preventDefault();
    if(password !== confirmPassword) {
      toast.error('Password do not match');
    } else {
    try {
      const res = await updateProfile({
        _id: userInfo._id,
        name,
        email,
        password,
        role,
      }).unwrap();
      dispatch(setCredential({ ...res }));
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  }
  };

  return (
    <div>
      <div className='min-h-screen bg-gray-100 p-4'>
        <div className='flex flex-col md:flex-row gap-6 max-w-6xl mx-auto'>
          {/* Profile Section */}
          <div className='bg-white shadow-lg rounded-lg p-6 w-full md:w-1/3'>
            <div className='bg-blue-500 p-6 rounded-t-lg'>
              <h2 className='text-center text-white text-2xl font-semibold mt-4'>
                User Info
              </h2>
            </div>

            {/* Profile Fields */}
            <div className='mt-6'>
              <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2'>
                  Name
                </label>
                <input
                  type='text'
                  className='w-full border border-gray-300 rounded-lg p-2'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2'>
                  Email
                </label>
                <input
                  type='email'
                  className='w-full border border-gray-300 rounded-lg p-2'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2'>
                  Password
                </label>
                <input
                  type='password'
                  className='w-full border border-gray-300 rounded-lg p-2'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2'>
                  Confirm Password
                </label>
                <input
                  type='password'
                  className='w-full border border-gray-300 rounded-lg p-2'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <div className='mb-4'>
                <label className='block text-gray-700 text-sm font-bold mb-2'>
                  Role
                </label>
                <label>{role === 'student' ? 'Student' : 'Instructor'}</label>
              </div>
            </div>

            {/* Update Button */}
            <div className='mt-6'>
              <button
                onClick={submitHandler}
                className='w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300'
                disabled={updatingProfile}
              >
                {updatingProfile ? <Loader /> : "Update Profile"}
              </button>
            </div>
          </div>

          {/* Orders Section */}
          <div className='bg-white shadow-lg rounded-lg p-6 w-full md:w-2/3'>
            <h3 className='text-xl font-semibold text-gray-800 mb-4'>
              Your Orders
            </h3>
            <div className='space-y-4'>
              {loadingOrders ? (
                <Loader />
              ) : ordersError ? (
                <Message variant='danger'>
                  {ordersError?.data?.Message || ordersError.error}
                </Message>
              ) : Array.isArray(orders) && orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order._id} className='bg-gray-50 p-4 rounded-lg'>
                    <Link to={`/order/${order._id}`}>
                      <div className='flex justify-between items-center'>
                        <p className='text-gray-900 font-medium'>
                          Order id: #{order._id}
                        </p>
                        <p className='text-sm text-gray-600'>
                          {order.isPaid ? (
                            <Message variant='success'>Paid</Message>
                          ) : (
                            <Message variant='danger'>Not Paid</Message>
                          )}
                        </p>
                      </div>
                    </Link>
                    <p className='text-sm text-gray-600'>
                      Placed on:{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <Message variant='info'>No orders found</Message>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
