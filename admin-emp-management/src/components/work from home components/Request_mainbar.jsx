import React from 'react'
import Sidebar from '../../components/Sidebar'

import Request_details from './Request_details'

const Request_mainbar = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar/>
      </div>

     <Request_details/>
    </div>
  )
}

export default Request_mainbar