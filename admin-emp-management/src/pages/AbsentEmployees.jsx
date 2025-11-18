import React from 'react'
import Sidebar from '../components/Sidebar'
import AbsentEmployees_Mainbar from '../components/absent employees components/AbsentEmployees_Mainbar'

const AbsentEmployees = () => {
  return (
     <div className="flex">
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>
      <AbsentEmployees_Mainbar />
    </div>
  )
}

export default AbsentEmployees