import React from 'react'
import Sidebar from '../components/Sidebar'
import Link_details from './Link_details'
import AddLinks_details from './AddLinks_details'

const AddLink_mainbar = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar/>
      </div>

     <AddLinks_details/>
    </div>
  )
}

export default AddLink_mainbar