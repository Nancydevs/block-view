import React from 'react';

const Loader = () => {
  return (
    <div className="flex items-center justify-center  ">
      <div className="relative">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className={`absolute w-14 h-14 rounded-full border-4 border-transparent border-t-blue-500 border-r-blue-500 animate-spin`}
            style={{
              animationDuration: `${1 + index * 0.2}s`,
              animationDelay: `${index * 0.1}s`,
              borderTopColor: ['#3B82F6', '#10B981', '#6366F1'][index],
              borderRightColor: ['#3B82F6', '#10B981', '#6366F1'][index],
            }}
          ></div>
        ))}
        <div className="w-16 h-16 rounded-full absolute animate-pulse  opacity-80"></div>
      </div>
    </div>
  );
};

export default Loader;