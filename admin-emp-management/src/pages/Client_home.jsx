import React from 'react'
import Sidebar from '../components/Sidebar'
import Client_details from './Client_details'

const Client_home = () => {
  return (
    <div className="flex">
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>
    <Client_details/>
    </div>
  )
}

export default Client_home