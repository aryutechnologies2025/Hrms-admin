// import React from "react";
// import Slack_header from "./Slack_header";
// import { Paperclip, Send, SmilePlus, Plus, Code } from "lucide-react";

// export default function Slack_chatwindow() {
//   const messages = [
//     {
//       id: 1,
//       sender: "Moni",
//       time: "12:57 PM",
//       type: "text",
//       message: `<button
//                 onClick={() => navigate(-1)}
//                 className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded-md duration-300"
//                 > Back </button>`
//     },
//     {
//       id: 2,
//       sender: "bharathwaj",
//       time: "2:43 PM",
//       type: "text",
//       message: `paginatorTemplate="RowsPerPageDropdown FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"`
//     },
//     {
//       id: 3,
//       sender: "Moni",
//       time: "7:13 PM",
//       type: "file",
//       fileName: "dist.zip",
//       fileType: "Zip"
//     }
//   ];

//   return (
//     <div className="flex-1 flex flex-col bg-[#1a1d21] text-white">

//       <Slack_header />

//       {/* Messages Area */}
//       <div className="flex-1 overflow-y-auto px-8 py-6 space-y-10 custom-scroll">

//         {/* Date Divider */}
//         <div className="flex items-center gap-4">
//           <div className="flex-1 border-t border-gray-600"></div>
//           <span className="text-gray-400 text-sm">Thursday, December 4th</span>
//           <div className="flex-1 border-t border-gray-600"></div>
//         </div>

//         {messages.map((msg) => (
//           <div key={msg.id} className="space-y-1">

//             {/* Name + Time */}
//             <div className="flex items-center gap-2">
//               <p className="font-semibold">{msg.sender}</p>
//               <span className="text-xs text-gray-400">{msg.time}</span>
//             </div>

//             {/* Text Message */}
//             {msg.type === "text" && (
//               <pre className="bg-[#222529] text-gray-200 px-4 py-3 rounded-lg text-sm whitespace-pre-wrap">
//                 {msg.message}
//               </pre>
//             )}

//             {/* File Message */}
//             {msg.type === "file" && (
//               <div className="bg-[#202226] p-4 rounded-xl border border-gray-700 w-64">
//                 <p className="text-gray-300 text-sm font-semibold">{msg.fileName}</p>
//                 <p className="text-gray-500 text-xs">{msg.fileType}</p>
//                 <div className="mt-3 bg-[#2b2f33] p-3 rounded-lg text-center text-sm cursor-pointer hover:bg-[#32363b]">
//                   📦 {msg.fileName}
//                 </div>
//               </div>
//             )}

//           </div>
//         ))}
//       </div>

//       {/* Bottom Chat Input */}
//       <div className="p-4 bg-[#181b1e] border-t border-gray-700 flex items-center gap-3">

//         <Plus size={22} className="text-gray-300 cursor-pointer" />
//         <SmilePlus size={22} className="text-gray-300 cursor-pointer" />
//         <Paperclip size={22} className="text-gray-300 cursor-pointer" />
//         <Code size={22} className="text-gray-300 cursor-pointer" />

//         <input
//           placeholder="Message Moni"
//           className="
//             flex-1 px-4 py-2 bg-[#222529] text-white 
//             rounded-lg outline-none border border-gray-700 
//             focus:border-gray-500
//           "
//         />

//         <Send size={22} className="text-gray-300 cursor-pointer" />
//       </div>

//     </div>
//   );
// }


// import React, { useState } from "react";
// import Slack_header from "./Slack_header";
// import Slack_editor from "./Slack_editor";

// export default function Slack_chatwindow() {
//   const [messages, setMessages] = useState([
//     { id: 1, sender: "Yuvaraj", message: "Hey team! Any updates?", time: "10:30 AM" },
//     { id: 2, sender: "You", message: "Yes, working on it!", time: "10:32 AM" }
//   ]);

