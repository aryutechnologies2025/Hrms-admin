import React from 'react'
import Sidebar from '../Sidebar'
import Task_details from './Task_details'
import Close_details from './Close_details'

const Close_home = () => {
  return (
    <div className="flex">
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>
    <Close_details/>
    </div>
  )
}

export default Close_home