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
      <div>
        <p>Are you sure you want to delete this user?</p>
        <div className='flex gap-4 mt-2'>
          <button
            className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300'
            onClick={() => {
              deleteHandler(userId);
              toast.dismiss();
            }}
          >
            Yes
          </button>
          <button
            className='bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300'
            onClick={() => toast.dismiss()}
          >
            No
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
    <div className='container mx-auto p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen'>
      <h1 className='text-4xl font-bold mb-8 text-center text-gray-800 animate-fade-in'>
        Users List
      </h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error.data?.message || "Failed to load users"}
        </Message>
      ) : (
        <div className='overflow-x-auto bg-white shadow-lg rounded-lg animate-fade-in'>
          <table className='min-w-full border border-gray-200'>
            <thead className='bg-gray-200'>
              <tr>
                <th className='px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider'>
                  ID
                </th>
                <th className='px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider'>
                  Name
                </th>
                <th className='px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider'>
                  Email
                </th>
                <th className='px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider'>
                  Admin
                </th>
                <th className='px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider'>
                  Edit
                </th>
                <th className='px-6 py-3 text-left text-sm font-medium text-gray-700 uppercase tracking-wider'>
                  Delete
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className='hover:bg-gray-50 transition duration-300'
                >
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {user._id}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {user.name}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                    {user.email}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm'>
                    {user.isAdmin ? (
                      <span className='px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold'>
                        Yes
                      </span>
                    ) : (
                      <span className='px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold'>
                        No
                      </span>
                    )}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm'>
                    {userInfo._id !== user._id && !user.isAdmin && (
                      <Link
                        to={`/admin/edit-user/${user._id}`}
                        className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 shadow-md'
                      >
                        Edit
                      </Link>
                    )}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-sm'>
                    {userInfo._id !== user._id && !user.isAdmin && (
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 shadow-md'
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserListScreen;
