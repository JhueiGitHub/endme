"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface GenieAppProps {
  onClose: () => void;
}

const GenieApp: React.FC<GenieAppProps> = ({ onClose }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleAnimate = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <div className="w-full h-full bg-gray-900 text-white p-4">
      <h2 className="text-2xl mb-4">Genie Effect Prototype</h2>
      <button
        onClick={handleAnimate}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4"
      >
        Animate
      </button>
      <button
        onClick={onClose}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Close
      </button>
      <motion.div
        className="mt-8 w-32 h-32 bg-purple-500 rounded-lg"
        animate={
          isAnimating
            ? {
                scale: [1, 1.5, 0.5, 1],
                rotate: [0, 90, 180, 0],
                borderRadius: ["0%", "50%", "50%", "0%"],
              }
            : {}
        }
        transition={{ duration: 0.5 }}
      />
    </div>
  );
};

export default GenieApp;
