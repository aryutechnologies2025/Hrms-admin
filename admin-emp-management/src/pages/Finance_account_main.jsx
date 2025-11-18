
import Sidebar from '../components/Sidebar'
import Finance_account_details from './Finance_account_details'

const Finance_account_main = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar/>
      </div>
      
     <Finance_account_details/>
    </div>
  )
}

export default Finance_account_main