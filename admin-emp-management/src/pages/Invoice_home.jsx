import React from 'react'
import Sidebar from '../components/Sidebar'
import Invoice_details from './Invoice_details'

const Invoice_home = () => {
  return (
    <div className="flex">
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>
    <Invoice_details/>
    </div>
  )
}

export default Invoice_home