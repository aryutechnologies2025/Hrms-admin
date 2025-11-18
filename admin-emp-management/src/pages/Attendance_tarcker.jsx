import Attendance_trackerdetails from '../components/attendance components/Attendance_trackerdetails';
import Sidebar from '../components/Sidebar'

const Attendance_tracker = () => {
  return <div className='flex '>

     <div className="bg-gray-100 md:bg-white">
     <Sidebar/>
     </div>
     
     <Attendance_trackerdetails/>
  </div>;
};

export default Attendance_tracker;