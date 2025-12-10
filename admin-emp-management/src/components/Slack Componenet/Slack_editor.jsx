// import React, { useState, useRef, useEffect } from "react";
// import ReactQuill from "react-quill";
// import { SmilePlus, Send, Plus, Paperclip } from "lucide-react";
// import Picker from "emoji-picker-react";

// export default function Slack_editor({ onSend }) {
//   const [value, setValue] = useState("");
//   const [showEmoji, setShowEmoji] = useState(false);
//   const emojiRef = useRef(null);
//   const fileInputRef = useRef(null);

//   const handleSend = () => {
//     if (!value.trim()) return;
//     onSend(value); // optionally: onSend(makeLinksClickable(value))
//     setValue("");
//   };

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;
//     console.log("File selected:", file);
//     // You could upload it here and get a URL to insert in editor
//     // Example: setValue(prev => prev + ` ${file.url || file.name} `)
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (emojiRef.current && !emojiRef.current.contains(event.target)) {
//         setShowEmoji(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="relative bg-[#589ce0] border-t border-gray-700 p-3">
//       {showEmoji && (
//         <div ref={emojiRef} className="absolute bottom-16 left-10 z-50">
//           <Picker
//             onEmojiClick={(emojiData) =>
//               setValue((prev) => prev + emojiData.emoji)
//             }
//           />
//         </div>
//       )}

//       {/* Toolbar */}
//       <div className="flex justify-between items-center gap-3 mb-2">
//         <div className="flex  items-center gap-3 mb-2"><Plus size={22} className="text-gray-300 cursor-pointer" />
        
//         <input
//           type="file"
//           ref={fileInputRef}
//           className="hidden"
//           onChange={handleFileUpload}
//         />
//         <Paperclip
//           size={22}
//           className="text-gray-300 cursor-pointer"
//           onClick={() => fileInputRef.current.click()}
//         />

//         <SmilePlus
//           size={22}
//           className="text-gray-300 cursor-pointer"
//           onClick={() => setShowEmoji(!showEmoji)}
//         /></div>
//           <div className="flex justify-end mt-2">
//         <button
//           onClick={handleSend}
//           className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white rounded-lg"
//         >
//           <Send size={18} /> Send
//         </button>
//       </div>
//       </div>

//       {/* Editor */}
//       <div className="bg-black border border-gray-700 rounded-lg ">
//         <ReactQuill
//           theme="snow"
//           value={value}
//           onChange={setValue}
//           placeholder="Message..."
//           className="text-white"
//           modules={{
//             toolbar: [
//               ["bold", "italic", "underline"],
//               [{ list: "ordered" }, { list: "bullet" }],
//               ["code-block", "link"], 
//             ],
//           }}
//         />
//       </div>

    
//     </div>
//   );
// }



// import React, { useState, useRef, useEffect } from "react";
// import ReactQuill from "react-quill";
// import { SmilePlus, Send, Plus, Paperclip } from "lucide-react";
// import Picker from "emoji-picker-react";

// export default function Slack_editor({ onSend }) {
//   const [value, setValue] = useState("");
//   const [showEmoji, setShowEmoji] = useState(false);
//   const emojiRef = useRef(null);
//   const fileInputRef = useRef(null);

//   const handleSend = () => {
//     if (!value.trim()) return;
//     onSend(value);
//     setValue("");
//   };

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;
//     console.log("File selected:", file);
//   };

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (emojiRef.current && !emojiRef.current.contains(event.target)) {
//         setShowEmoji(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <div className="relative bg-gray-400 border-t border-blue-700 p-4 shadow-lg backdrop-blur-xl">
      
//       {/* Emoji Picker */}
//       {showEmoji && (
//         <div
//           ref={emojiRef}
//           className="absolute bottom-20 left-10 z-50 bg-white shadow-xl rounded-xl"
//         >
//           <Picker onEmojiClick={(e) => setValue((prev) => prev + e.emoji)} />
//         </div>
//       )}

//       {/* Toolbar */}
//       <div className="flex justify-between items-center mb-3">
//         {/* Left Buttons */}
//         <div className="flex items-center gap-4">
//           <Plus
//             size={22}
//             className="text-blue-100 hover:text-white transition cursor-pointer"
//           />

//           <input
//             type="file"
//             ref={fileInputRef}
//             className="hidden"
//             onChange={handleFileUpload}
//           />
//           <Paperclip
//             size={22}
//             className="text-blue-100 hover:text-white transition cursor-pointer"
//             onClick={() => fileInputRef.current.click()}
//           />

//           <SmilePlus
//             size={22}
//             className="text-blue-100 hover:text-white transition cursor-pointer"
//             onClick={() => setShowEmoji(!showEmoji)}
//           />
//         </div>

//         {/* Send Button */}
//         <button
//           onClick={handleSend}
//           className="flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 font-medium rounded-lg shadow-md transition"
//         >
//           <Send size={18} /> Send
//         </button>
//       </div>

//       {/* Editor */}
//       <div className="bg-white/10 border border-blue-300/30 rounded-xl overflow-hidden shadow-inner backdrop-blur-md">
//         <ReactQuill
//           theme="snow"
//           value={value}
//           onChange={setValue}
//           placeholder="Message…"
//           className="text-white"
//           modules={{
//             toolbar: [
//               ["bold", "italic", "underline"],
//               [{ list: "ordered" }, { list: "bullet" }],
//               ["code-block", "link"],
//             ],
//           }}
//         />
//       </div>
//     </div>
//   );
// }



import React, { useState, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import { SmilePlus, Send, Plus, Paperclip } from "lucide-react";
import Picker from "emoji-picker-react";

export default function Slack_editor({ onSend }) {
  const [value, setValue] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const emojiRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleSend = () => {
    if (!value.trim()) return;
    onSend(value);
    setValue("");
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    console.log("File selected:", file);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmoji(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
const modules = {
    syntax: {
      highlight: (text) => hljs.highlightAuto(text).value
    },
    toolbar: [
      [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean'],
      ['code-block']
    ]
  };
  return (
<div className="relative bg-white dark:bg-gray-900 border-t border-gray-300 dark:border-gray-700 p-4 shadow-md">

      {/* Emoji Picker */}
      {showEmoji && (
        <div
          ref={emojiRef}
      className="absolute bottom-20 left-0 z-50 bg-white dark:bg-gray-800 text-black dark:text-gray-200 border border-gray-300 dark:border-gray-700 shadow-lg rounded-xl"
        >
          <Picker
            theme="dark"
            onEmojiClick={(e) => setValue((prev) => prev + e.emoji)}
          />
        </div>
      )}

      {/* Toolbar */}
      <div className="flex justify-between items-center mb-3">

        {/* Left Buttons */}
        <div className="flex items-center gap-3 flex-nowrap">
          <Plus
            size={22}
        className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition cursor-pointer"
          />

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
          />

          <Paperclip
            size={22}
        className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition cursor-pointer"
            onClick={() => fileInputRef.current.click()}
          />

          <SmilePlus
            size={22}
        className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition cursor-pointer"
            onClick={() => setShowEmoji(!showEmoji)}
          />
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
      className="flex items-center gap-2 bg-black dark:bg-blue-600 text-white hover:bg-gray-800 dark:hover:bg-blue-700 px-4 py-2 font-medium rounded-lg shadow-md transition"
        >
          <Send size={18} /> Send
        </button>
      </div>

      {/* Editor */}
  <div className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden shadow-inner">
        <ReactQuill
          theme="snow"
          value={value}
          onChange={setValue}
          placeholder="Message…"
      className="text-black dark:text-gray-200 bg-white dark:bg-gray-800"
         
          modules={{
  toolbar: [
    // Text formatting
    [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline', 'strike'],        // Bold, Italic, Underline, Strike
    [{ 'color': [] }, { 'background': [] }],         // Text and background color

    // Paragraph
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
    [{ 'align': [] }],

    // Media
    ['link', 'image', 'video'],

    // Others
    ['clean'],                                      // Remove formatting
    ['code-block']                                  // Code block
  ]
}}

        />
      </div>
    </div>
  );
}
