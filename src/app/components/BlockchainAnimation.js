import React, { useState, useEffect } from "react";
import Image from "next/image";

const ChainLink = () => (
  <svg width="24" height="50" viewBox="0 0 24 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 0V96" stroke="#4A5568" strokeWidth="2" strokeDasharray="4 4"/>
    <circle cx="12" cy="20" r="4" fill="#4A5568"/>

  </svg>
);

const BlockchainAnimation = ({ blocks, blockchainImage, chain }) => {
  const [animatingNewBlock, setAnimatingNewBlock] = useState(false);

//   useEffect(() => {
//     if (blocks.length > 0) {
//       setAnimatingNewBlock(true);
//       const animationTimer = setTimeout(() => {
//         setAnimatingNewBlock(false);
//       }, 1000);

//       return () => clearTimeout(animationTimer);
//     }
//   }, [blocks.length]);

  return (
    <div className="relative w-full h-full mt-10 mx-auto ">
      {blocks.map((block, index) => (
        <React.Fragment key={block.number}>
          <div
            className={`absolute left-0 w-full h-24 transition-all ${chain=="sol"?"duration-150":"duration-1000"} ease-in-out flex items-center ${
              animatingNewBlock ? 'translate-y-24' : ''
            }`}
            style={{ top: `${index * 120  - 33}px` }}
          >
            <div className="flex items-center space-x-4">
              <div className="relative w-24 h-24">
                <Image
                  src={blockchainImage}
                  alt={`Block ${block.number}`}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <div>
                <div className="font-bold">Block: 
                    
                    
                    <a className="text-blue-500 underline"
                    target= "_blank"
                    href={chain==="eth"?`https://etherscan.io/block/${block.number}`: chain==="sol"?`https://explorer.solana.com/block/${block.number}`:`https://basescan.org/block/${block.number}`}
                    >
                      <span className="font-normal ml-1">{block.number.toLocaleString()}</span>
                      
                      </a></div>
                <div className="font-bold">Transactions: <span className="font-normal"> {block.transactions.toLocaleString()}</span></div>
              </div>
            </div>
          </div>
          {index < blocks.length - 1 && (
            <div 
              className={`absolute left-9 transition-all ${chain==="sol"?"duration-150":"duration-1000"} z-50 ease-in-out ${
                animatingNewBlock ? 'translate-y-24' : ''
              }`}
              style={{ top: `${index * 120 +60}px` }}
            >
              <ChainLink />
            </div>
          )}
        </React.Fragment>
      ))}
      {/* {animatingNewBlock && blocks.length > 0 && (
        <div
          className="absolute left-0 top-0 w-full h-24 flex items-center opacity-0 animate-fadeIn"
        >
          <div className="flex items-center space-x-4">
            <div className="relative w-24 h-24">
              <Image
                src={blockchainImage}
                alt={`New Block ${blocks[0].number}`}
                layout="fill"
                objectFit="contain"
              />
            </div>
            <div>
            <div className="font-bold">Block: <span className="font-normal">{blocks.number.toLocaleString()}</span></div>
            <div className="font-bold">Transactions: <span className="font-normal"> {blocks.transactions.toLocaleString()}</span></div>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default BlockchainAnimation;