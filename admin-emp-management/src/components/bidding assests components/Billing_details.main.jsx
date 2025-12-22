import React from 'react'

import Sidebar from '../Sidebar'

import Bidding_transaction_details from './Bidding_transaction_details'
import Billing_details_all from './Billing_details_all'

const Billing_details_main = () => {
  return (
    <div className='flex '>

      <div className="bg-gray-100 md:bg-white">
      <Sidebar/>
      </div>
      
     <Billing_details_all/>
    </div>
  )
}

export default Billing_details_main