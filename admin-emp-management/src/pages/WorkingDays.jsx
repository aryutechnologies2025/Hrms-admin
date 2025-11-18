import React from 'react'
import WorkingDays_Mainbar from '../components/workingdays components/WorkingDays_Mainbar'
import Sidebar from '../components/Sidebar'

const WorkingDays = () => {
  return (
     <div className="flex">
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>

      <WorkingDays_Mainbar/>
    </div>
  )
}

export default WorkingDays