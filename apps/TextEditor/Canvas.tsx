"use client";

import React, { useState, useRef, useEffect } from "react";
import TextBox from "./TextBox";
import { db } from "../../../lib/firebase";
import { ref, onValue, set, push, update, remove } from "firebase/database";
import ContextMenu from "../../../contexts/ContextMenu";

interface TextBoxData {
  id: string;
  text: string;
  position: { x: number; y: number };
  style?: {
    fontFamily?: string;
    fontSize?: string;
    background?: string;
    WebkitBackgroundClip?: string;
    WebkitTextFillColor?: string;
    color?: string;
  };
}

const Canvas: React.FC = () => {
  const [textBoxes, setTextBoxes] = useState<TextBoxData[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingPosition, setTypingPosition] = useState({ x: 0, y: 0 });
  const [currentText, setCurrentText] = useState("");
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [isCommandMenuVisible, setIsCommandMenuVisible] = useState(false);
  const [currentCommand, setCurrentCommand] = useState("");
  const [currentStyle, setCurrentStyle] = useState<TextBoxData["style"]>();
  const canvasRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const textBoxesRef = ref(db, "textBoxes");
    const unsubscribe = onValue(textBoxesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const textBoxesArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...(value as Omit<TextBoxData, "id">),
        }));
        setTextBoxes(textBoxesArray);
      } else {
        setTextBoxes([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleCanvasDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const newPosition = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      setTypingPosition(newPosition);
      setIsTyping(true);
      setCurrentText("");
      setCurrentStyle(undefined);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      createTextBox();
    } else if (e.key === "/") {
      setIsCommandMenuVisible(true);
      setCurrentCommand("/");
      e.preventDefault();
    } else if (isCommandMenuVisible) {
      if (
        e.key === "Tab" &&
        (currentCommand === "/ex" || currentCommand === "/e")
      ) {
        e.preventDefault();
        handleCommandSelect("exemplar");
      } else if (e.key === "Escape") {
        setIsCommandMenuVisible(false);
        setCurrentCommand("");
      } else {
        setCurrentCommand((prev) => prev + e.key);
      }
    }
  };

  const createTextBox = () => {
    if (currentText) {
      const textBoxesRef = ref(db, "textBoxes");
      const newTextBox: Omit<TextBoxData, "id"> = {
        text: currentText,
        position: typingPosition,
      };

      if (currentStyle) {
        newTextBox.style = currentStyle;
      }

      push(textBoxesRef, newTextBox);
    }
    setIsTyping(false);
    setCurrentText("");
    setIsCommandMenuVisible(false);
    setCurrentCommand("");
    setCurrentStyle(undefined);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentText(e.target.value);
  };

  const handleTextBoxDrag = (
    id: string,
    newPosition: { x: number; y: number }
  ) => {
    const updates: { [key: string]: any } = {};
    updates[`/textBoxes/${id}/position`] = newPosition;
    update(ref(db), updates);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const wipeDatabase = () => {
    const textBoxesRef = ref(db, "textBoxes");
    remove(textBoxesRef).then(() => {
      setTextBoxes([]);
    });
    closeContextMenu();
  };

  const handleCommandSelect = (command: string) => {
    if (command === "exemplar") {
      setCurrentStyle({
        fontFamily: "ExemplarPro",
        fontSize: "1.2em",
        background: "linear-gradient(45deg, #492F9F, #2A1B70)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
      });
      setCurrentText(""); // Clear the text, removing "/ex" or "/e"
    }
    setIsCommandMenuVisible(false);
    setCurrentCommand("");
    inputRef.current?.focus();
  };

  return (
    <div
      ref={canvasRef}
      className='absolute inset-4 overflow-hidden rounded-lg border border-gray-700 bg-black bg-opacity-80'
      onDoubleClick={handleCanvasDoubleClick}
      onClick={() => {
        if (isTyping) {
          createTextBox();
        }
        closeContextMenu();
      }}
      onContextMenu={handleContextMenu}
    >
      <div className='absolute inset-0 overflow-hidden'>
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className='absolute bottom-0 left-0 w-full object-cover opacity-30'
          style={{ transform: "translateY(45%)" }}
        >
          <source src='/media/bh.mp4' type='video/mp4' />
          Your browser does not support the video tag.
        </video>
      </div>
      {isTyping && (
        <input
          ref={inputRef}
          type='text'
          value={currentText}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          className={`font-dank-mono absolute z-10 bg-transparent italic outline-none ${
            currentStyle?.fontFamily === "ExemplarPro"
              ? "font-exemplar text-[1.2em]"
              : "text-[#748393]"
          }`}
          style={{
            left: typingPosition.x,
            top: typingPosition.y,
            width: `${Math.max(1, currentText.length)}ch`,
            ...currentStyle,
            backgroundClip: currentStyle?.WebkitBackgroundClip,
            WebkitBackgroundClip: currentStyle?.WebkitBackgroundClip,
            color: currentStyle?.color,
          }}
          autoFocus
        />
      )}
      {textBoxes.map((textBox) => (
        <TextBox
          key={textBox.id}
          textBox={textBox}
          onDrag={handleTextBoxDrag}
        />
      ))}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          options={[{ label: "Wipe Database", onClick: wipeDatabase }]}
          onClose={closeContextMenu}
        />
      )}
      {isCommandMenuVisible && (
        <div
          className='absolute z-50 rounded-md border border-gray-700 bg-black bg-opacity-80 py-1 shadow-lg'
          style={{ left: typingPosition.x, top: typingPosition.y + 20 }}
        >
          <div
            className='font-dank-mono cursor-pointer px-4 py-2 text-white hover:bg-gray-700'
            onClick={() => handleCommandSelect("exemplar")}
          >
            Exemplar
          </div>
        </div>
      )}
    </div>
  );
};

export default Canvas;
