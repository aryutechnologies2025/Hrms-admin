import React from 'react'
import Sidebar from '../components/Sidebar'
// import Revision_details from './Revision_details'
import Notes_details from './Notes_details'

const Notes_main = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar/>
      </div>
      
     <Notes_details/>
    </div>
  )
}

export default Notes_main