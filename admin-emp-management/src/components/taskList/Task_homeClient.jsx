import React from 'react'
import Sidebar from '../Sidebar'
import Task_details_client from './Task_details_client.jsx'

const Task_homeClient = () => {
  return (
    <div className="flex">
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>
    <Task_details_client/>
    </div>
  )
}

export default Task_homeClient