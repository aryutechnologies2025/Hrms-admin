import React from 'react'
import Sidebar from '../components/Sidebar'
import DashboardClient_Mainbar from '../components/dashboard components/DashboardClient_Mainbar'

const DashboardClient = () => {
  return (
    <div className='flex  '>
     <div className="bg-gray-100  md:bg-white">
          <Sidebar/>
     </div>
     <DashboardClient_Mainbar/>
    </div>
  )
}

export default DashboardClient