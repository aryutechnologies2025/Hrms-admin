import React from 'react'


import Sidebar from '../Sidebar'
import Social_account_details from './Social_account_details'

const Social_account_main = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar/>
      </div>
      
     <Social_account_details/>
    </div>
  )
}

export default Social_account_main