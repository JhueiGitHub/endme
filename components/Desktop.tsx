"use client";

import React, { useState } from "react";
import DockManager from "./DockManager";
import Window from "./Window";

interface OpenWindow {
  id: string;
  title: string;
  appId: string;
}

const Desktop: React.FC = () => {
  const [openWindows, setOpenWindows] = useState<OpenWindow[]>([]);

  const handleOpenWindow = (appId: string) => {
    console.log(`Opening window for ${appId}`);
    const newWindow: OpenWindow = {
      id: `window-${Date.now()}`,
      title: appId,
      appId: appId,
    };
    setOpenWindows((prev) => [...prev, newWindow]);
  };

  const handleCloseWindow = (id: string) => {
    console.log(`Closing window ${id}`);
    setOpenWindows((prev) => prev.filter((window) => window.id !== id));
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      >
        <source src="/media/siamese.mp4" type="video/mp4" />
      </video>
      {openWindows.map((window) => (
        <Window
          key={window.id}
          id={window.id}
          title={window.title}
          appId={window.appId}
          onClose={() => handleCloseWindow(window.id)}
        />
      ))}
      <DockManager onOpenWindow={handleOpenWindow} />
    </div>
  );
};

export default Desktop;
