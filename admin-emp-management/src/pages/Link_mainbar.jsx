import React from 'react'
import Sidebar from '../components/Sidebar'
import Link_details from './Link_details'

const Link_mainbar = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar/>
      </div>

     <Link_details/>
    </div>
  )
}

export default Link_mainbar