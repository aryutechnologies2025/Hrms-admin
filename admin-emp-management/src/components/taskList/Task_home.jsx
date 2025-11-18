import React from 'react'
import Sidebar from '../Sidebar'
import Task_details from './Task_details'

const Task_home = () => {
  return (
    <div className="flex">
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>
    <Task_details/>
    </div>
  )
}

export default Task_home