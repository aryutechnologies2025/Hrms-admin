import React from 'react'
import InterViewStatus_Details from './InterViewStatus_Details'
import Sidebar from '../Sidebar'

const InterViewStatus_Main = () => {
  return (
   <div className='flex'>
      <div className="bg-gray-100 md:bg-white">
      <Sidebar />
      </div>

      <InterViewStatus_Details />
     
    </div>
  )
}

export default InterViewStatus_Main
