import React from 'react'
import Sidebar from '../components/Sidebar'
import Holidays_Mainbar from '../components/holidays components/Holidays_Mainbar'

const Hoildays = () => {
  return (
     <div className="flex">
      <div className="bg-gray-100 md:bg-white">
        <Sidebar />
      </div>
      <Holidays_Mainbar/>
    </div>
  )
}

export default Hoildays