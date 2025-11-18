import React from 'react'
import Sidebar from '../components/Sidebar'
import PresentedEmployees_Mainbar from '../components/presented employees components/PresentedEmployees_Mainbar'

const PresentedEmployees = () => {
  return (
     <div className="flex">
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>
      <PresentedEmployees_Mainbar/>
    </div>
  )
}

export default PresentedEmployees