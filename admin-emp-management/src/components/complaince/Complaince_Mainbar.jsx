import React from 'react'
import Sidebar from '../Sidebar'
import Complaince_Details from './Complaince_Details'

const Complaince_Mainbar = () => {
  return (
    <div className="flex">
      <div className='bg-gray-100 md:bg-white'>
        <Sidebar />
      </div>

      <Complaince_Details />
    </div>
  )
}

export default Complaince_Mainbar
