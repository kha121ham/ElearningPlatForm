import React from 'react';
import { Link } from 'react-router-dom';

const NotUserOrderPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl border border-blue-200/60 flex items-center justify-center mx-auto mb-6 shadow-sm">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-slate-800 mb-6 tracking-tight">
            <span className="font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              No Orders Found
            </span>
          </h1>
          <div className="flex justify-center">
            <div className="w-16 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-60"></div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="p-8 lg:p-12 border-b border-slate-200/60">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-medium text-slate-800 mb-4 tracking-tight">
                Oops! It seems you don't have any orders yet.
              </h2>
              <p className="text-lg text-slate-500 font-light leading-relaxed max-w-lg mx-auto">
                If you believe this is a mistake, please check your account or contact our support team for assistance.
              </p>
            </div>
          </div>

          <div className="p-8 lg:p-12 bg-gradient-to-br from-blue-50/50 to-indigo-50/30">
            <div className="text-center">
              <h3 className="text-lg font-medium text-slate-800 mb-6 tracking-tight">
                What would you like to do next?
              </h3>

              <div className="space-y-4 max-w-sm mx-auto">
                <Link
                  to="/"
                  className="group w-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 px-6 rounded-2xl font-medium hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-2 focus:ring-offset-white transition-all duration-300 shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5"
                >
                  <svg className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Go to Homepage</span>
                </Link>

                <div className="pt-4">
                  <p className="text-sm text-slate-500 font-light leading-relaxed">
                    Start exploring our courses and find something that interests you.
                    Your learning journey begins with a single step!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-slate-200/40 p-6">
            <p className="text-sm text-slate-500 font-light leading-relaxed">
              Need help? Our support team is here to assist you.{' '}
              <a
                href="/contact"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-300 hover:underline decoration-blue-300 underline-offset-4"
              >
                Contact Support
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotUserOrderPage;