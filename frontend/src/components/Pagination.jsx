const Pagination = ({ page, pages, onPageChange, className }) => {
  return (
    <div className={`flex justify-center items-center gap-2 mt-8 ${className}`}>
      {page > 1 && (
        <button
          onClick={() => onPageChange(page - 1)}
          className="group flex items-center justify-center w-10 h-10 bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-2xl hover:bg-blue-50/80 hover:border-blue-200/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-blue-500/10 hover:-translate-y-0.5"
        >
          <svg className="w-4 h-4 text-slate-500 group-hover:text-blue-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {[...Array(pages).keys()].map((x) => (
        <button
          key={x + 1}
          onClick={() => onPageChange(x + 1)}
          className={`group flex items-center justify-center min-w-[2.5rem] h-10 px-3 rounded-2xl font-medium text-sm transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-0.5 ${page === x + 1
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20 hover:shadow-xl hover:shadow-blue-500/25 border border-blue-400/60'
              : 'bg-white/70 backdrop-blur-sm border border-slate-200/60 text-slate-600 hover:bg-blue-50/80 hover:border-blue-200/60 hover:text-blue-600 hover:shadow-blue-500/10'
            }`}
        >
          {x + 1}
        </button>
      ))}

      {page < pages && (
        <button
          onClick={() => onPageChange(page + 1)}
          className="group flex items-center justify-center w-10 h-10 bg-white/70 backdrop-blur-sm border border-slate-200/60 rounded-2xl hover:bg-blue-50/80 hover:border-blue-200/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-blue-500/10 hover:-translate-y-0.5"
        >
          <svg className="w-4 h-4 text-slate-500 group-hover:text-blue-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {pages > 1 && (
        <div className="ml-4 text-sm text-slate-500 font-light">
          Page <span className="font-medium text-slate-700">{page}</span> of{' '}
          <span className="font-medium text-slate-700">{pages}</span>
        </div>
      )}
    </div>
  );
};

export default Pagination;