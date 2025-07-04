import React from 'react';
import { Star } from 'lucide-react';

const Rating = ({ value, text }) => {
  return (
    <div className="flex items-center space-x-1">
      <div className="flex items-center space-x-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className="relative">
            {value >= star ? (
              <Star className="w-4 h-4 text-amber-400 fill-amber-400 transition-colors duration-300" />
            ) : value >= star - 0.5 ? (
              <div className="relative">
                <Star className="w-4 h-4 text-slate-200 fill-slate-200" />
                <div className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                </div>
              </div>
            ) : (
              <Star className="w-4 h-4 text-slate-200 fill-slate-200 transition-colors duration-300" />
            )}
          </span>
        ))}
      </div>

      {text && (
        <span className="text-sm text-slate-500 font-light ml-2 tracking-wide">
          {text}
        </span>
      )}
    </div>
  );
};

export default Rating;