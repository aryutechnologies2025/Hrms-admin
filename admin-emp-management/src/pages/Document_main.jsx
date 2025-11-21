import Document_details from "../components/Document_updload/Document_details";
import Sidebar from "../components/Sidebar";


const Document_main = () => {
  return (
    <div className='flex'>

     <div className="bg-gray-100 md:bg-white">
          <Sidebar/>
     </div>

     <Document_details/>

    </div>
  );
};

export default Document_main;
