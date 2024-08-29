"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import GenieApp from "./GenieApp";
import { appDefinitions, AppDefinition } from "../types/AppTypes";

interface WindowProps {
  id: string;
  title: string;
  appId: string;
  onClose: () => void;
}

const Window: React.FC<WindowProps> = ({ id, title, appId, onClose }) => {
  const [isMinimizing, setIsMinimizing] = useState(false);
  const controls = useAnimation();
  const app = appDefinitions.find((a) => a.id === appId) as AppDefinition;
  const windowRef = useRef<HTMLDivElement>(null);

  const getIconPosition = () => {
    const dockIcon = document.getElementById(`dock-icon-${appId}`);
    if (dockIcon) {
      const rect = dockIcon.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    }
    return { x: 0, y: 0 };
  };

  useEffect(() => {
    const iconPosition = getIconPosition();
    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      controls.set({
        scale: 0,
        x: iconPosition.x - rect.width / 2,
        y: iconPosition.y - rect.height / 2,
      });
      controls.start({
        scale: 1,
        x: 0,
        y: 0,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30,
        },
      });
    }
  }, [controls, appId]);

  const handleMinimize = () => {
    setIsMinimizing(true);
    const iconPosition = getIconPosition();
    if (windowRef.current) {
      const rect = windowRef.current.getBoundingClientRect();
      controls
        .start({
          scale: 0,
          x: iconPosition.x - rect.width / 2,
          y: iconPosition.y - rect.height / 2,
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
          },
        })
        .then(() => {
          onClose();
          setIsMinimizing(false);
        });
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={windowRef}
        key={id}
        initial={false}
        animate={controls}
        exit={{
          scale: 0,
          ...getIconPosition(),
          transition: {
            type: "spring",
            stiffness: 300,
            damping: 30,
          },
        }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          pointerEvents: isMinimizing ? "none" : "auto",
        }}
      >
        <div className="w-4/5 h-4/5 bg-black bg-opacity-70 rounded-lg overflow-hidden shadow-2xl border border-gray-800">
          <div className="bg-gray-900 px-4 py-2 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleMinimize}
                className="w-3 h-3 rounded-full bg-yellow-500"
              />
              <button
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-red-500"
              />
              <button className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <h2 className="text-white text-sm font-medium">{title}</h2>
            <div className="w-14"></div>
          </div>
          <div className="p-4 text-white h-full overflow-auto">
            {appId === "GenieApp" ? (
              <GenieApp onClose={onClose} />
            ) : (
              <p>Content for {title}</p>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Window;
