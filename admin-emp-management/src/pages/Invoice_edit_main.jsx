import React from 'react'
import Sidebar from '../components/Sidebar'
import Invoice_full from './Invoice_full'
import Invoice_edit from './Invoice_edit'


const Invoice_edit_main = () => {
  return (
    <div className="flex">
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>
    <Invoice_edit/>
    </div>
  )
}

export default Invoice_edit_main