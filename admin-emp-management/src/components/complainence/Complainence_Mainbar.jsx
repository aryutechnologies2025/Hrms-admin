import React from 'react'
import Sidebar from '../Sidebar'
import Complainence_Details from './Complainence_Details'

const Complainence_Mainbar = () => {
  return (
    <div className="flex">
      <div className='bg-gray-100 md:bg-white'>
        <Sidebar />
      </div>

      <Complainence_Details />
    </div>
  )
}

export default Complainence_Mainbar
