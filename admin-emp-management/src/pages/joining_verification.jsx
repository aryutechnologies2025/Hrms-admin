import React from 'react'
import Sidebar from '../components/Sidebar'
import Joining_verification_list_details from './Joining_verification_list_details.jsx'

const joining_verification = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar/>
      </div>
      
     <Joining_verification_list_details/>
    </div>
  )
}

export default joining_verification