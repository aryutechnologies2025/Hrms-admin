
import AssectDocument from "../components/Assect Document/AssectDocument";
import Sidebar from "../components/Sidebar";


const AssentDocumentPage = () => {
  return (
    <div className='flex'>

     <div className="bg-gray-100 md:bg-white">
        <Sidebar/>
     </div>
     <AssectDocument/>
    </div>
  );
};

export default AssentDocumentPage;
