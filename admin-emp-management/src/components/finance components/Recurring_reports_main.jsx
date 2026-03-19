import React from 'react'

import Sidebar from '../Sidebar'
import Recurring_details_report from './Recurring_details_report'



const Recurring_reports_main = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar/>
      </div>
      
     <Recurring_details_report/>
    </div>
  )
}

export default Recurring_reports_main