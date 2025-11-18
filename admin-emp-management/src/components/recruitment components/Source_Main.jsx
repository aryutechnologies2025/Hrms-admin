import React from 'react'
import Source_Details from './Source_Details'
import Sidebar from '../Sidebar'

const Source_Main = () => {
  return (
    <div className='flex'>
      <div className="bg-gray-100 md:bg-white">
      <Sidebar />
      </div>

      <Source_Details />
     
    </div>
  )
}

export default Source_Main
