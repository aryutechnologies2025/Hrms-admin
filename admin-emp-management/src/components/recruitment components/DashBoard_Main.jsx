import React from 'react'
import Sidebar from '../Sidebar'
import DashBoard_Details from './DashBoard_Details'

const DashBoard_Main = () => {
  return (
    <div className='flex'>
      <div className="bg-gray-100 md:bg-white">
      <Sidebar />
      </div>

      <DashBoard_Details />
       
    </div>
  )
}

export default DashBoard_Main
