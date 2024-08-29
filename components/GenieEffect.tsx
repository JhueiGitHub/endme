"use client";

import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

interface GenieEffectProps {
  isMinimizing: boolean;
  onAnimationComplete: () => void;
  children: React.ReactNode;
  iconPosition: { x: number; y: number };
}

const GenieEffect: React.FC<GenieEffectProps> = ({
  isMinimizing,
  onAnimationComplete,
  children,
  iconPosition,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshRef = useRef<THREE.Mesh<THREE.BufferGeometry> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = window.innerWidth;
    const height = window.innerHeight;
    const segmentWidth = 40;
    const segmentHeight = 30;

    // Setup Three.js scene
    sceneRef.current = new THREE.Scene();
    cameraRef.current = new THREE.PerspectiveCamera(
      50,
      width / height,
      1,
      1000
    );
    cameraRef.current.position.z = 500;
    rendererRef.current = new THREE.WebGLRenderer({ alpha: true });
    rendererRef.current.setSize(width, height);

    containerRef.current.appendChild(rendererRef.current.domElement);

    // Create mesh
    const geometry = new THREE.PlaneGeometry(
      width,
      height,
      segmentWidth,
      segmentHeight
    );
    const material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.7,
      wireframe: false,
    });
    meshRef.current = new THREE.Mesh(geometry, material);
    sceneRef.current.add(meshRef.current);

    // Animation function
    const animate = () => {
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  useEffect(() => {
    if (!meshRef.current || !iconPosition) return;

    const geometry = meshRef.current.geometry;
    const positions = geometry.attributes.position;
    const targetX = iconPosition.x - window.innerWidth / 2;
    const targetY = -(iconPosition.y - window.innerHeight / 2);

    if (isMinimizing) {
      for (let i = 0; i < positions.count; i++) {
        gsap.to(positions.array, {
          [i * 3]: targetX,
          [i * 3 + 1]: targetY,
          duration: 0.6,
          delay:
            Math.sqrt(
              Math.pow(targetX - positions.array[i * 3], 2) +
                Math.pow(targetY - positions.array[i * 3 + 1], 2)
            ) / 800,
          ease: "power2.inOut",
          onUpdate: () => {
            positions.needsUpdate = true;
          },
          onComplete: () => {
            if (i === positions.count - 1) onAnimationComplete();
          },
        });
      }
    } else {
      for (let i = 0; i < positions.count; i++) {
        const originalX = ((i % 41) - 20) * (window.innerWidth / 40);
        const originalY = (Math.floor(i / 41) - 15) * (window.innerHeight / 30);
        gsap.to(positions.array, {
          [i * 3]: originalX,
          [i * 3 + 1]: originalY,
          duration: 0.6,
          delay:
            Math.sqrt(
              Math.pow(targetX - originalX, 2) +
                Math.pow(targetY - originalY, 2)
            ) / 800,
          ease: "power2.inOut",
          onUpdate: () => {
            positions.needsUpdate = true;
          },
          onComplete: () => {
            if (i === positions.count - 1) onAnimationComplete();
          },
        });
      }
    }
  }, [isMinimizing, iconPosition, onAnimationComplete]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default GenieEffect;
