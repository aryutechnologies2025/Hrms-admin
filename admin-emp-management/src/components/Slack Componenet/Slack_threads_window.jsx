


// import React, { useState } from "react";
// import Slack_editor from "./Slack_editor";

// export default function Slack_threads_window() {
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       sender: "Yuvaraj",
//       avatar: "https://randomuser.me/api/portraits/men/41.jpg",
//       message: "This file is hidden because it was uploaded 90 days ago.",
//       time: "2:43 PM",
//       replies: [
//         {
//           id: 11,
//           sender: "Kanimozhi",
//           avatar: "https://randomuser.me/api/portraits/women/33.jpg",
//           message: "Updated!",
//           time: "5:26 PM",
//         }
//       ],
//       showEditor: false
//     },
//     {
//       id: 2,
//       sender: "Yuvaraj",
//       avatar: "https://randomuser.me/api/portraits/men/34.jpg",
//       message: "Website created using create-react-app.",
//       time: "2:38 PM",
//       replies: [],
//       showEditor: false
//     }
//   ]);

//   const openReplyEditor = (id) => {
//     setMessages(prev =>
//       prev.map(m =>
//         m.id === id ? { ...m, showEditor: !m.showEditor } : m
//       )
//     );
//   };

//   const sendReply = (threadId, content) => {
//     setMessages(prev =>
//       prev.map(m =>
//         m.id === threadId
//           ? {
//               ...m,
//               replies: [
//                 ...m.replies,
//                 {
//                   id: Date.now(),
//                   sender: "You",
//                   avatar: "https://randomuser.me/api/portraits/men/11.jpg",
//                   message: content,
//                   time: new Date().toLocaleTimeString([], {
//                     hour: "2-digit",
//                     minute: "2-digit"
//                   })
//                 }
//               ],
//               showEditor: false
//             }
//           : m
//       )
//     );
//   };

//   return (
//     <div className="w-full h-screen bg-gray-100 p-5 overflow-y-auto space-y-5">

//       {messages.map(m => (
//         <div key={m.id} className="bg-white p-4 rounded-lg shadow">

//           {/* MAIN MESSAGE */}
//           <div className="flex items-center gap-3">
//             <img src={m.avatar} className="w-10 h-10 rounded-full" />
//             <div>
//               <p className="font-semibold">{m.sender}</p>
//               <p className="text-xs text-gray-400">{m.time}</p>
//             </div>
//           </div>

//           <div
//             className="mt-2 text-gray-800"
//             dangerouslySetInnerHTML={{ __html: m.message }}
//           />

//           {/* Reply Button */}
//           <button
//             onClick={() => openReplyEditor(m.id)}
//             className="text-blue-600 mt-2 flex items-center gap-1"
//           >
//             💬 Reply
//           </button>

//           {/* REPLY EDITOR */}
//           {m.showEditor && (
//             <div className="mt-3 ml-10">
//               <Slack_editor onSend={(content) => sendReply(m.id, content)} />
//             </div>
//           )}

//           {/* SHOW REPLIES */}
//           {m.replies.map(r => (
//             <div key={r.id} className="ml-10 mt-3 bg-gray-50 p-3 rounded-lg shadow">
//               <div className="flex items-center gap-2">
//                 <img src={r.avatar} className="w-8 h-8 rounded-full" />
//                 <p className="font-semibold">{r.sender}</p>
//                 <span className="text-xs text-gray-500">{r.time}</span>
//               </div>

//               <div
//                 className="mt-1"
//                 dangerouslySetInnerHTML={{ __html: r.message }}
//               />
//             </div>
//           ))}

//         </div>
//       ))}

//     </div>
//   );
// }



import React, { useState } from "react";
import Slack_editor from "./Slack_editor";
import Slack_header from "./Slack_header";
import {
    Hash,
    Lock,
   
} from "lucide-react";

