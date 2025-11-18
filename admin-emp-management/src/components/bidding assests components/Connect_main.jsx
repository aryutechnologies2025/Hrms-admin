import React from 'react'

import Sidebar from '../Sidebar'

import Connect_details from './Connect_details'

const Connect_main = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar/>
      </div>
      
     <Connect_details/>
    </div>
  )
}

export default Connect_main