import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useUpdateUserMutation,
  useGetUserDetailsQuery,
} from "../../slices/usersApiSlice";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { toast } from "react-toastify";

const EditUserScreen = () => {
  const { id: userId } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [role, setRole] = useState("student");

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useGetUserDetailsQuery(userId);
  const [updateUser, { isLoading: loadingUpdate }] = useUpdateUserMutation();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setIsAdmin(user.isAdmin);
      setRole(user.role);
    }
  }, [user]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await updateUser({
        userId,
        isAdmin,
        role,
      }).unwrap();
      toast.success("User updated successfully");
      refetch();
      navigate("/admin/userslist");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-slate-800 mb-6 tracking-tight">
            <span className="font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Edit User
            </span>
          </h1>
          <p className="text-lg text-slate-500 font-light max-w-xl mx-auto leading-relaxed">
            Update user permissions and role settings
          </p>
          <div className="mt-6 flex justify-center">
            <div className="w-16 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-60"></div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader />
          </div>
        ) : error ? (
          <div className="mb-8">
            <Message variant="danger">
              {error.data?.message || "Failed to load user"}
            </Message>
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200/60">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors duration-300 group"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Back to Users</span>
              </button>
            </div>

            <div className="p-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 border-b border-slate-200/60">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl border border-blue-200/60 flex items-center justify-center">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-medium text-slate-800 mb-1">{name}</h2>
                  <p className="text-slate-500 font-light">{email}</p>
                  <div className="mt-2">
                    {role === "instructor" ? (
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
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={submitHandler} className="p-8 space-y-8">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-600 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  readOnly
                  className="w-full px-4 py-3 bg-slate-50/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl text-slate-500 font-light cursor-not-allowed"
                />
                <p className="mt-2 text-xs text-slate-400 font-light">Name cannot be modified</p>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-600 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  readOnly
                  className="w-full px-4 py-3 bg-slate-50/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl text-slate-500 font-light cursor-not-allowed"
                />
                <p className="mt-2 text-xs text-slate-400 font-light">Email cannot be modified</p>
              </div>

              <div>
                <label htmlFor="isAdmin" className="block text-sm font-medium text-slate-600 mb-2">
                  Administrator Status
                </label>
                <select
                  id="isAdmin"
                  value={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.value === "true")}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-300 text-slate-700 font-light"
                >
                  <option value="false">Regular User</option>
                  <option value="true">Administrator</option>
                </select>
                <p className="mt-2 text-xs text-slate-500 font-light">
                  Administrators have full access to the platform
                </p>
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-slate-600 mb-2">
                  User Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-300 text-slate-700 font-light"
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                </select>
                <p className="mt-2 text-xs text-slate-500 font-light">
                  Instructors can create and manage courses
                </p>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loadingUpdate}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-2xl font-medium hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 focus:ring-offset-white transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loadingUpdate ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Updating User...</span>
                    </div>
                  ) : (
                    "Update User Settings"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditUserScreen;