import React from 'react'
import Sidebar from '../components/Sidebar'
import Reports_details from './Reports_details'

const Reports_mainbar = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar/>
      </div>
      
     <Reports_details/>
    </div>
  )
}

export default Reports_mainbar