const Pagination = ({ page, pages, onPageChange, className }) => {
  return (
    <div className={`flex justify-center gap-3 mt-6 ${className}`}>
      {[...Array(pages).keys()].map((x) => (
        <button
          key={x + 1}
          onClick={() => onPageChange(x + 1)}
          className={`px-4 py-2 rounded-lg shadow-md transition duration-300 ${
            page === x + 1
              ? 'bg-blue-600 text-white font-semibold scale-105'
              : 'bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white'
          }`}
        >
          {x + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;