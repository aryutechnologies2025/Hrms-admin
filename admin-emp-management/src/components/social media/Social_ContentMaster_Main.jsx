import React from 'react'
import Sidebar from '../Sidebar'
import Social_ContentMaster_Details from './Social_ContentMaster_Details'

const Social_ContentMaster_Main = () => {
  return (
    <div className='flex '>
    
          <div className="bg-gray-100 md:bg-white">
          <Sidebar />
          </div>
          
          <Social_ContentMaster_Details />
        </div> 
  )
}

export default Social_ContentMaster_Main
