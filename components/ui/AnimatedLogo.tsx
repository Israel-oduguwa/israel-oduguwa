"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export function AnimatedLogo() {
  const [isHovered, setIsHovered] = useState(false);

  // SVG paths from the original monogram
  const pathI = "M0 0H86V315H36C16.1177 315 0 298.882 0 279V0Z";
  
  return (
    <motion.div 
      className="flex items-center cursor-pointer overflow-hidden h-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial="hidden"
      animate="visible"
    >
      <div className="relative flex items-center shrink-0">
        <svg 
          width="40" 
          height="40" 
          viewBox="0 0 600 600" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="text-current shrink-0"
        >
          <g transform="translate(82 104)">
            {/* The 'I' */}
            <motion.path 
              d={pathI} 
              fill="currentColor"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
              }}
            />
            
            {/* The 'O' is shown only when NOT hovered, or morphs. To make it smooth, we fade out the O and slide in the text */}
            <motion.path 
              fillRule="evenodd" 
              clipRule="evenodd" 
              d="M281 326C371.022 326 444 253.022 444 163C444 72.9776 371.022 0 281 0C190.978 0 118 72.9776 118 163C118 253.022 190.978 326 281 326ZM281 245C326.287 245 363 208.287 363 163C363 117.713 326.287 81 281 81C235.713 81 199 117.713 199 163C199 208.287 235.713 245 281 245Z"
              fill="currentColor"
              animate={{ 
                opacity: isHovered ? 0 : 1,
                scale: isHovered ? 0.8 : 1,
                x: isHovered ? -20 : 0
              }}
              transition={{ duration: 0.3 }}
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.5, delay: 0.1, ease: "easeOut" } }
              }}
            />
            
            {/* The Accent Dot */}
            <motion.circle 
              cx="502" cy="275" r="43" 
              className="fill-primary"
              animate={{ 
                cx: isHovered ? 180 : 502, // Moves the dot closer when the 'O' disappears
              }}
              transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
              variants={{
                hidden: { scale: 0 },
                visible: { scale: 1, transition: { duration: 0.5, delay: 0.2, type: "spring" } }
              }}
            />
          </g>
        </svg>
      </div>

      <motion.div
        className="overflow-hidden flex items-center"
        initial={{ width: 0, opacity: 0 }}
        animate={{ 
          width: isHovered ? "auto" : 0, 
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} // Custom spring-like easing
      >
        <span className="text-xl font-bold tracking-tight text-current whitespace-nowrap pl-2">
          Israel O<span className="text-primary">.</span>
        </span>
      </motion.div>
    </motion.div>
  );
}
