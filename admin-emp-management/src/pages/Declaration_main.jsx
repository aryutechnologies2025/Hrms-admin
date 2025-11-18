import React from 'react'
import Sidebar from '../components/Sidebar'
// import Revision_details from './Revision_details'
import Notes_details from './Notes_details'
import Declaration_details from './Declaration_details'

const Declaration_main = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar/>
      </div>
      
     <Declaration_details/>
    </div>
  )
}

export default Declaration_main