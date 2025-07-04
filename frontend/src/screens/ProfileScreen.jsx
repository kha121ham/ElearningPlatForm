import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useProfileMutation } from "../slices/usersApiSlice";
import { useGetMyOrdersQuery } from "../slices/ordersApiSlices";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { setCredential } from "../slices/authSlice";
import { Link } from "react-router-dom";

const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

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
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40">
      <div className="container mx-auto px-2 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-slate-800 mb-2 leading-tight">
            My Profile
          </h1>
          <p className="text-slate-600 font-light">Manage your account settings and view your orders</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
              {/* Profile Header */}
              <div className="bg-gradient-to-r from-blue-500/90 to-indigo-600/90 p-8 text-center">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-medium">
                    {userInfo?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <h2 className="text-white text-xl font-medium mb-1">Profile Settings</h2>
                <p className="text-blue-100 text-sm font-light">Update your personal information</p>
              </div>

              {/* Profile Form */}
              <div className="p-8">
                <form onSubmit={submitHandler} className="space-y-6">
                  <div>
                    <label className="block text-slate-700 font-medium mb-3 text-sm">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full p-4 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300/60 transition-all duration-300 font-light placeholder-slate-400"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-3 text-sm">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="w-full p-4 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300/60 transition-all duration-300 font-light placeholder-slate-400"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-3 text-sm">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full p-4 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300/60 transition-all duration-300 font-light placeholder-slate-400"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter new password (optional)"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-3 text-sm">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      className="w-full p-4 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-300/60 transition-all duration-300 font-light placeholder-slate-400"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-3 text-sm">
                      Account Type
                    </label>
                    <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-200/40">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${role === "student"
                            ? 'bg-blue-100'
                            : 'bg-emerald-100'
                          }`}>
                          <svg className={`w-4 h-4 ${role === "student"
                              ? 'text-blue-600'
                              : 'text-emerald-600'
                            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {role === "student" ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            )}
                          </svg>
                        </div>
                        <div>
                          <p className="text-slate-800 font-medium">
                            {role === "student" ? "Student" : "Instructor"}
                          </p>
                          <p className="text-slate-500 text-sm font-light">
                            {role === "student" ? "Learning account" : "Teaching account"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Update Button */}
                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={updatingProfile}
                  >
                    {updatingProfile ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader />
                        <span>Updating...</span>
                      </div>
                    ) : (
                      "Update Profile"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Orders Section */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-sm p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-medium text-slate-800">Order History</h3>
              </div>

              {loadingOrders ? (
                <div className="flex justify-center py-12">
                  <Loader text="Loading your orders..." />
                </div>
              ) : ordersError ? (
                <div className="bg-red-50/80 backdrop-blur-sm rounded-2xl border border-red-200/60 p-6 text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <Message variant="danger">
                    {ordersError?.data?.Message || ordersError.error}
                  </Message>
                </div>
              ) : Array.isArray(orders) && orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Link
                      key={order._id}
                      to={`/order/${order._id}`}
                      className="block bg-slate-50/50 rounded-2xl p-6 border border-slate-200/40 hover:bg-slate-50 hover:shadow-md transition-all duration-300 group"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                              <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-slate-800 font-medium">
                                Order #{order._id.slice(-8).toUpperCase()}
                              </p>
                              <p className="text-slate-500 text-sm font-light">
                                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {order.isPaid ? (
                            <div className="inline-flex items-center gap-2 bg-emerald-50/80 backdrop-blur-sm border border-emerald-200/40 rounded-full px-4 py-2">
                              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                              <span className="text-emerald-700 text-sm font-medium">Paid</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center gap-2 bg-amber-50/80 backdrop-blur-sm border border-amber-200/40 rounded-full px-4 py-2">
                              <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                              <span className="text-amber-700 text-sm font-medium">Pending</span>
                            </div>
                          )}

                          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                  </div>
                  <p className="text-slate-500 font-light text-lg">No orders yet</p>
                  <p className="text-slate-400 text-sm font-light mt-1">Your purchase history will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;