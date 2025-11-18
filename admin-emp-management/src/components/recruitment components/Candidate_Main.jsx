import React from 'react'
import Candidate_Details from './Candidate_Details'
import Sidebar from '../Sidebar'

const Candidate_Main = () => {
  return (
    <div className='flex'>
      <div className="bg-gray-100 md:bg-white">
      <Sidebar />
      </div>

      <Candidate_Details />
     
    </div>
  )
}

export default Candidate_Main
