import React from 'react'
import Sidebar from '../components/Sidebar'
// import Revision_details from './Revision_details'
import Notes_details from './Notes_details'
import Leave_option_details from './Leave_option_details'

const Leave_option_main = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar/>
      </div>
      
     <Leave_option_details/>
    </div>
  )
}

export default Leave_option_main