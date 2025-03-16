import { useGetOrdersQuery } from "../../slices/ordersApiSlices";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { Link } from "react-router-dom";

const OrderListScreen = () => {

  const { data: orders, isLoading, error } = useGetOrdersQuery();
  console.log(orders)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Order List</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? <Loader /> : error ? (
                <Message variant='danger'>
                    {error}
                </Message>
            ) : orders.map((order) => (
              <tr key={order._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order._id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.user && order.user.name}</td>
                <p className='text-gray-600'>{`Date: ${new Date(order.createdAt).toLocaleString()}`}</p>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.totalPrice.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.isPaid ? (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Paid
                    </span>
                  ) : (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Unpaid
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <Link to={`/order/${order._id}`}>
                    <button className="text-indigo-600 hover:text-indigo-900">View Details</button>
                </Link>
                </td>
              </tr>
            )) }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderListScreen;