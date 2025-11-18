import React from 'react'


import Sidebar from '../Sidebar'
import Social_credentials_details from './Social_credentials_details'

const Social_credentials_main = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar/>
      </div>
      
     <Social_credentials_details/>
    </div>
  )
}

export default Social_credentials_main