//   const handleSend = (msg) => {
//     setMessages((prev) => [
//       ...prev,
//       {
//         id: prev.length + 1,
//         sender: "You",
//         message: msg,
//         time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//       }
//     ]);
//   };

//   return (
//     <div className="w-full h-screen flex flex-col bg-blue-50">
//       <Slack_header />

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-white shadow-inner">
//         {messages.map((msg) => (
//           <div key={msg.id} className="flex flex-col">
//             <div className="flex items-center gap-2">
//               <p className="font-semibold text-blue-700">{msg.sender}</p>
//               <span className="text-xs text-gray-500">{msg.time}</span>
//             </div>

//             <div
//               className="text-gray-800"
//               dangerouslySetInnerHTML={{ __html: msg.message }}
//             />
//           </div>
//         ))}
//       </div>

//       {/* Slack-like Editor */}
//       <Slack_editor onSend={handleSend} />
//     </div>
//   );
// }
// import React, { useState } from "react";
// import Slack_header from "./Slack_header";
// import Slack_editor from "./Slack_editor";

// export default function Slack_chatwindow() {
//   const [messages, setMessages] = useState([
//     { id: 1, sender: "Yuvaraj", message: "Hey team! Any updates?", time: "10:30 AM" },
//     { id: 2, sender: "You", message: "Yes, working on it!", time: "10:32 AM" }
//   ]);

//   const handleSend = (msg) => {
//     setMessages((prev) => [
//       ...prev,
//       {
//         id: prev.length + 1,
//         sender: "You",
//         message: msg,
//         time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
//       }
//     ]);
//   };

//   return (
//     <div className="w-full h-screen flex flex-col bg-gray-100">

//       {/* Header */}
//       <Slack_header theme="light" />

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-white shadow-inner">
//         {messages.map((msg) => (
//           <div key={msg.id} className="flex flex-col">
//             <div className="flex items-center gap-2">
//               <p className="font-semibold text-black">{msg.sender}</p>
//               <span className="text-xs text-gray-500">{msg.time}</span>
//             </div>

//             <div
//               className="text-black"
//               dangerouslySetInnerHTML={{ __html: msg.message }}
//             />
//           </div>
//         ))}
//       </div>

//       {/* Slack-like Editor */}
//       <Slack_editor onSend={handleSend} />
//     </div>
//   );
// }


import React, { useState, useRef, useEffect } from "react";
import Slack_header from "./Slack_header";
import Slack_editor from "./Slack_editor";
import { Reply } from "lucide-react";


