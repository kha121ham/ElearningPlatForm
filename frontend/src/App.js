import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';

const App = () => {
  return (
    <>
      <Header />
      <main className="py-3">
        <div className="container mx-auto px-4">
          <Outlet />
        </div>
      </main>
      <Footer />
      <ToastContainer />
    </>
  );
};

export default App;