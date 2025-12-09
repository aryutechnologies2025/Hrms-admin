import React, { useState, useEffect, useRef } from "react";



import Footer from "../Footer";
import Mobile_Sidebar from "../Mobile_Sidebar";
;
import { useNavigate } from "react-router-dom";
import Slack_sidebar from "./Slack_sidebar";
import Slack_chatwindow from "./Slack_chatwindow";


const Slack_details = () => {
  const navigate = useNavigate();

const [activeChat, setActiveChat] = useState({
    title: "General",
    avatar: "https://cdn-icons-png.flaticon.com/512/906/906343.png", // Default channel icon
    type: "channel"
  });

  return (
    <div className="flex flex-col justify-between bg-gray-100 w-screen min-h-screen ps-10 pb-0 pt-0 ">
      <div>
        

        <div className="cursor-pointer">
          <Mobile_Sidebar />
          
        </div>
            <div className="flex h-screen bg-gray-100">
     <Slack_sidebar setActiveChat={setActiveChat} />
      <Slack_chatwindow activeChat={activeChat} />
    </div>

        </div>

      {/* <Footer /> */}
    </div>
  );
};
export default Slack_details;
