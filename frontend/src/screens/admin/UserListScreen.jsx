import React from 'react'
import { useGetUsersQuery, useDeleteUserMutation, useUpdateUserMutation } from '../../slices/usersApiSlice'
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
const UserListScreen = () => {

    const { data: users, isLoading, error, refetch } = useGetUsersQuery();
    const [deleteUser] = useDeleteUserMutation();

    const { userInfo } = useSelector((state) => state.auth);


    const deleteHandler = async(userId) => {
        try {
            await deleteUser(userId).unwrap();
            toast.success("User deleted successfully");
            refetch();
        } catch (err) {
            toast.error(err?.data?.message || "Failed to delete user");
        }
    }
  return (
    <div>
        <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Users List</h1>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error.data?.message || "Failed to load users"}</Message>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.isAdmin ? (
                      <span
                       className="px-2 py-1 bg-green-100 text-green-800 rounded-full">
                      Yes
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full">
                      No
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {userInfo._id !== user._id && !user.isAdmin && (
                      <Link
                        to={`/admin/edit-user/${user._id}`}
                        className="px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-red-700 transition duration-200"
                      >
                        Edit User
                      </Link>
                    )}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {userInfo._id !== user._id && !user.isAdmin && (
                      <button
                        onClick={() => deleteHandler(user._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
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
    </div>
  )
}

export default UserListScreen