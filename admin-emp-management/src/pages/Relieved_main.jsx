import React from 'react'
import Sidebar from '../components/Sidebar'
import Relieved_list_details from './Relieved_list_details.jsx'

const Relieved_main = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar/>
      </div>
      
     <Relieved_list_details/>
    </div>
  )
}

export default Relieved_main