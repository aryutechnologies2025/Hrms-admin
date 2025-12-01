import React from 'react'
import Sidebar from '../components/Sidebar'
import Announcement_Details from '../components/Announcement components/Announcement_Details'

const Announcement = () => {
  return (
    <div className='flex'>
      
      <div className='bg-gray-100 md:bg-white'>
        <Sidebar />
      </div>

      <Announcement_Details />
    </div>
  )
}

export default Announcement
