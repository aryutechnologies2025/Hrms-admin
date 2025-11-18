import React from 'react'
import Sidebar from '../components/Sidebar'
import Invoice_full from './Invoice_full'


const Invoice_full_main = () => {
  return (
    <div className="flex">
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>
    <Invoice_full/>
    </div>
  )
}

export default Invoice_full_main