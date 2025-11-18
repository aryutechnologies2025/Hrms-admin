
import Mom_mainbar from "../components/minutesofmeeting/Mom_mainbar";
import Sidebar from "../components/Sidebar";


const Mom = () => {
  return (
    <div className='flex'>

     <div className="bg-gray-100 md:bg-white">
          <Sidebar/>
     </div>

     <Mom_mainbar />

    </div>
  );
};

export default Mom;
