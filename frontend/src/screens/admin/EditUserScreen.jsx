import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
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
        name,
        email,
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
    <div className='container mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-6'>Edit User</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error.data?.message || "Failed to load user"}
        </Message>
      ) : (
        <form onSubmit={submitHandler} className='max-w-lg mx-auto'>
          {/* Name Field */}
          <div className='mb-4'>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700'
            >
              Name
            </label>
            <input
              type='text'
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
              required
            />
          </div>

          {/* Email Field */}
          <div className='mb-4'>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'
            >
              Email
            </label>
            <input
              type='email'
              id='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
              required
            />
          </div>

          {/* isAdmin Field */}
          <div className='mb-4'>
            <label
              htmlFor='isAdmin'
              className='block text-sm font-medium text-gray-700'
            >
              Admin
            </label>
            <select
              id='isAdmin'
              value={isAdmin}
              onChange={(e) => setIsAdmin(e.target.value === "true")}
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            >
              <option value='true'>Yes</option>
              <option value='false'>No</option>
            </select>
          </div>

          {/* Role Field */}
          <div className='mb-4'>
            <label
              htmlFor='role'
              className='block text-sm font-medium text-gray-700'
            >
              Role
            </label>
            <select
              id='role'
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
            >
              <option value='student'>Student</option>
              <option value='instructor'>Instructor</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className='mt-6'>
            <button
              type='submit'
              disabled={loadingUpdate}
              className='w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200'
            >
              {loadingUpdate ? "Updating..." : "Update User"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditUserScreen;