export default function Slack_chatwindow(activeChat) {

  const Alldeatils = activeChat?.activeChat;

  console.log("Alldeatils", Alldeatils)

  const chatWith = {
    name: "Dipi",
    avatar: "https://photosmint.com/wp-content/uploads/2025/03/Indian-Beauty-DP.jpeg"
  };


  const [messages, setMessages] = useState([
    {
      id: 1, sender: "Dipi",
      avatar: "https://photosmint.com/wp-content/uploads/2025/03/Indian-Beauty-DP.jpeg",
      message: "Hey ", time: "10:30 AM"
    },

  ]);

  const messagesEndRef = useRef(null);

  const stripHTML = (html) => {
    return html.replace(/<[^>]+>/g, "");
  };
  const [replyTo, setReplyTo] = useState(null);

  const handleSend = (msg) => {
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        sender: "You",
        message: msg,
        replyTo: replyTo,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
    setReplyTo(null);
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);



  return (
    <div className="w-full h-screen flex flex-col bg-gray-100">

      {/* Header */}
      <Slack_header theme="light" />
      {/* <div className="h-14 bg-white flex items-center gap-3 px-4 shadow">
        <img
          src={Alldeatils.avatar}
          alt={Alldeatils.name}
          className="w-10 h-10 rounded-full"
        />
        <p className="font-semibold text-lg">{Alldeatils.title}</p>
      </div> */}

      <div className="h-14 bg-white flex items-center gap-3 px-4 shadow">
        <div className="relative">
          <img
            src={Alldeatils.avatar}
            alt={Alldeatils.name}
            className="w-10 h-10 rounded-full"
          />

          {/* GREEN ONLINE DOT */}
          {Alldeatils.online && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          )}
        </div>

        <p className="font-semibold text-lg">{Alldeatils.title}</p>
      </div>

      {/* Messages */}
      {/* <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-white shadow-inner">
        {messages.map((msg) => (
          <div key={msg.id} className="flex flex-col">
            <div className="flex items-center gap-2">
              <p className="font-semibold text-black">{msg.sender}</p>
              <span className="text-xs text-gray-500">{msg.time}</span>
            </div>

            <div
              className="text-black"
              dangerouslySetInnerHTML={{ __html: msg.message }}
            />
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div> */}

      {/* <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-white shadow-inner">
  {messages.map((msg) => (
    <div key={msg.id} className="flex flex-col">
      <div className="flex items-start gap-2">
        <img
          src={msg.avatar} 
          alt={msg.sender}
          className="w-8 h-8 rounded-full"
        />

        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-black">{msg.sender}</p>
            <span className="text-xs text-gray-500">{msg.time}</span>
          </div>

            {msg.replyTo && (
                  <div className="bg-gray-100 border-l-4 border-blue-500 px-2 py-1 text-sm text-gray-600 mb-1 rounded">
                    Replying to <b>{msg.replyTo.sender}</b>:{" "}
                    {msg.replyTo.message.slice(0, 40)}...
                  </div>
                )}

          <div
            className="text-black"
            dangerouslySetInnerHTML={{ __html: msg.message }}
          />
        </div>
      </div>
      <button
              onClick={() => setReplyTo(msg)}
              className="text-xs text-blue-600 hover:underline ml-10"
            >
              Reply
            </button>
    </div>
  ))}

  <div ref={messagesEndRef} />
</div> */}

      <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-white shadow-inner">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="flex flex-col group relative"  // group for hover
          >
            <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50">

              {/* Avatar */}
              <img
                src={msg.avatar}
                alt={msg.sender}
                className="w-8 h-8 rounded-full"
              />

              <div className="flex flex-col">

                {/* Sender + Time */}
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-black">{msg.sender}</p>
                  <span className="text-xs text-gray-500">{msg.time}</span>
                </div>

                {/* Reply Preview Block */}
                {msg.replyTo && (
                  <div className="bg-gray-100 border-l-4 border-blue-500 px-2 py-1 text-sm text-gray-600 mb-1 rounded">
                    Replying to <b>{msg.replyTo.sender}</b>:{" "}
                    {stripHTML(msg.replyTo.message).slice(0, 40)}...
                  </div>
                )}

                {/* Message */}
                <div
                  className="text-black"
                  dangerouslySetInnerHTML={{ __html: msg.message }}
                />
              </div>
            </div>

            {/* Reply Icon Button (Shows on Hover) */}
            <button
              onClick={() => setReplyTo(msg)}
              className="
          absolute right-2 top-2 
          hidden group-hover:flex 
          items-center gap-1 
          text-gray-600 hover:text-blue-600 
          text-xs px-2 py-1 
          rounded-md
        "
            >
              <Reply size={14} />
              Reply
            </button>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>


      {replyTo && (
        <div className="px-4 py-2 bg-blue-50 border-l-4 border-blue-500 mb-1 flex justify-between items-center">
          <div>
            <p className="font-semibold">Replying to {replyTo.sender}</p>
            <p className="text-gray-600 text-sm"> {stripHTML(replyTo.message)}</p>
          </div>

          <button
            onClick={() => setReplyTo(null)}
            className="text-red-500 text-sm font-semibold"
          >
            Cancel
          </button>
        </div>
      )}


      {/* Slack-like Editor */}
      <Slack_editor onSend={handleSend} />
    </div>
  );
}
