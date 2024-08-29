import React from "react";

interface CommandMenuProps {
  isVisible: boolean;
  onSelect: (command: string) => void;
}

const CommandMenu: React.FC<CommandMenuProps> = ({ isVisible, onSelect }) => {
  if (!isVisible) return null;

  return (
    <div className="absolute bg-black bg-opacity-80 border border-gray-700 rounded-md shadow-lg py-1 z-50">
      <div
        className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-white font-dank-mono"
        onClick={() => onSelect("exemplar")}
      >
        Exemplar
      </div>
    </div>
  );
};

export default CommandMenu;
