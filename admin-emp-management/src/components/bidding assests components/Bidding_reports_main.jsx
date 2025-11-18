import React from 'react'

import Account_bidding_details from './Account_bidding_details'
import Sidebar from '../Sidebar'
import Tech_bidding_details from './Tech_bidding_details'
import Bidding_details from './Bidding_details'
import Bidding_reports_details from './Bidding_reports_details'

const Bidding_reports_main = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar/>
      </div>
      
     <Bidding_reports_details/>
    </div>
  )
}

export default Bidding_reports_main