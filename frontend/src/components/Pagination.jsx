const Pagination = ({ page, pages, onPageChange, className }) => {
    return (
      <div className={`flex justify-center gap-2 ${className}`}>
        {[...Array(pages).keys()].map((x) => (
          <button
            key={x + 1}
            onClick={() => onPageChange(x + 1)}
            className={`px-4 py-2 rounded-lg ${
              page === x + 1 ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
            } hover:bg-blue-500 hover:text-white`}
          >
            {x + 1}
          </button>
        ))}
      </div>
    );
  };
  
  export default Pagination;