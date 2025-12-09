import React from "react";
import { Search, MoreVertical } from "lucide-react";

export default function Slack_header() {
  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">

      <div className="flex items-center gap-3 w-full">
        <div className="relative w-[100%]">
          <input
            className="bg-gray-100 px-3 py-1 rounded-md text-sm pl-8 w-[70%]"
            placeholder="Search...Aryu Enterprises Pvt Ltd"
          />
          <Search className="absolute top-1.5 left-2 text-gray-500" size={16} />
        </div>

        <MoreVertical className="text-gray-600 cursor-pointer" />
      </div>
    </div>
  );
}
