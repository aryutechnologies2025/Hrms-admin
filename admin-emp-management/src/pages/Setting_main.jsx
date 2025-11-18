import Sidebar from "../components/Sidebar";
import Settings_details from "./Settings_details";

const Setting_main = () => {
  return (
    <div className="flex">
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>

      <Settings_details />
    </div>
  );
};

export default Setting_main;