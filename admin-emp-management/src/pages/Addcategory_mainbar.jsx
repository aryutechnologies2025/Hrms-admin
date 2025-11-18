import React from 'react'
import Sidebar from '../components/Sidebar'

import Addcategory_details from './Addcategory_details'

const Addcategory_mainbar = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white ">
      <Sidebar/>
      
      </div>

     <Addcategory_details/>
    </div>
  )
}

export default Addcategory_mainbar