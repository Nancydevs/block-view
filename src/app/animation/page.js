"use client";

import React, { useState, useEffect } from 'react';

const RED_DOT_SIZE = 20;
const SPACING = 40;
const ANIMATION_DURATION = 1000; // 1 second

const RedDot = ({ index, isNew, isShifting }) => {
  const style = {
    width: `${RED_DOT_SIZE}px`,
    height: `${RED_DOT_SIZE}px`,
    backgroundColor: 'red',
    borderRadius: '50%',
    position: 'absolute',
    left: `${index * SPACING}px`,
    transition: `left ${ANIMATION_DURATION}ms ease-in-out`,
    animation: isNew ? 'fadeIn 1s ease-out' : 'none',
  };

  return <div style={style} />;
};

const AnimationPage = () => {
  const [dots, setDots] = useState([0]);
  const [isShifting, setIsShifting] = useState(false);

  useEffect(() => {
    const addDot = () => {
      setIsShifting(true);
      setTimeout(() => {
        setDots(prevDots => [...prevDots.map(d => d + 1), 0]);
        setIsShifting(false);
      }, ANIMATION_DURATION);
    };

    const intervalId = setInterval(addDot, ANIMATION_DURATION * 2);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">Red Dot Chain Animation</h1>
      <div className="relative w-full h-20 overflow-hidden">
        {dots.map((dot, index) => (
          <RedDot 
            key={dot} 
            index={isShifting ? index + 1 : index} 
            isNew={index === dots.length - 1 && !isShifting}
            isShifting={isShifting}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimationPage;