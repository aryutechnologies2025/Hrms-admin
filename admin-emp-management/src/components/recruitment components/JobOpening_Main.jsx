import React from 'react'
import Sidebar from '../Sidebar'
import JobOpening_Details from './JobOpening_Details'

const JobOpening_Main = () => {
  return (
    <div className='flex'>
      <div className="bg-gray-100 md:bg-white">
      <Sidebar />
      </div>
      <JobOpening_Details />
    </div>
  )
}

export default JobOpening_Main
