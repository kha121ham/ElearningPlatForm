import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, clearCartItems } from '../../slices/cartSlice';
import { useCreateOrderMutation } from '../../slices/ordersApiSlices';
import Message from '../../components/Message';
import Loader from '../../components/Loader';
import { toast } from 'react-toastify';

const CartScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  const checkoutHandler = async () => {
    try {
      const res = await createOrder({
        orderItems: cart.cartItems.map((item) => ({
          _id: item._id,
          name: item.title,
          price: item.price,
          image: item.image,
        })),
        itemsPrice: cart.itemsPrice,
        taxPrice: cart.taxPrice,
        totalPrice: cart.totalPrice,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      const errorMessage = err?.data?.message || err.message || 'An error occurred';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800 animate-fade-in">
        Shopping Cart
      </h1>
      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600">Your cart is empty.</p>
          <Link
            to="/"
            className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Go Back to Store
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          {/* Cart Items List */}
          <div className="lg:col-span-2">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row items-center justify-between border-b py-4 hover:bg-gray-50 transition duration-300"
              >
                <div className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg shadow-md"
                  />
                  <div className="ml-4">
                    <Link
                      to={`/product/${item._id}`}
                      className="text-lg font-semibold hover:text-blue-500 transition duration-300"
                    >
                      {item.name}
                    </Link>
                    <p className="text-gray-600">Price: ${item.price}</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCartHandler(item._id)}
                  className="mt-4 sm:mt-0 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Items Price:</span>
                <span>${cart.itemsPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax Price:</span>
                <span>${cart.taxPrice}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-800">
                <span>Total Price:</span>
                <span>${cart.totalPrice}</span>
              </div>
              {error && (
                <Message variant="danger">{error?.data?.message || error.message}</Message>
              )}
              <button
                onClick={checkoutHandler}
                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-300"
                disabled={cartItems.length === 0}
              >
                Proceed to Checkout
              </button>

              {isLoading && (
                <div className="mt-4 flex justify-center">
                  <Loader />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartScreen;