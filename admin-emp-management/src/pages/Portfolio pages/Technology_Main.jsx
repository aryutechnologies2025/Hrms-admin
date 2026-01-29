import Technology_Details from "../../components/Portfolio components/Technology_Details"
import Sidebar from "../../components/Sidebar"


const Technology_Main = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar/>
      </div>
      
     <Technology_Details/>
    </div>
  )
}

export default Technology_Main