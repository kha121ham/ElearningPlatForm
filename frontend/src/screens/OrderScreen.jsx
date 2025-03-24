import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
} from "../slices/ordersApiSlices";
import { useEnrollStudentToCourseMutation } from "../slices/coursesApiSlice"; // Import the mutation
import Loader from "../components/Loader";
import Message from "../components/Message";
import { toast } from "react-toastify";
import NotUserOrderPage from "../components/NotUserOrderPage";
import { useNavigate } from "react-router-dom";

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const { userInfo } = useSelector((state) => state.auth);

  const navigate = useNavigate();

  // Fetch order details
  const {
    data: order,
    refetch,
    isLoading,
    error,
  } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [enrollStudentToCourse] = useEnrollStudentToCourseMutation();

  // Check if the current user is the owner of the order or an admin
  const isUserOrder =
    userInfo &&
    order &&
    (userInfo._id.toString() === order.user._id.toString() || userInfo.isAdmin);

  console.log(isUserOrder); // Debugging

  // Handle payment
  const payHandler = async () => {
    try {
      await payOrder(orderId);
      refetch();
      toast.success("Order is paid");

      // Enroll the student in all courses after payment
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
  };

  // Loading and error handling
  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{error.data.message}</Message>;

  // If it's not the user's order and the user is not an admin, show the NotUserOrderPage
  if (!isUserOrder) {
    return <NotUserOrderPage />;
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-2xl mx-auto">
          <button
            onClick={()=> navigate(-1)}
            className="mb-4 text-blue-600 hover:text-blue-800 transition duration-300"
          >
            &larr; Back
          </button>
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>
      <div className="space-y-4">
        {/* Order Information */}
        <div className="border-b pb-4">
          <h2 className="text-lg font-semibold">Order Information</h2>
          <p className="text-gray-600">{`Order ID: ${order._id}`}</p>
          <p className="text-gray-600">{`Date: ${new Date(
            order.updatedAt
          ).toLocaleString()}`}</p>
        </div>

        {/* Customer Information */}
        <div className="border-b pb-4">
          <h2 className="text-lg font-semibold">Customer Information</h2>
          <p className="text-gray-600">{`Name: ${order.user.name}`}</p>
          <p className="text-gray-600">{`Email: ${order.user.email}`}</p>
        </div>

        {/* Order Items */}
        <div>
          <h2 className="text-lg font-semibold">Order Items</h2>
          <div className="mt-2 space-y-2">
            {order.orderItems.map((item) => (
              <div key={item._id} className="flex items-center mb-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="ml-4 flex-1 flex justify-between items-center">
                  <p className="text-lg font-semibold">{item.name}</p>
                  <p className="text-gray-600">${item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="pt-4">
          <h2 className="text-lg font-semibold">Order Summary</h2>
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

        {/* Payment Section (only for non-admin users and unpaid orders) */}
        {!userInfo.isAdmin && !order.isPaid && (
          <div className="pt-4">
            <h2 className="text-lg font-semibold">Payment</h2>
            <div className="mt-4 space-y-4">
              {/* PayPal Button */}
              <button
                type="button"
                onClick={payHandler}
                className="w-full flex items-center justify-center bg-[#003087] text-white py-2 px-4 rounded-md hover:bg-[#00256D] transition duration-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6 mr-2"
                >
                  <path d="M7.5 6.375a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM12 2.25c-2.429 0-4.5 1.978-4.5 4.375s2.071 4.375 4.5 4.375 4.5-1.978 4.5-4.375S14.429 2.25 12 2.25zM12 15.75c-2.429 0-4.5 1.978-4.5 4.375S9.571 24 12 24s4.5-1.978 4.5-4.375-2.071-4.375-4.5-4.375z" />
                </svg>
                <span>Pay with PayPal</span>
              </button>
              {loadingPay && <Loader />}

              {/* Credit Card Button Placeholder */}
              <button className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition duration-200">
                Pay with Credit Card
              </button>
            </div>
          </div>
        )}

        {/* Payment Success Message */}
        {order.isPaid && <Message variant="success">Payment successful!</Message>}
      </div>
    </div>
  );
};

export default OrderScreen;