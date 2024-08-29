"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useSpring, useTransform, useMotionValue } from "framer-motion";
import { appDefinitions, AppDefinition } from "../types/AppTypes";

const DOCK_SIZE = 64;
const DOCK_PADDING = 8;
const MAGNIFICATION = 2;
const MAGNIFICATION_RANGE = 150;
const PROXIMITY_THRESHOLD = 150;

interface DockManagerProps {
  onOpenWindow: (appId: string) => void;
}

const DockManager: React.FC<DockManagerProps> = ({ onOpenWindow }) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { stiffness: 300, damping: 30 };
  const dockY = useSpring(100, springConfig);
  const dockScale = useSpring(0.5, springConfig);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const updateMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const shouldShow = window.innerHeight - e.clientY < PROXIMITY_THRESHOLD;
      dockY.set(shouldShow ? 0 : 100);
      dockScale.set(shouldShow ? 1 : 0.5);
    };

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("mousemove", updateMouse);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("mousemove", updateMouse);
      window.removeEventListener("resize", handleResize);
    };
  }, [mouseX, mouseY, dockY, dockScale]);

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 flex justify-center"
      style={{ y: dockY, scale: dockScale, transformOrigin: "bottom" }}
    >
      <div className="bg-opacity-24 flex items-end rounded-t-[19px] bg-black px-2 py-2 backdrop-blur-md">
        {appDefinitions.map((app, index) => (
          <motion.div
            key={app.id}
            className="mx-1"
            style={{
              width: DOCK_SIZE,
              height: DOCK_SIZE,
              scale: useTransform(mouseX, (value) => {
                const iconCenter =
                  windowWidth / 2 +
                  (index - appDefinitions.length / 2 + 0.5) *
                    (DOCK_SIZE + DOCK_PADDING);
                const distance = Math.abs(value - iconCenter);
                return distance < MAGNIFICATION_RANGE
                  ? 1 +
                      (MAGNIFICATION - 1) * (1 - distance / MAGNIFICATION_RANGE)
                  : 1;
              }),
            }}
          >
            <Image
              id={`dock-icon-${app.id}`}
              src={app.icon}
              alt={app.name}
              width={DOCK_SIZE}
              height={DOCK_SIZE}
              className="cursor-pointer rounded-xl"
              onClick={() => {
                console.log(`Clicked ${app.id}`);
                onOpenWindow(app.id);
              }}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default DockManager;
