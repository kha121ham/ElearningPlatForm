import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
//import utilis
import { Provider } from 'react-redux';
import store from './store';
import { 
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
//import screens
import HomeScreen from './screens/HomeScreen';
import LogInScreen from './screens/LogInScreen';
import RegisterScreen from './screens/RegisterScreen';
import CoursesScreen from './screens/CoursesScreen';
import CourseScreen from './screens/CourseScreen';
import InstractorRoute from './components/InstractorRoute';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import AddCourseScreen from './screens/Instractor/AddCourseScreen';
import CartScreen from './screens/CartScreen';
import OrderScreen from './screens/OrderScreen';
import VideoScreen from './screens/VideoScreen';
import AddContentScreen from './screens/Instractor/AddContentScreen';
import ProfileScreen from './screens/ProfileScreen';
import OrderListScreen from './screens/admin/OrderListScreen';
import CourseListScreen from './screens/admin/CourseListScreen';
import UserListScreen from './screens/admin/UserListScreen';
import EditUserScreen from './screens/admin/EditUserScreen';
import MyCoursesScreen from './screens/Instractor/MyCoursesScreen';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/login' element={<LogInScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      <Route path='/courses' element={<CoursesScreen />} />
      <Route path='/courses/:id' element={<CourseScreen />} />

      <Route path='' element={<PrivateRoute />}>
      <Route path='/order/:id' element={<OrderScreen />} />
      <Route path='/cart' element={<CartScreen />} />
      <Route path='/courses/:id/video/:videoId' element={<VideoScreen />} />
      <Route path='/profile' element={<ProfileScreen />} />
      </Route>

      <Route path='' element={<AdminRoute />}>
        <Route path='/admin/orderlist' element={<OrderListScreen />} />
        <Route path='/admin/courselist' element={<CourseListScreen />} />
        <Route path='/admin/userslist' element={<UserListScreen />} />
        <Route path='/admin/edit-user/:id' element={<EditUserScreen />} />
      </Route>

      <Route path='' element={<InstractorRoute />}>
      <Route path='/add-course' element={<AddCourseScreen />} />
      <Route path='courses/:courseId/add-content' element={<AddContentScreen />} />
      <Route path='/mycourses' element={<MyCoursesScreen />} />
      </Route>
    </Route>
  )
);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <HelmetProvider>
    <Provider store={store}>
      <PayPalScriptProvider options={{ "client-id": "your-client-id" }}>
        <RouterProvider router={router} />
      </PayPalScriptProvider>
    </Provider>
  </HelmetProvider>
  </React.StrictMode>
);

reportWebVitals();