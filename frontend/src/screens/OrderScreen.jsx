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
  console.log(order)

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

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error.data.message}</Message>;

  if (!isUserOrder) {
    return <NotUserOrderPage />;
  }

  return (
    <div className="p-6 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <div className="p-6 bg-white shadow-lg rounded-lg max-w-2xl mx-auto animate-fade-in">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 text-blue-600 hover:text-blue-800 transition duration-300"
        >
          &larr; Back
        </button>

        {/* Order Details */}
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Order Details</h1>
        <div className="space-y-6">
          {/* Order Information */}
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Order Information
            </h2>
            <p className="text-gray-600">{`Order ID: ${order._id}`}</p>
            <p className="text-gray-600">{`Date: ${new Date(
              order.updatedAt
            ).toLocaleString()}`}</p>
          </div>

          {/* Customer Information */}
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Customer Information
            </h2>
            <p className="text-gray-600">{`Name: ${order.user.name}`}</p>
            <p className="text-gray-600">{`Email: ${order.user.email}`}</p>
          </div>

          {/* Order Items */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700">Order Items</h2>
            <div className="mt-4 space-y-4">
              {order.orderItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="ml-4 flex-1 flex justify-between items-center">
                    <p className="text-lg font-semibold text-gray-800">
                      {item.name}
                    </p>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="pt-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Order Summary
            </h2>
            <div className="mt-2">
              <p className="flex justify-between text-gray-600">
                <span>Tax:</span>
                <span>{order.taxPrice}$</span>
              </p>
              <p className="flex justify-between text-gray-800 font-semibold">
                <span>Total:</span>
                <span>{order.totalPrice}$</span>
              </p>
            </div>
          </div>

          {/* Payment Section */}
          {!userInfo.isAdmin && !order.isPaid && (
            <div>
              {loadingPay && <Loader />}
              {isPending ? (
                <Loader />
              ) : (
                <div className="pt-4">
                  <h2 className="text-lg font-semibold text-gray-700">Payment</h2>
                  <div>
                    <PayPalButtons
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={onError}
                    ></PayPalButtons>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Payment Success Message */}
          {order.isPaid && (
            <Message variant="success">Payment successful!</Message>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderScreen;