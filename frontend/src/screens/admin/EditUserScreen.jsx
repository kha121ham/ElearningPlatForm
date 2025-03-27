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
    <div className="container mx-auto p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg animate-fade-in">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Edit User
        </h1>

        {isLoading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">
            {error.data?.message || "Failed to load user"}
          </Message>
        ) : (
          <>
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="mb-4 text-blue-600 hover:text-blue-800 transition duration-300"
            >
              &larr; Back
            </button>

            {/* Edit User Form */}
            <form onSubmit={submitHandler} className="space-y-6">
              {/* Name Field (Read-Only) */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  readOnly
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 shadow-sm focus:outline-none"
                />
              </div>

              {/* Email Field (Read-Only) */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  readOnly
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 shadow-sm focus:outline-none"
                />
              </div>

              {/* isAdmin Field */}
              <div>
                <label
                  htmlFor="isAdmin"
                  className="block text-sm font-medium text-gray-700"
                >
                  Admin
                </label>
                <select
                  id="isAdmin"
                  value={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.value === "true")}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                >
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>

              {/* Role Field */}
              <div>
                <label
                  htmlFor="role"
                  className="block text-sm font-medium text-gray-700"
                >
                  Role
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition duration-300"
                >
                  <option value="student">Student</option>
                  <option value="instructor">Instructor</option>
                </select>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loadingUpdate}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
                >
                  {loadingUpdate ? "Updating..." : "Update User"}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default EditUserScreen;