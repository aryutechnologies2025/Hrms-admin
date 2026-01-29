import Portfolio_Details from "../../components/Portfolio components/Portfolio_Details"
import Sidebar from "../../components/Sidebar"


const Portfolio_Main = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar/>
      </div>
      
     <Portfolio_Details/>
    </div>
  )
}

export default Portfolio_Main