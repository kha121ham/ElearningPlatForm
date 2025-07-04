const AboutScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 py-6 sm:py-12 px-2 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-light text-slate-800 mb-4 sm:mb-6 tracking-tight">
            <span className="font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              About Us
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-500 font-light max-w-4xl mx-auto leading-relaxed mb-6 sm:mb-8">
            Welcome to our E-Learning platform! Our mission is to provide high-quality education
            accessible to everyone, anywhere in the world. We offer a variety of courses designed by
            industry experts to help you learn and grow.
          </p>
          <div className="flex justify-center">
            <div className="w-16 sm:w-20 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-60"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-20">
          <div className="group bg-white/70 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-1 hover:border-blue-200/60 p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100/60 flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-all duration-300">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-slate-800 mb-4 group-hover:text-blue-700 transition-colors duration-300">
              Expert Instructors
            </h3>
            <p className="text-slate-500 font-light leading-relaxed">
              Learn from industry professionals with real-world experience.
            </p>
          </div>

          <div className="group bg-white/70 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-1 hover:border-blue-200/60 p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100/60 flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-all duration-300">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-slate-800 mb-4 group-hover:text-blue-700 transition-colors duration-300">
              Community Learning
            </h3>
            <p className="text-slate-500 font-light leading-relaxed">
              Join a vibrant community of learners and collaborate with peers.
            </p>
          </div>

          <div className="group bg-white/70 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 hover:-translate-y-1 hover:border-blue-200/60 p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100/60 flex items-center justify-center mx-auto mb-6 group-hover:shadow-lg group-hover:shadow-blue-500/20 transition-all duration-300">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-slate-800 mb-4 group-hover:text-blue-700 transition-colors duration-300">
              Diverse Courses
            </h3>
            <p className="text-slate-500 font-light leading-relaxed">
              Explore a wide range of subjects to enhance your skills.
            </p>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-sm p-8 lg:p-12 text-center">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl sm:text-3xl font-light text-slate-800 mb-6 tracking-tight">
              <span className="font-medium bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Our Vision
              </span>
            </h3>
            <p className="text-lg text-slate-500 font-light leading-relaxed">
              We believe that education should be accessible to everyone. Our goal is to empower
              students, professionals, and lifelong learners with high-quality courses designed to fit
              their needs.
            </p>
            <div className="mt-8 flex justify-center">
              <div className="w-16 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-60"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutScreen;