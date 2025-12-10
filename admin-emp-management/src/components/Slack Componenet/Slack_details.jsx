import React, { useState, useEffect, useRef } from "react";



import Footer from "../Footer";
import Mobile_Sidebar from "../Mobile_Sidebar";
;
import { useNavigate } from "react-router-dom";
import Slack_sidebar from "./Slack_sidebar";
import Slack_chatwindow from "./Slack_chatwindow";
import Slack_threads_window from "./Slack_threads_window";


const Slack_details = () => {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  const [activeChat, setActiveChat] = useState({
    title: "General",
    avatar: "https://cdn-icons-png.flaticon.com/512/906/906343.png", // Default channel icon
    type: "channel"
  });

    React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);


  return (
    <div className="flex flex-col justify-between bg-gray-100 dark:bg-gray-900 w-screen min-h-screen ps-10 pb-0 pt-0 ">
      <div>


        <div className="cursor-pointer">
          <Mobile_Sidebar />

        </div>
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
          <Slack_sidebar setActiveChat={setActiveChat} />
          {/* <Slack_chatwindow activeChat={activeChat} /> */}
          {activeChat?.type === "threads" ? (
            <Slack_threads_window />
          ) : (
            <Slack_chatwindow activeChat={activeChat} />
          )}
        </div>

      </div>

      {/* <Footer /> */}
    </div>
  );
};
export default Slack_details;
// import React, { useState } from "react";
// import Slack_sidebar from "./Slack_sidebar";
// import Slack_chatwindow from "./Slack_chatwindow";
// import Slack_threads_window from "./Slack_threads_window";
// import Slack_header from "./Slack_header";

// export default function Slack_details() {
//   const [darkMode, setDarkMode] = useState(false);

//   const [activeChat, setActiveChat] = useState({
//     title: "General",
//     avatar: "https://cdn-icons-png.flaticon.com/512/906/906343.png",
//     type: "channel",
//   });

//   return (
//     <div
//       className={`flex flex-col justify-between min-h-screen w-full 
//         bg-gray-200 text-black 
//         dark:bg-gray-900 dark:text-gray-200`}
//     >
//       {/* <Slack_header darkMode={darkMode} setDarkMode={setDarkMode} /> */}

//       <div className="flex h-[calc(100vh-56px)]">
//         <Slack_sidebar setActiveChat={setActiveChat} />

//         {activeChat?.type === "threads" ? (
//           <Slack_threads_window />
//         ) : (
//           <Slack_chatwindow activeChat={activeChat} />
//         )}
//       </div>
//     </div>
//   );
// }
