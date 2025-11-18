import React from 'react'
import Sidebar from '../components/Sidebar'
import Letters_details from './Letters_details'

const Letters_main = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar/>
      </div>
      
     <Letters_details/>
    </div>
  )
}

export default Letters_main