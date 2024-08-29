// import React, { useState } from "react";
// import { motion } from "framer-motion";

// const TextEditor: React.FC = () => {
//   const [content, setContent] = useState("");

//   return (
//     <motion.div
//       initial={{ opacity: 0, scale: 0.9 }}
//       animate={{ opacity: 1, scale: 1 }}
//       exit={{ opacity: 0, scale: 0.9 }}
//       className='absolute inset-4 overflow-hidden rounded-lg border border-gray-700 bg-black bg-opacity-80'
//     >
//       <h2 className='mb-4 text-lg text-white'>Text Editor</h2>
//       <textarea
//         value={content}
//         onChange={(e) => setContent(e.target.value)}
//         className='h-48 w-full resize-none rounded bg-gray-800 p-2 text-white'
//         placeholder='Start typing...'
//       />
//     </motion.div>
//   );
// };

// export default TextEditor;

// import React from "react";
// import { motion, PanInfo } from "framer-motion";

// interface TextBoxProps {
//   textBox: {
//     id: string;
//     text: string;
//     position: { x: number; y: number };
//   };
//   onDrag: (id: string, newPosition: { x: number; y: number }) => void;
// }

// const TextBox: React.FC<TextBoxProps> = ({ textBox, onDrag }) => {
//   return (
//     <motion.div
//       drag
//       dragMomentum={false}
//       initial={textBox.position}
//       className='absolute cursor-move'
//       onDragEnd={(
//         event: MouseEvent | TouchEvent | PointerEvent,
//         info: PanInfo
//       ) => {
//         onDrag(textBox.id, {
//           x: textBox.position.x + info.offset.x,
//           y: textBox.position.y + info.offset.y,
//         });
//       }}
//     >
//       <div className='font-dank-mono whitespace-nowrap italic text-[#748393]'>
//         {textBox.text}
//       </div>
//     </motion.div>
//   );
// };

// export default TextBox;
