import React from 'react'
import Sidebar from '../Sidebar'
import JobType_Details from './JobType_Details'

const JobType_main = () => {
  return (
    <div className='flex'>
      <div className="bg-gray-100 md:bg-white">
      <Sidebar/>
      </div>

      <JobType_Details />
     
    </div>
  )
}

export default JobType_main
