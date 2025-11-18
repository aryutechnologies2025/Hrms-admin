import React from 'react'
import Sidebar from '../components/Sidebar'
import Leave_type_details from './Leave_type_details'

const Leave_type = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar/>
      </div>
      
     <Leave_type_details/>
    </div>
  )
}

export default Leave_type