import { apiSlice } from './apiSlice';
import { ORDERS_URL } from '../constants';


export const orderApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (order) => ({
              url: ORDERS_URL,
              method: 'POST',
              body: order,
            }),
          }),
          getOrderDetails: builder.query({
            query: (id) => ({
              url: `${ORDERS_URL}/${id}`,
            }),
            keepUnusedDataFor: 5,
          }),
          payOrder: builder.mutation({
            query: (orderId) => ({
              url: `${ORDERS_URL}/${orderId}/pay`,
              method: 'PUT',
              body: {},
            })
          }),
    }),
});


export const { useCreateOrderMutation, useGetOrderDetailsQuery, usePayOrderMutation } = orderApiSlice;