export default function Slack_threads_window() {

    const [messages, setMessages] = useState([
        {
            id: 1,
            title: "medics-project-management-tool",
            subtitle: "kanimozhi and you",
            type: "private",
            sender: "Yuvaraj",
            avatar: "https://randomuser.me/api/portraits/men/41.jpg",
            message: "This file is hidden because it was uploaded 90 days ago.",
            time: "2:43 PM",
            replies: [
                {
                    id: 11,
                    sender: "Kanimozhi",
                    avatar: "https://randomuser.me/api/portraits/women/33.jpg",
                    message: "Updated!",
                    time: "5:26 PM",
                }
            ],
            showEditor: false
        },
        {
            id: 2,
            title: "Website Updates Thread",
            subtitle: "Yuvaraj and you",
            type: "common",
            sender: "Yuvaraj",
            avatar: "https://randomuser.me/api/portraits/men/34.jpg",
            message: "Website created using create-react-app.",
            time: "2:38 PM",
            replies: [],
            showEditor: false
        }
    ]);


    const openReplyEditor = (id) => {
        setMessages(prev =>
            prev.map(m =>
                m.id === id ? { ...m, showEditor: !m.showEditor } : m
            )
        );
    };

    const sendReply = (threadId, content) => {
        setMessages(prev =>
            prev.map(m =>
                m.id === threadId
                    ? {
                        ...m,
                        replies: [
                            ...m.replies,
                            {
                                id: Date.now(),
                                sender: "You",
                                avatar: "https://randomuser.me/api/portraits/men/11.jpg",
                                message: content,
                                time: new Date().toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })
                            }
                        ],
                        showEditor: false
                    }
                    : m
            )
        );
    };

    return (
<div className="w-full h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">

            <Slack_header theme="light" />

            {/* THREAD SECTION */}
            <div className="flex-1 overflow-y-auto p-5  ">
                {messages.map(m => (
                    <>
                        <div className="mb-10">
                            <div className="flex flex-col justify-center  ">
          <p className="text-sm font-medium flex items-center gap-2 text-black dark:text-gray-200">
                                    {m?.type === "private" ? <Lock size={16} /> : <Hash size={16}/>}
                                    {m?.title}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">{m?.subtitle}</p>
                            </div>

        <div className="bg-white dark:bg-gray-800 p-4 mt-2 rounded-lg shadow">

                                <div className="flex items-center gap-3">
                                    <img src={m.avatar} className="w-10 h-10 rounded-full" />
                                    <div className="">
              <p className="font-semibold text-black dark:text-gray-200">{m.sender}</p>
              <p className="text-xs text-gray-400 dark:text-gray-400">{m.time}</p>
                                    </div>
                                </div>

                                <div
                                    className="mt-2 text-gray-800 dark:text-gray-200"
                                    dangerouslySetInnerHTML={{ __html: m.message }}
                                />

                                {/* <button
                                onClick={() => openReplyEditor(m.id)}
                                className="text-blue-600 mt-2 flex items-center gap-1"
                            >
                                💬 Reply
                            </button> */}

                              {m.replies.map(r => (
                                    <div key={r.id} 
              className="ml-10 mt-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg shadow">
                                        <div className="flex items-center gap-2">
                                            <img src={r.avatar} className="w-8 h-8 rounded-full" />
                <p className="font-semibold text-black dark:text-gray-200">{r.sender}</p>
                <span className="text-xs text-gray-500 dark:text-gray-400">{r.time}</span>
                                        </div>

                                        <div
                className="mt-1 text-gray-800 dark:text-gray-200"
                                            dangerouslySetInnerHTML={{ __html: r.message }}
                                        />
                                    </div>
                                ))}

                                {/* {m.showEditor && ( */}
                                <div className="mt-3 ">
                                    <Slack_editor onSend={(content) => sendReply(m.id, content)} />
                                </div>
                                {/* )} */}

                              

                            </div>
                        </div>
                    </>
                ))}

            </div>

        </div>
    );
}
