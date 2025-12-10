// import React from "react";
// import { Search, MoreVertical } from "lucide-react";

// export default function Slack_header() {
//   return (
//     <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">

//       <div className="flex items-center gap-3 w-full">
//         <div className="relative w-[100%]">
//           <input
//             className="bg-gray-100 px-3 py-1 rounded-md text-sm pl-8 w-[70%]"
//             placeholder="Search...Aryu Enterprises Pvt Ltd"
//           />
//           <Search className="absolute top-1.5 left-2 text-gray-500" size={16} />
//         </div>

//         <MoreVertical className="text-gray-600 cursor-pointer" />
//       </div>
//     </div>
//   );
// }



import React, { useState,useRef,useEffect } from "react";
import { Search, Sun, Moon } from "lucide-react";

export default function Slack_header({ darkMode, setDarkMode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  console.log("menuOpen",menuOpen)

  const setTheme = (mode) => {
 if (mode === "dark") {
  document.documentElement.classList.add("dark");
  setDarkMode(true);
} else {
  document.documentElement.classList.remove("dark");
  setDarkMode(false);
}
  };


  const menuRef = useRef(null);

// close when clicking outside
useEffect(() => {
  const handleClick = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setMenuOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClick);
  return () => document.removeEventListener("mousedown", handleClick);
}, []);

  return (
    <div className="h-14 bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 flex items-center justify-between px-4">

      {/* Search */}
      <div className="relative w-[70%]">
        <input
          className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md text-sm pl-8 w-full
                     text-black dark:text-gray-200 dark:placeholder-gray-400"
          placeholder="Search… Aryu Enterprises Pvt Ltd"
        />
        <Search
          className="absolute top-1.5 left-2 text-gray-500 dark:text-gray-400"
          size={16}
        />
      </div>

      {/* Dark Mode Toggle */}
      {/* <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded bg-gray-200 dark:bg-gray-700 dark:text-gray-200 hover:brightness-90 flex items-center gap-2"
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          {darkMode ? "Dark" : "Light"}
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700">
            <p
              onClick={() => setTheme("light")}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              🌞 Light Mode
            </p>
            <p
              onClick={() => setTheme("dark")}
              className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
            >
              🌙 Dark Mode
            </p>
          </div>
        )}
      </div> */}

      {/* Theme Toggle Button */}
<div className="relative" ref={menuRef}>
  <button
    onClick={() => setMenuOpen(!menuOpen)}
    className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 dark:text-gray-200 
               hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center gap-2"
  >
    {darkMode ? <Sun size={16} /> : <Moon size={16} />}
  </button>

  {/* Floating Panel */}
  {menuOpen && (
    <div
      className="absolute right-0 mt-3 w-48 p-3 z-50 bg-white dark:bg-gray-800 shadow-xl 
                 rounded-xl border border-gray-200 dark:border-gray-700 animate-slideDown"
    >
      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
        Appearance
      </h4>

      <div
        onClick={() => setTheme("light")}
        className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer 
                   hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        <Sun size={16} className="text-yellow-500" />
        <span className="text-sm text-gray-800 dark:text-gray-200">Light Mode</span>
      </div>

      <div
        onClick={() => setTheme("dark")}
        className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer 
                   hover:bg-gray-100 dark:hover:bg-gray-700 transition mt-1"
      >
        <Moon size={16} className="text-blue-400" />
        <span className="text-sm text-gray-800 dark:text-gray-200">Dark Mode</span>
      </div>
    </div>
  )}
</div>

    </div>
  );
}



