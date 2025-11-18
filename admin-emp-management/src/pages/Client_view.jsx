import Sidebar from "../components/Sidebar";
import Client_view_details from "./Client_view_details.jsx";

const Client_view = () => {
  return (
    <div className="flex">
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>
      <Client_view_details/>
    </div>
  );
};

export default Client_view;