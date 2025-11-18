import WorkFromHome_Mainbar from "../components/leaves components/WorkFromHome_Mainbar";
import Sidebar from "../components/Sidebar";

const WorkFromHome = () => {
  return (
    <div className="flex">
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>

      <WorkFromHome_Mainbar/>
    </div>
  );
};

export default WorkFromHome;
