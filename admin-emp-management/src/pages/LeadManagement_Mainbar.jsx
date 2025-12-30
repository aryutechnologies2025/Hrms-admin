import React from 'react'
import Sidebar from '../components/Sidebar'
import Lead from '../components/Lead Management/Lead'

const LeadManagement_Mainbar = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar/>
      </div>
      
     <Lead />
    </div>
  )
}

export default LeadManagement_Mainbar