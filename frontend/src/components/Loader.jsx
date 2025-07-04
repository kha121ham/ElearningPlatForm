import React from 'react';

const Loader = ({
  size = 'md',
  className = '',
  text = ''
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'w-6 h-6';
      case 'lg':
        return 'w-12 h-12';
      case 'xl':
        return 'w-16 h-16';
      default:
        return 'w-8 h-8';
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div className="relative">
        <div className={`
          ${getSizeStyles()} 
          border-2 border-slate-200/60 border-t-blue-400/80 
          rounded-full animate-spin
        `}></div>

        <div className={`
          absolute inset-0 ${getSizeStyles()} 
          border-2 border-transparent border-r-indigo-300/60 
          rounded-full animate-spin
        `} style={{ animationDelay: '0.15s', animationDuration: '1.2s' }}></div>

        <div className={`
          absolute inset-0 flex items-center justify-center
        `}>
          <div className="w-1.5 h-1.5 bg-blue-400/60 rounded-full animate-pulse"></div>
        </div>
      </div>

      {text && (
        <p className="text-sm text-slate-500 font-light animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;