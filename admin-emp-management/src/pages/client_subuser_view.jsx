import Sidebar from "../components/Sidebar";
import Client_view_SubUser_details from "./client_view_subUser_details.jsx";

const Client_view_subuser = () => {
  return (
    <div className="flex">
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>
      <Client_view_SubUser_details/>
    </div>
  );
};

export default Client_view_subuser;