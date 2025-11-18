import React from 'react'
import Sidebar from '../components/Sidebar'
import EditEmployeeDetails_Mainbar from '../components/employees components/EditEmployeeDetails_Mainbar'

const EditEmployeeDetails = () => {
  return (
    <div className='flex'>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar/>
      </div>
      
     <EditEmployeeDetails_Mainbar/>
    </div>
  )
}

export default EditEmployeeDetails