"use client";

import React from "react";
import dynamic from "next/dynamic";

const FigmaApp = dynamic(() => import("./App"), {
  loading: () => <div>Loading Figma Clone...</div>,
  ssr: false,
});

const FigmaCloneWrapper: React.FC = () => {
  return (
    <div className='h-full w-full overflow-hidden'>
      <FigmaApp />
    </div>
  );
};

export default FigmaCloneWrapper;
