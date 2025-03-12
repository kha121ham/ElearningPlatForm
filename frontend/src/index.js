import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
//import utilis
import { Provider } from 'react-redux';
import store from './store';
import { 
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom';
//import screens
import HomeScreen from './screens/HomeScreen';
import LogInScreen from './screens/LogInScreen';
import RegisterScreen from './screens/RegisterScreen';
import CoursesScreen from './screens/CoursesScreen';
import CourseScreen from './screens/CourseScreen';
import InstractorRoute from './components/InstractorRoute';
import PrivateRoute from './components/PrivateRoute';
import AddCourseScreen from './screens/Instractor/AddCourseScreen';
import CartScreen from './screens/CartScreen';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/login' element={<LogInScreen />} />
      <Route path='/register' element={<RegisterScreen />} />
      <Route path='/courses' element={<CoursesScreen />} />
      <Route path='/courses/:id' element={<CourseScreen />} />

      <Route path='' element={<PrivateRoute />}>
      <Route path='/cart' element={<CartScreen />} />
      </Route>

      <Route path='' element={<InstractorRoute />}>
      <Route path='/add-course' element={<AddCourseScreen />} />
      </Route>
    </Route>
  )
);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
  </React.StrictMode>
);

reportWebVitals();