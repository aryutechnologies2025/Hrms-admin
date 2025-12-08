import React from 'react'
import Sidebar from '../Sidebar'
import Recurring_Details from './Recurring_Details'

const Recurring_Mainbar = () => {
  return (
    <div className='flex'>
      <div className='bg-gray-100 md:bg-white'>
        <Sidebar />
      </div>

      <Recurring_Details />
    </div>
  )
}

export default Recurring_Mainbar
