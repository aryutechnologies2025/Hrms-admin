
import Sidebar from '../components/Sidebar'
import Finance_lender_details from './Finance_lender_details'

const Finance_lender_main = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar/>
      </div>
      
     <Finance_lender_details/>
    </div>
  )
}

export default Finance_lender_main