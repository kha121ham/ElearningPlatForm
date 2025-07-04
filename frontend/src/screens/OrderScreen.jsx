import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPaypalClientIdQuery,
} from "../slices/ordersApiSlices";
import { useEnrollStudentToCourseMutation } from "../slices/coursesApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { toast } from "react-toastify";
import NotUserOrderPage from "../components/NotUserOrderPage";
import { useNavigate } from "react-router-dom";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const { userInfo } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);


  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [enrollStudentToCourse] = useEnrollStudentToCourseMutation();

  const isUserOrder =
    userInfo &&
    order &&
    (userInfo._id.toString() === order.user._id.toString() || userInfo.isAdmin);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPaypalClientIdQuery();

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPaypalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "setLoadingStatus", value: "pending" });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPaypalScript();
        }
      }
    }
  }, [errorPayPal, loadingPayPal, order, paypal, paypalDispatch]);

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice.toFixed(2) }, // Ensure the value is a string
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      })
      .catch((err) => {
        toast.error("Failed to create order. Please try again.");
        throw err;
      });
  }

  function onApprove(data, actions) {
    return actions.order
      .capture()
      .then(async function (details) {
        try {
          await payOrder({ orderId, details });
          refetch();
          toast.success("Order is paid");
          if (order && order.orderItems) {
            const courseIds = order.orderItems.map((item) => item.course);
            for (const courseId of courseIds) {
              try {
                await enrollStudentToCourse(courseId).unwrap();
                toast.success(`Enrolled in course ${courseId}`);
              } catch (err) {
                toast.error(`Failed to enroll in course ${courseId}: ${err.message}`);
              }
            }
          }
        } catch (err) {
          toast.error(err?.data?.message || err.error);
        }
      })
      .catch((err) => {
        toast.error("Failed to capture payment. Please try again.");
      });
  }

  function onError(err) {
    toast.error(err.message);
  }

  // Custom SVG Icons
  const ArrowLeftIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );

  const DocumentIcon = () => (
    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  const UserIcon = () => (
    <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const ShoppingBagIcon = () => (
    <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
    </svg>
  );

  const CalculatorIcon = () => (
    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  );

  const CreditCardIcon = () => (
    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error.data.message}</Message>;

  if (!isUserOrder) {
    return <NotUserOrderPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header with Back Button */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors duration-200 mb-6 group"
          >
            <ArrowLeftIcon />
            <span className="font-medium">Back to Orders</span>
          </button>

          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-light text-slate-700 mb-3 tracking-wide">
              Order Details
            </h1>
            <div className="w-24 h-0.5 bg-gradient-to-r from-blue-200 to-indigo-200 mx-auto"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-slate-200/50 shadow-sm overflow-hidden">
          <div className="p-8 space-y-8">

            {/* Order Information */}
            <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 rounded-2xl p-6 border border-blue-100/50">
              <div className="flex items-center space-x-3 mb-4">
                <DocumentIcon />
                <h2 className="text-xl font-medium text-slate-700">Order Information</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Order ID</p>
                  <p className="font-mono text-slate-700 bg-white/60 px-3 py-2 rounded-lg text-sm">
                    {order._id}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Order Date</p>
                  <p className="text-slate-700 bg-white/60 px-3 py-2 rounded-lg">
                    {new Date(order.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-gradient-to-r from-emerald-50/50 to-teal-50/50 rounded-2xl p-6 border border-emerald-100/50">
              <div className="flex items-center space-x-3 mb-4">
                <UserIcon />
                <h2 className="text-xl font-medium text-slate-700">Customer Information</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Customer Name</p>
                  <p className="text-slate-700 bg-white/60 px-3 py-2 rounded-lg">
                    {order.user.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Email Address</p>
                  <p className="text-slate-700 bg-white/60 px-3 py-2 rounded-lg">
                    {order.user.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-2xl p-6 border border-purple-100/50">
              <div className="flex items-center space-x-3 mb-6">
                <ShoppingBagIcon />
                <h2 className="text-xl font-medium text-slate-700">Order Items</h2>
              </div>
              <div className="space-y-4">
                {order.orderItems.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50 hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-xl border border-slate-200/50 shadow-sm"
                      />
                      <div className="flex-grow min-w-0">
                        <h3 className="font-medium text-slate-700 mb-1 truncate">
                          {item.name}
                        </h3>
                        <p className="text-slate-500 text-sm">Course Item</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-700">
                          ${Number(item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-gradient-to-r from-indigo-50/50 to-blue-50/50 rounded-2xl p-6 border border-indigo-100/50">
              <div className="flex items-center space-x-3 mb-6">
                <CalculatorIcon />
                <h2 className="text-xl font-medium text-slate-700">Order Summary</h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-600">Tax Amount:</span>
                  <span className="font-medium text-slate-700">${order.taxPrice}</span>
                </div>
                <div className="border-t border-slate-200/50 pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-slate-700">Total Amount:</span>
                    <span className="text-2xl font-semibold text-slate-800">${order.totalPrice}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            {!userInfo.isAdmin && !order.isPaid && (
              <div className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 rounded-2xl p-6 border border-blue-100/50">
                <div className="flex items-center space-x-3 mb-6">
                  <CreditCardIcon />
                  <h2 className="text-xl font-medium text-slate-700">Payment</h2>
                </div>
                {loadingPay && (
                  <div className="flex justify-center py-8">
                    <Loader />
                  </div>
                )}
                {isPending ? (
                  <div className="flex justify-center py-8">
                    <Loader />
                  </div>
                ) : (
                  <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
                    <PayPalButtons
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={onError}
                    />
                  </div>
                )}
              </div>
            )}

            {/* Payment Success Message */}
            {order.isPaid && (
              <div className="bg-gradient-to-r from-emerald-50/50 to-green-50/50 rounded-2xl p-6 border border-emerald-100/50">
                <Message variant="success">Payment completed successfully!</Message>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderScreen;