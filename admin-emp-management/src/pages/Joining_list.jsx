import React from 'react'
import Sidebar from '../components/Sidebar'
import Joining_list_details from './Joining_list_details.jsx'

const Joining_list = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar/>
      </div>
      
     <Joining_list_details/>
    </div>
  )
}

export default Joining_list