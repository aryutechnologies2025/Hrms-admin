import React from 'react'
import Sidebar from '../Sidebar'
import Task_details from './Task_details'
import Close_detailsClient from './Close_detailsClient'

const Close_homeClient = () => {
  return (
    <div className="flex">
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>
    <Close_detailsClient/>
    </div>
  )
}

export default Close_homeClient