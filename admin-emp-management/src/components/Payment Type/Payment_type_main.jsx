import React from 'react'

import Payment_type_details from './Payment_type_details'
import Sidebar from '../Sidebar'

const Payment_type_main = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar/>
      </div>
      
     <Payment_type_details/>
    </div>
  )
}

export default Payment_type_main