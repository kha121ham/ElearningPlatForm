import { useGetOrdersQuery } from "../../slices/ordersApiSlices";
import Loader from "../../components/Loader";
import Message from "../../components/Message";
import { Link } from "react-router-dom";

const OrderListScreen = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 py-6 px-2 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-light text-slate-800 mb-4 sm:mb-6 tracking-tight">
            <span className="font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Order Management
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-500 font-light max-w-2xl mx-auto leading-relaxed">
            Track and manage all orders in your e-learning platform
          </p>
          <div className="mt-4 sm:mt-6 flex justify-center">
            <div className="w-12 sm:w-16 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-60"></div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gradient-to-r from-slate-50/80 to-blue-50/40 backdrop-blur-sm border-b border-slate-200/60">
                <tr>
                  <th className="py-4 px-6 text-left text-sm font-medium text-slate-600 tracking-wide">Order ID</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-slate-600 tracking-wide">Customer</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-slate-600 tracking-wide">Date</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-slate-600 tracking-wide">Total</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-slate-600 tracking-wide">Status</th>
                  <th className="py-4 px-6 text-left text-sm font-medium text-slate-600 tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/60">
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12">
                      <div className="flex justify-center">
                        <Loader />
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="6" className="text-center py-12">
                      <Message variant="danger">{error}</Message>
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr
                      key={order._id}
                      className="group hover:bg-blue-50/30 transition-all duration-300"
                    >
                      <td className="py-4 px-6">
                        <span className="text-sm text-slate-500 font-mono bg-slate-100/60 px-2 py-1 rounded-lg">
                          {order._id.slice(-8)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center border border-blue-200/60">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <span className="text-slate-700 font-medium">
                            {order.user && order.user.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-slate-700 font-light">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                        <div className="text-xs text-slate-500 font-light">
                          {new Date(order.createdAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-lg font-medium text-slate-800">
                          <span className="text-blue-600 font-light">$</span>{order.totalPrice.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {order.isPaid ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2"></div>
                            Paid
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
                            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-2"></div>
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <Link to={`/order/${order._id}`}>
                          <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 focus:ring-offset-white transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5 text-sm">
                            View Details
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="lg:hidden space-y-4 p-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <Message variant="danger">{error}</Message>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center border border-blue-200/60">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <span className="text-lg font-medium text-slate-800">
                          {order.user && order.user.name}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 font-light">
                        Order #{order._id.slice(-8)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-medium text-slate-800 mb-1">
                        <span className="text-blue-600 font-light">$</span>{order.totalPrice.toFixed(2)}
                      </div>
                      {order.isPaid ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1.5"></div>
                          Paid
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
                          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full mr-1.5"></div>
                          Pending
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <span className="text-slate-500 font-light">Date:</span>
                      <div className="text-slate-700 font-medium mt-1">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500 font-light">Time:</span>
                      <div className="text-slate-700 font-medium mt-1">
                        {new Date(order.createdAt).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  </div>

                  <Link to={`/order/${order._id}`} className="block">
                    <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5">
                      View Order Details
                    </button>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderListScreen;