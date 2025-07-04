import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, clearCartItems } from '../slices/cartSlice';
import { useCreateOrderMutation } from '../slices/ordersApiSlices';
import Message from '../components/Message';
import Loader from '../components/Loader';
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
          price: Number(item.price).toFixed(2),
          image: item.image,
        })),
        itemsPrice: Number(cart.itemsPrice).toFixed(2),
        taxPrice: Number(cart.taxPrice).toFixed(2),
        totalPrice: Number(cart.totalPrice).toFixed(2),
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (err) {
      const errorMessage = err?.data?.message || err.message || 'An error occurred';
      toast.error(errorMessage);
    }
  };

  const ShoppingBagIcon = () => (
    <svg className="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z" />
    </svg>
  );

  const TrashIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  );

  const ArrowLeftIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  );

  const CheckIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-light text-slate-700 mb-3 tracking-wide">
            Shopping Cart
          </h1>
          <div className="w-24 h-0.5 bg-gradient-to-r from-blue-200 to-indigo-200 mx-auto"></div>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-sm border border-slate-200/50 text-center max-w-md mx-auto">
              <div className="mb-6">
                <ShoppingBagIcon />
              </div>
              <h2 className="text-xl font-medium text-slate-600 mb-4">Your cart is empty</h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Discover amazing products and add them to your cart to get started.
              </p>
              <Link
                to="/"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-2xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
              >
                <ArrowLeftIcon />
                <span>Continue Shopping</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-4">
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-slate-200/50 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-200/50">
                  <h2 className="text-xl font-medium text-slate-700">
                    Cart Items ({cartItems.length})
                  </h2>
                </div>

                <div className="divide-y divide-slate-200/50">
                  {cartItems.map((item) => (
                    <div
                      key={item._id}
                      className="p-6 hover:bg-slate-50/50 transition-colors duration-200"
                    >
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <div className="flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            loading="lazy"
                            decoding="async"
                            width="80"
                            height="80"
                            className="w-20 h-20 object-cover rounded-2xl shadow-sm border border-slate-200/50"
                          />
                        </div>

                        <div className="flex-grow min-w-0">
                          <Link
                            to={`/product/${item._id}`}
                            className="block text-lg font-medium text-slate-700 hover:text-blue-600 transition-colors duration-200 mb-2 truncate"
                          >
                            {item.name}
                          </Link>
                          <p className="text-slate-500 font-medium">
                            ${Number(item.price).toFixed(2)}
                          </p>
                        </div>

                        <div className="flex-shrink-0">
                          <button
                            onClick={() => removeFromCartHandler(item._id)}
                            className="inline-flex items-center space-x-2 text-slate-500 hover:text-red-500 bg-slate-100 hover:bg-red-50 px-4 py-2 rounded-xl transition-all duration-200 font-medium"
                          >
                            <TrashIcon />
                            <span className="hidden sm:inline">Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="xl:col-span-1">
              <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-slate-200/50 shadow-sm p-6 sticky top-6">
                <h2 className="text-xl font-medium text-slate-700 mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600">Items Price:</span>
                    <span className="font-medium text-slate-700">${cart.itemsPrice}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600">Tax Price:</span>
                    <span className="font-medium text-slate-700">${cart.taxPrice}</span>
                  </div>
                  <div className="border-t border-slate-200/50 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-slate-700">Total Price:</span>
                      <span className="text-xl font-semibold text-slate-800">${cart.totalPrice}</span>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mb-6">
                    <Message variant="danger">{error?.data?.message || error.message}</Message>
                  </div>
                )}

                <button
                  onClick={checkoutHandler}
                  className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-2xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-md hover:shadow-lg font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={cartItems.length === 0}
                >
                  <CheckIcon />
                  <span>Proceed to Checkout</span>
                </button>

                {isLoading && (
                  <div className="mt-6 flex justify-center">
                    <Loader />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartScreen;