import React from "react";
import {
  useGetUsersQuery,
  useDeleteUserMutation,
} from "../../slices/usersApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const UserListScreen = () => {
  const { data: users, isLoading, error, refetch } = useGetUsersQuery();
  const [deleteUser] = useDeleteUserMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const handleDeleteUser = async (userId) => {
    toast.info(
      <div className="p-2">
        <p className="text-slate-700 font-medium mb-4">Are you sure you want to delete this user?</p>
        <div className="flex gap-3">
          <button
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl font-medium hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-300 shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/25"
            onClick={() => {
              deleteHandler(userId);
              toast.dismiss();
            }}
          >
            Yes, Delete
          </button>
          <button
            className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl font-medium hover:bg-slate-50 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-500/20 transition-all duration-300"
            onClick={() => toast.dismiss()}
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeButton: false,
      }
    );
  };

  const deleteHandler = async (userId) => {
    try {
      await deleteUser(userId).unwrap();
      toast.success("User deleted successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 py-6 px-2 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-light text-slate-800 mb-4 sm:mb-6 tracking-tight">
            <span className="font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              User Management
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-500 font-light max-w-2xl mx-auto leading-relaxed">
            Manage and oversee all users in your e-learning platform
          </p>
          <div className="mt-4 sm:mt-6 flex justify-center">
            <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-60"></div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader />
          </div>
        ) : error ? (
          <div className="max-w-2xl mx-auto">
            <Message variant="danger">
              {error.data?.message || "Failed to load users"}
            </Message>
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-slate-50/80 to-blue-50/40 backdrop-blur-sm border-b border-slate-200/60">
                  <tr>
                    <th className="py-4 px-6 text-left text-sm font-medium text-slate-600 tracking-wide">User ID</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-slate-600 tracking-wide">Name</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-slate-600 tracking-wide">Email</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-slate-600 tracking-wide">Role</th>
                    <th className="py-4 px-6 text-left text-sm font-medium text-slate-600 tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/60">
                  {users.map((user) => (
                    <tr
                      key={user._id}
                      className="group hover:bg-blue-50/30 transition-all duration-300"
                    >
                      <td className="py-4 px-6">
                        <span className="text-sm text-slate-500 font-mono bg-slate-100/60 px-2 py-1 rounded-lg">
                          {user._id.slice(-8)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center border border-blue-200/60">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <span className="text-slate-700 font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-slate-600 font-light">{user.email}</span>
                      </td>
                      <td className="py-4 px-6">
                        {user.role === "instructor" ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                            Instructor
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2"></div>
                            Student
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          {userInfo._id !== user._id && !user.isAdmin && (
                            <>
                              <Link
                                to={`/admin/edit-user/${user._id}`}
                                className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 focus:ring-offset-white transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5 text-sm"
                              >
                                Edit
                              </Link>
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-xl font-medium hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:ring-offset-2 focus:ring-offset-white transition-all duration-300 shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/25 hover:-translate-y-0.5 text-sm"
                              >
                                Delete
                              </button>
                            </>
                          )}
                          {(userInfo._id === user._id || user.isAdmin) && (
                            <span className="text-slate-400 text-sm font-light italic">
                              {userInfo._id === user._id ? "Current User" : "Protected"}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden space-y-4 p-6">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center border border-blue-200/60">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-slate-800 mb-1">{user.name}</h3>
                        <p className="text-sm text-slate-500 font-light">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {user.role === "instructor" ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200/60">
                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-1.5"></div>
                          Instructor
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1.5"></div>
                          Student
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="text-slate-500 font-light text-sm">User ID:</span>
                    <div className="mt-1">
                      <span className="text-xs text-slate-500 font-mono bg-slate-100/60 px-2 py-1 rounded-lg">
                        {user._id.slice(-8)}
                      </span>
                    </div>
                  </div>

                  {userInfo._id !== user._id && !user.isAdmin ? (
                    <div className="flex space-x-3">
                      <Link
                        to={`/admin/edit-user/${user._id}`}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5 text-center text-sm"
                      >
                        Edit User
                      </Link>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-xl font-medium hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all duration-300 shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/25 hover:-translate-y-0.5 text-sm"
                      >
                        Delete User
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-3">
                      <span className="text-slate-400 text-sm font-light italic">
                        {userInfo._id === user._id ? "Current User - Cannot Edit" : "Administrator - Protected"}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserListScreen;