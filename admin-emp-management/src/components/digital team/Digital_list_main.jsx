import React from 'react'
import Sidebar from '../Sidebar'
import Digital_list_details from './Digital_list_details'

const Digital_list_main = () => {
  return (
    <div className="flex">
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>
    <Digital_list_details/>
    </div>
  )
}

export default Digital_list_main