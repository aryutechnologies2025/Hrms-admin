import React from 'react'
import Sidebar from '../components/Sidebar'
import Reliving_list_details from './Reliving_list_details.jsx'

const Reliving_list = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar/>
      </div>
      
     <Reliving_list_details/>
    </div>
  )
}

export default Reliving_list