import React from 'react'
import Sidebar from '../components/Sidebar'
import Revision_details from './Revision_details'

const Revision = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar/>
      </div>
      
     <Revision_details/>
    </div>
  )
}

export default Revision