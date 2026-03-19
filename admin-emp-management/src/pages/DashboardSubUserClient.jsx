import React from 'react'
import Sidebar from '../components/Sidebar'
import DashboardClientSubUser from '../components/dashboard components/DashboardClientSubUser'
import SubUserListClient from '../components/taskList/SubUserListClient'

const DashboardClientSubUserMain = () => {
  return (
    <div className='flex  '>
     <div className="bg-gray-100  md:bg-white">
          <Sidebar/>
     </div>
    <SubUserListClient/>
    </div>
  )
}

export default DashboardClientSubUserMain